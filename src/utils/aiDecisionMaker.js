import * as GarameLogic from "./garameLogic";

export class AIDecisionMaker {
  constructor() {
    this.difficulty = "normal"; // easy, normal, hard
  }

  /**
   * Prendre une décision intelligente sur quelle carte jouer
   * EN RESPECTANT OBLIGATOIREMENT LES RÈGLES
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

    // RÈGLE ABSOLUE : Vérifier d'abord les contraintes de jeu
    const playableCards = GarameLogic.getPlayableCards(aiCards, lastCard);

    if (playableCards.length === 0) {
      console.error("🚨 IA: Aucune carte jouable détectée !");
      return {
        card: aiCards[0],
        reason: "Erreur - aucune carte jouable",
      };
    }

    console.log(`🤖 IA Analysis:`, {
      aiCardsCount: aiCards.length,
      playableCount: playableCards.length,
      lastCard: lastCard ? `${lastCard.value}${lastCard.suit}` : "none",
      hasControl: hasControl,
    });

    // Analyser la situation
    const situation = this.analyzeSituation(aiCards, gameState);

    // Choisir la stratégie appropriée
    const strategy = this.chooseStrategy(situation, gameState);

    // Sélectionner la carte EN RESPECTANT LES RÈGLES
    const decision = this.selectCardWithRules(
      aiCards,
      lastCard,
      strategy,
      situation
    );

    // VÉRIFICATION FINALE : La carte choisie est-elle valide ?
    const isValid = playableCards.some(
      (pc) => pc.value === decision.card.value && pc.suit === decision.card.suit
    );

    if (!isValid) {
      console.error("🚨 ERREUR IA: Carte choisie non valide !", decision.card);
      console.log(
        "Cartes jouables:",
        playableCards.map((c) => `${c.value}${c.suit}`)
      );

      // Fallback de sécurité
      return {
        card: playableCards[0],
        reason: "Fallback de sécurité - première carte jouable",
      };
    }

    console.log(`🤖 IA Decision finale:`, {
      round: currentRound,
      strategy: strategy.name,
      card: `${decision.card.value}${decision.card.suit}`,
      reason: decision.reason,
      isValid: true,
    });

    return decision;
  }

  /**
   * Sélectionner une carte en respectant OBLIGATOIREMENT les règles
   */
  selectCardWithRules(aiCards, lastCard, strategy, situation) {
    // Obtenir les cartes réellement jouables selon les règles
    const playableCards = GarameLogic.getPlayableCards(aiCards, lastCard);

    if (playableCards.length === 0) {
      return {
        card: aiCards[0],
        reason: "Erreur - pas de cartes jouables",
      };
    }

    if (playableCards.length === 1) {
      return {
        card: playableCards[0],
        reason: "Seule carte autorisée par les règles",
      };
    }

    // Si premier à jouer (pas de contrainte)
    if (!lastCard) {
      return this.selectForFirstPlay(aiCards, strategy, situation);
    }

    // Vérifier l'obligation de famille
    const sameFamily = aiCards.filter((c) => c.suit === lastCard.suit);

    if (sameFamily.length > 0) {
      // OBLIGATION : Doit jouer de la même famille
      console.log(
        `🤖 OBLIGATION: Doit jouer du ${lastCard.suit} (${sameFamily.length} cartes)`
      );
      return this.selectFromSameFamily(
        sameFamily,
        lastCard,
        strategy,
        situation
      );
    } else {
      // LIBERTÉ : Peut jouer n'importe quelle carte
      console.log(`🤖 LIBERTÉ: Pas de ${lastCard.suit} - choix libre`);
      return this.selectFromAllCards(aiCards, strategy, situation);
    }
  }

  /**
   * Sélection pour le premier coup (liberté totale)
   */
  selectForFirstPlay(aiCards, strategy, situation) {
    const { isLastTurn, threes } = situation;

    // Tentative de Kora au dernier tour
    if (isLastTurn && threes > 0) {
      const koraCard = aiCards.find((c) => c.value === 3);
      if (koraCard) {
        return {
          card: koraCard,
          reason: "Tentative de KORA avec un 3",
        };
      }
    }

    // Stratégie normale d'ouverture
    const sortedCards = [...aiCards].sort((a, b) => b.value - a.value);

    switch (strategy.name) {
      case "AGGRESSIVE_COUNTER":
      case "FIGHT_FOR_CONTROL":
        return {
          card: sortedCards[0],
          reason: "Ouverture agressive",
        };

      case "STRATEGIC_PLAY":
      case "MAINTAIN_CONTROL":
        // Jouer une carte moyenne-forte (pas la plus forte)
        const cardIndex = Math.min(1, sortedCards.length - 1);
        return {
          card: sortedCards[cardIndex],
          reason: "Ouverture stratégique",
        };

      default:
        // Ouverture conservatrice
        const midIndex = Math.floor(sortedCards.length / 2);
        return {
          card: sortedCards[midIndex],
          reason: "Ouverture équilibrée",
        };
    }
  }

  /**
   * Sélection parmi les cartes de la même famille (obligation)
   */
  selectFromSameFamily(sameFamily, lastCard, strategy, situation) {
    const higherCards = sameFamily.filter((c) => c.value > lastCard.value);
    const { isLastTurn, needsToWin } = situation;

    if (higherCards.length > 0) {
      // Peut prendre la main
      if (isLastTurn || needsToWin <= 1) {
        // Situation critique - jouer la plus forte
        const strongest = higherCards.reduce((max, card) =>
          card.value > max.value ? card : max
        );
        return {
          card: strongest,
          reason: `OBLIGATION ${lastCard.suit} - Prendre avec la plus forte ${strongest.value}${strongest.suit}`,
        };
      } else {
        // Situation normale - jouer la plus petite qui peut prendre
        const smallest = higherCards.reduce((min, card) =>
          card.value < min.value ? card : min
        );
        return {
          card: smallest,
          reason: `OBLIGATION ${lastCard.suit} - Prendre avec ${smallest.value}${smallest.suit}`,
        };
      }
    } else {
      // Sacrifice obligatoire
      const sacrifice = sameFamily.reduce((min, card) =>
        card.value < min.value ? card : min
      );
      return {
        card: sacrifice,
        reason: `OBLIGATION ${lastCard.suit} - Sacrifice ${sacrifice.value}${sacrifice.suit}`,
      };
    }
  }

  /**
   * Sélection libre (pas de contrainte de famille)
   */
  selectFromAllCards(aiCards, strategy, situation) {
    const { isLastTurn, threes, needsToWin } = situation;

    // Tentative de Kora au dernier tour
    if (isLastTurn && threes > 0) {
      const koraCard = aiCards.find((c) => c.value === 3);
      if (koraCard) {
        return {
          card: koraCard,
          reason: "LIBERTÉ - Tentative de KORA",
        };
      }
    }

    // Généralement jouer la plus petite carte
    const smallest = aiCards.reduce((min, card) =>
      card.value < min.value ? card : min
    );

    return {
      card: smallest,
      reason: `LIBERTÉ - Défausse ${smallest.value}${smallest.suit}`,
    };
  }

  /**
   * Analyser la situation actuelle (simplifié)
   */
  analyzeSituation(aiCards, gameState) {
    const { currentRound, roundWins, hasControl } = gameState;

    const threes = aiCards.filter((c) => c.value === 3).length;
    const turnsRemaining = 5 - currentRound;
    const isLastTurn = currentRound === 5;
    const needsToWin = this.needsToWinRemainingTurns(roundWins, currentRound);

    return {
      threes,
      turnsRemaining,
      isLastTurn,
      needsToWin,
      hasControl,
      summary: `T${currentRound}/5, ${
        hasControl ? "HAS_CONTROL" : "RESPONDING"
      }, Threes:${threes}`,
    };
  }

  /**
   * Choisir la stratégie appropriée (simplifié)
   */
  chooseStrategy(situation, gameState) {
    const { isLastTurn, hasControl, needsToWin, threes } = situation;

    if (isLastTurn) {
      if (hasControl && threes > 0) {
        return { name: "KORA_ATTEMPT", priority: "highest" };
      }
      return { name: "SECURE_WIN", priority: "highest" };
    }

    if (needsToWin <= 1) {
      return { name: "AGGRESSIVE_COUNTER", priority: "high" };
    }

    if (hasControl) {
      return { name: "MAINTAIN_CONTROL", priority: "medium" };
    }

    return { name: "STRATEGIC_PLAY", priority: "medium" };
  }

  /**
   * Déterminer combien de tours l'IA doit encore gagner
   */
  needsToWinRemainingTurns(roundWins, currentRound) {
    const aiWins = roundWins.filter((winner) => winner === "ia").length;

    if (currentRound === 5) return 1; // Doit gagner le dernier tour
    if (currentRound === 4) return 2; // Doit contrôler les 2 derniers tours

    return Math.max(1, 3 - aiWins); // Stratégie générale
  }
}

export default AIDecisionMaker;
