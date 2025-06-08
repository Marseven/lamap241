// Utilitaires pour le jeu Garame

// Créer un deck sans As, 2, Q, K, J et 10♠
export function createGarameDeck() {
  const suits = ["♠", "♥", "♣", "♦"];
  const deck = [];

  for (let suit of suits) {
    for (let value = 3; value <= 10; value++) {
      // Exclure le 10 de pique
      if (value === 10 && suit === "♠") continue;
      deck.push({ value, suit });
    }
  }

  return deck.sort(() => 0.5 - Math.random());
}

// Calculer la somme des cartes d'un joueur
export function calculateCardSum(cards) {
  return cards.reduce((sum, card) => sum + card.value, 0);
}

// Vérifier si un joueur a trois 7
export function hasThreeSevens(cards) {
  return cards.filter((card) => card.value === 7).length >= 3;
}

// Vérifier les conditions de victoire automatique
export function checkAutoWin(cards) {
  const sum = calculateCardSum(cards);
  const threeSevens = hasThreeSevens(cards);

  if (sum < 21) {
    return { autoWin: true, reason: "Somme < 21", type: "sum" };
  }

  if (threeSevens) {
    return { autoWin: true, reason: "Trois 7", type: "sevens" };
  }

  return { autoWin: false };
}

// Vérifier si une carte peut être jouée
export function canPlayCard(card, lastCard, playerCards) {
  // Si aucune carte sur la table, on peut jouer n'importe quoi
  if (!lastCard) return true;

  // Vérifier si le joueur a des cartes de la même famille
  const sameFamily = playerCards.filter((c) => c.suit === lastCard.suit);

  // Si on a des cartes de la même famille
  if (sameFamily.length > 0) {
    // On ne peut jouer que des cartes de la même famille
    if (card.suit !== lastCard.suit) return false;

    // Et de valeur supérieure (pour prendre la main)
    return card.value > lastCard.value;
  }

  // Si on n'a pas de cartes de la même famille, on peut jouer n'importe quelle carte
  return true;
}

// Obtenir les cartes jouables
export function getPlayableCards(playerCards, lastCard) {
  if (!lastCard) return playerCards; // Premier coup

  const sameFamily = playerCards.filter((c) => c.suit === lastCard.suit);

  if (sameFamily.length > 0) {
    // On doit jouer de la même famille si possible
    return sameFamily.filter((c) => c.value > lastCard.value);
  }

  // Si pas de cartes de la même famille, toutes sont jouables
  return playerCards;
}

// Déterminer qui prend la main
export function whoTakesControl(playerCard, opponentCard) {
  // Même famille, plus haute valeur prend
  if (playerCard.suit === opponentCard.suit) {
    return playerCard.value > opponentCard.value ? "player" : "opponent";
  }

  // Familles différentes, celui qui a joué en dernier garde la main
  return "opponent"; // L'adversaire garde si familles différentes
}

// IA choisit une carte selon les règles
export function aiChooseCard(aiCards, lastCard) {
  if (!lastCard) {
    // Premier coup : jouer la plus haute carte
    return aiCards.reduce((max, card) => (card.value > max.value ? card : max));
  }

  const sameFamily = aiCards.filter((c) => c.suit === lastCard.suit);

  if (sameFamily.length > 0) {
    // Cartes de la même famille disponibles
    const higher = sameFamily.filter((c) => c.value > lastCard.value);

    if (higher.length > 0) {
      // Jouer la plus petite carte qui peut prendre
      return higher.reduce((min, card) =>
        card.value < min.value ? card : min
      );
    } else {
      // Pas de carte supérieure, jouer la plus petite de la famille
      return sameFamily.reduce((min, card) =>
        card.value < min.value ? card : min
      );
    }
  }

  // Pas de cartes de la même famille, jouer la plus petite carte
  return aiCards.reduce((min, card) => (card.value < min.value ? card : min));
}

// Vérifier les bonus (kora)
export function checkKoraBonus(playerWins, playerCards, roundNumber) {
  if (roundNumber !== 5) return 1; // Pas de bonus si ce n'est pas le dernier tour

  const lastCard = playerCards[playerCards.length - 1];

  if (lastCard && lastCard.value === 3) {
    // Kora simple : gagner le tour 5 avec un 3
    if (playerWins[4] === "player") {
      // Tour 5 (index 4)
      // Kora double : gagner tours 4 et 5 avec des 3
      if (
        playerWins[3] === "player" &&
        playerCards[playerCards.length - 2] &&
        playerCards[playerCards.length - 2].value === 3
      ) {
        return 4; // x4
      }
      return 2; // x2
    }
  }

  return 1; // Pas de bonus
}

// Déterminer le gagnant d'une partie
export function determineWinner(playerWins) {
  // Celui qui a la main au tour 5 gagne
  return playerWins[4]; // Index 4 = tour 5
}

// Formater le message de jeu
export function getGameMessage(gameState, currentTurn, roundNumber) {
  if (gameState.autoWin) {
    return `🎉 ${gameState.autoWin.reason} - Victoire automatique !`;
  }

  if (gameState.gamePhase === "gameEnd") {
    const bonus = gameState.koraBonus || 1;
    const bonusText = bonus > 1 ? ` (Kora x${bonus})` : "";
    return `🎉 ${
      gameState.winner === "player" ? "Tu as gagné" : "IA a gagné"
    }${bonusText}`;
  }

  if (currentTurn === "player") {
    return `Tour ${roundNumber}/5 - À toi de jouer !`;
  } else {
    return `Tour ${roundNumber}/5 - Tour de l'IA...`;
  }
}

export default {
  createGarameDeck,
  calculateCardSum,
  hasThreeSevens,
  checkAutoWin,
  canPlayCard,
  getPlayableCards,
  whoTakesControl,
  aiChooseCard,
  checkKoraBonus,
  determineWinner,
  getGameMessage,
};
