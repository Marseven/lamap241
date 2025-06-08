import * as GarameLogic from "./garameLogic";

export class AIDecisionMaker {
  constructor() {
    this.difficulty = "normal"; // easy, normal, hard
  }

  /**
   * Prendre une décision intelligente sur quelle carte jouer
   * @param {Array} aiCards - Cartes de l'IA
   * @param {Object} gameState - État complet du jeu
   * @returns {Object} - Carte choisie et raison
   */
  makeDecision(aiCards, gameState) {
    const {
      lastCard,
      currentRound,
      roundWins,
      hasControl,
      playerCards,
      playerTableCards,
      opponentTableCards,
    } = gameState;

    // Analyser la situation
    const situation = this.analyzeSituation(aiCards, gameState);

    // Choisir la stratégie appropriée
    const strategy = this.chooseStrategy(situation, gameState);

    // Sélectionner la carte selon la stratégie
    const decision = this.selectCard(aiCards, lastCard, strategy, situation);

    console.log(`🤖 IA Decision:`, {
      round: currentRound,
      strategy: strategy.name,
      card: decision.card,
      reason: decision.reason,
      situation: situation.summary,
    });

    return decision;
  }

  /**
   * Analyser la situation actuelle
   */
  analyzeSituation(aiCards, gameState) {
    const { lastCard, currentRound, roundWins, hasControl, playerCards } =
      gameState;

    // Analyse des cartes
    const cardSum = GarameLogic.calculateCardSum(aiCards);
    const playerCardSum = GarameLogic.calculateCardSum(playerCards);
    const highCards = aiCards.filter((c) => c.value >= 8);
    const lowCards = aiCards.filter((c) => c.value <= 5);
    const threes = aiCards.filter((c) => c.value === 3);

    // Analyse des familles
    const families = this.analyzeFamilies(aiCards);
    const strongFamilies = Object.keys(families).filter(
      (suit) => families[suit].length >= 2
    );

    // Analyse de la position dans la partie
    const turnsRemaining = 5 - currentRound;
    const needsToWin = this.needsToWinRemainingTurns(roundWins, currentRound);
    const canAffordToLose = turnsRemaining > needsToWin;

    // Analyse de la carte adverse si elle existe
    const opponentThreat = this.analyzeOpponentThreat(lastCard, aiCards);

    return {
      cardSum,
      playerCardSum,
      highCards: highCards.length,
      lowCards: lowCards.length,
      threes: threes.length,
      strongFamilies,
      families,
      turnsRemaining,
      needsToWin,
      canAffordToLose,
      opponentThreat,
      hasControl,
      isLastTurn: currentRound === 5,
      summary: `T${currentRound}/5, ${
        hasControl ? "HAS_CONTROL" : "RESPONDING"
      }, Sum:${cardSum}, Threat:${opponentThreat.level}`,
    };
  }

  /**
   * Analyser les familles de cartes
   */
  analyzeFamilies(cards) {
    const families = { "♠": [], "♥": [], "♣": [], "♦": [] };

    cards.forEach((card) => {
      families[card.suit].push(card);
    });

    // Trier chaque famille par valeur
    Object.keys(families).forEach((suit) => {
      families[suit].sort((a, b) => a.value - b.value);
    });

    return families;
  }

  /**
   * Analyser la menace de la carte adverse
   */
  analyzeOpponentThreat(lastCard, aiCards) {
    if (!lastCard) {
      return { level: "none", canCounter: true, counterCards: aiCards };
    }

    const sameFamily = aiCards.filter((c) => c.suit === lastCard.suit);
    const higherCards = sameFamily.filter((c) => c.value > lastCard.value);

    let level = "low";
    if (lastCard.value >= 9) level = "high";
    else if (lastCard.value >= 7) level = "medium";

    return {
      level,
      canCounter: higherCards.length > 0,
      counterCards: higherCards,
      mustPlay: sameFamily.length > 0,
      sacrificeCards: sameFamily.filter((c) => c.value <= lastCard.value),
    };
  }

  /**
   * Déterminer combien de tours l'IA doit encore gagner
   */
  needsToWinRemainingTurns(roundWins, currentRound) {
    const aiWins = roundWins.filter((winner) => winner === "ia").length;
    const playerWins = roundWins.filter((winner) => winner === "player").length;

    // Dans le Garame, il faut avoir la main au dernier tour
    // Donc l'IA doit s'assurer d'être en position de force
    if (currentRound === 5) return 1; // Doit gagner le dernier tour
    if (currentRound === 4) return 2; // Doit contrôler les 2 derniers tours

    return Math.max(1, 3 - aiWins); // Stratégie générale
  }

  /**
   * Choisir la stratégie appropriée
   */
  chooseStrategy(situation, gameState) {
    const {
      isLastTurn,
      hasControl,
      needsToWin,
      canAffordToLose,
      threes,
      opponentThreat,
    } = situation;

    // Stratégie tour final - CRITIQUE
    if (isLastTurn) {
      if (hasControl) {
        return threes > 0
          ? { name: "KORA_ATTEMPT", priority: "highest" }
          : { name: "SECURE_WIN", priority: "highest" };
      } else {
        return opponentThreat.canCounter
          ? { name: "FIGHT_FOR_CONTROL", priority: "highest" }
          : { name: "MINIMIZE_LOSS", priority: "high" };
      }
    }

    // Stratégies en cours de partie
    if (hasControl) {
      if (!canAffordToLose) {
        return { name: "MAINTAIN_CONTROL", priority: "high" };
      } else {
        return { name: "STRATEGIC_PLAY", priority: "medium" };
      }
    } else {
      if (opponentThreat.canCounter && needsToWin <= 2) {
        return { name: "AGGRESSIVE_COUNTER", priority: "high" };
      } else if (opponentThreat.mustPlay) {
        return { name: "SMART_SACRIFICE", priority: "medium" };
      } else {
        return { name: "FLEXIBLE_RESPONSE", priority: "medium" };
      }
    }
  }

  /**
   * Sélectionner la carte selon la stratégie
   */
  selectCard(aiCards, lastCard, strategy, situation) {
    switch (strategy.name) {
      case "KORA_ATTEMPT":
        return this.selectForKora(aiCards, situation);

      case "SECURE_WIN":
        return this.selectForSecureWin(aiCards, lastCard, situation);

      case "FIGHT_FOR_CONTROL":
        return this.selectForFightControl(aiCards, lastCard, situation);

      case "MAINTAIN_CONTROL":
        return this.selectForMaintainControl(aiCards, situation);

      case "STRATEGIC_PLAY":
        return this.selectForStrategicPlay(aiCards, situation);

      case "AGGRESSIVE_COUNTER":
        return this.selectForAggressiveCounter(aiCards, lastCard, situation);

      case "SMART_SACRIFICE":
        return this.selectForSmartSacrifice(aiCards, lastCard, situation);

      case "MINIMIZE_LOSS":
      case "FLEXIBLE_RESPONSE":
      default:
        return this.selectForFlexibleResponse(aiCards, lastCard, situation);
    }
  }

  /**
   * Stratégies spécifiques de sélection de cartes
   */
  selectForKora(aiCards, situation) {
    const threes = aiCards.filter((c) => c.value === 3);
    if (threes.length > 0) {
      return {
        card: threes[0],
        reason: "Tentative de KORA avec un 3 au tour final",
      };
    }

    // Fallback : jouer la plus forte carte
    const strongest = aiCards.reduce((max, card) =>
      card.value > max.value ? card : max
    );
    return {
      card: strongest,
      reason: "Jouer la plus forte carte pour sécuriser la victoire",
    };
  }

  selectForSecureWin(aiCards, lastCard, situation) {
    if (!lastCard) {
      // Premier à jouer : jouer une carte forte mais pas la plus forte
      const sortedCards = [...aiCards].sort((a, b) => b.value - a.value);
      const cardToPlay = sortedCards[1] || sortedCards[0];
      return {
        card: cardToPlay,
        reason: "Sécuriser la victoire avec une carte forte",
      };
    }

    return this.selectForFlexibleResponse(aiCards, lastCard, situation);
  }

  selectForFightControl(aiCards, lastCard, situation) {
    const { counterCards } = situation.opponentThreat;

    if (counterCards.length > 0) {
      // Jouer la plus petite carte qui peut prendre
      const bestCounter = counterCards.reduce((min, card) =>
        card.value < min.value ? card : min
      );
      return {
        card: bestCounter,
        reason: `Contre-attaque avec ${bestCounter.value}${bestCounter.suit} pour reprendre le contrôle`,
      };
    }

    return this.selectForSmartSacrifice(aiCards, lastCard, situation);
  }

  selectForMaintainControl(aiCards, situation) {
    // Jouer une carte qui oblige l'adversaire à jouer fort mais pas notre meilleure
    const { strongFamilies, families } = situation;

    // Éviter de jouer nos cartes les plus fortes en début de partie
    if (situation.turnsRemaining > 2) {
      const midRangeCards = aiCards.filter((c) => c.value >= 5 && c.value <= 7);
      if (midRangeCards.length > 0) {
        const cardToPlay =
          midRangeCards[Math.floor(Math.random() * midRangeCards.length)];
        return {
          card: cardToPlay,
          reason: `Contrôle avec carte moyenne ${cardToPlay.value}${cardToPlay.suit}`,
        };
      }
    }

    if (strongFamilies.length > 0) {
      // Jouer une carte d'une famille forte mais pas la plus forte
      const strongFamily = families[strongFamilies[0]];
      const cardIndex = Math.min(1, strongFamily.length - 1);
      const cardToPlay = strongFamily[cardIndex];
      return {
        card: cardToPlay,
        reason: `Maintenir le contrôle avec ${cardToPlay.value}${cardToPlay.suit} de famille forte`,
      };
    }

    // Jouer une carte moyenne
    const sortedCards = [...aiCards].sort((a, b) => a.value - b.value);
    const midIndex = Math.floor(sortedCards.length / 2);
    return {
      card: sortedCards[midIndex],
      reason: "Maintenir le contrôle avec carte moyenne",
    };
  }

  selectForStrategicPlay(aiCards, situation) {
    // Jouer de manière à garder les bonnes cartes pour plus tard
    const lowCards = aiCards.filter((c) => c.value <= 6);

    if (lowCards.length > 0) {
      const cardToPlay = lowCards.reduce((min, card) =>
        card.value < min.value ? card : min
      );
      return {
        card: cardToPlay,
        reason: `Jeu stratégique - garder les fortes cartes pour plus tard`,
      };
    }

    return this.selectForFlexibleResponse(aiCards, null, situation);
  }

  selectForAggressiveCounter(aiCards, lastCard, situation) {
    const { counterCards } = situation.opponentThreat;

    if (counterCards.length > 0) {
      // Jouer la plus forte carte qui peut prendre
      const strongestCounter = counterCards.reduce((max, card) =>
        card.value > max.value ? card : max
      );
      return {
        card: strongestCounter,
        reason: `Contre-attaque agressive avec ${strongestCounter.value}${strongestCounter.suit}`,
      };
    }

    return this.selectForSmartSacrifice(aiCards, lastCard, situation);
  }

  selectForSmartSacrifice(aiCards, lastCard, situation) {
    const { sacrificeCards, mustPlay } = situation.opponentThreat;

    if (mustPlay && sacrificeCards.length > 0) {
      // Sacrifier la plus petite carte de la famille
      const sacrifice = sacrificeCards.reduce((min, card) =>
        card.value < min.value ? card : min
      );
      return {
        card: sacrifice,
        reason: `Sacrifice intelligent de ${sacrifice.value}${sacrifice.suit}`,
      };
    }

    return this.selectForFlexibleResponse(aiCards, lastCard, situation);
  }

  selectForFlexibleResponse(aiCards, lastCard, situation) {
    // Réponse par défaut intelligente
    if (!lastCard) {
      // Premier à jouer : jouer une carte moyenne-forte
      const sortedCards = [...aiCards].sort((a, b) => b.value - a.value);
      const cardIndex = Math.min(1, sortedCards.length - 1);
      return {
        card: sortedCards[cardIndex],
        reason: "Ouverture avec carte moyenne-forte",
      };
    }

    // Logique de réponse standard
    const playableCards = GarameLogic.getPlayableCards(aiCards, lastCard);

    if (playableCards.length === 0) {
      // Aucune carte jouable - jouer la plus petite
      const smallest = aiCards.reduce((min, card) =>
        card.value < min.value ? card : min
      );
      return {
        card: smallest,
        reason: "Aucune carte jouable - défausse la plus petite",
      };
    }

    // Cartes jouables disponibles
    if (playableCards.length === 1) {
      return {
        card: playableCards[0],
        reason: "Seule carte jouable disponible",
      };
    }

    // Choisir intelligemment parmi les cartes jouables
    const bestCard = this.chooseBestPlayableCard(playableCards, situation);
    return {
      card: bestCard,
      reason: `Meilleur choix parmi ${playableCards.length} cartes jouables`,
    };
  }

  /**
   * Choisir la meilleure carte parmi celles jouables
   */
  chooseBestPlayableCard(playableCards, situation) {
    const { turnsRemaining, canAffordToLose } = situation;

    // Tri par valeur
    const sortedPlayable = [...playableCards].sort((a, b) => a.value - b.value);

    if (canAffordToLose && turnsRemaining > 2) {
      // Jouer conservateur - plus petite carte jouable
      return sortedPlayable[0];
    } else {
      // Jouer plus agressif - carte moyenne ou forte
      const midIndex = Math.floor(sortedPlayable.length / 2);
      return sortedPlayable[midIndex];
    }
  }
}

export default AIDecisionMaker;
