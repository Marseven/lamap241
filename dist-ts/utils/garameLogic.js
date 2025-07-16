// Utilitaires pour le jeu Garame - VERSION CORRIGÉE
// Créer un deck sans As, 2, Q, K, J et 10♠
export function createGarameDeck() {
    const suits = ["♠", "♥", "♣", "♦"];
    const deck = [];
    for (let suit of suits) {
        for (let value = 3; value <= 10; value++) {
            // Exclure le 10 de pique
            if (value === 10 && suit === "♠")
                continue;
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
// Vérifier si une carte peut être jouée - LOGIQUE CORRIGÉE
export function canPlayCard(card, lastCard, playerCards) {
    // Si aucune carte sur la table, on peut jouer n'importe quoi
    if (!lastCard)
        return true;
    // Vérifier si le joueur a des cartes de la même famille
    const sameFamily = playerCards.filter((c) => c.suit === lastCard.suit);
    // Si on a des cartes de la même famille
    if (sameFamily.length > 0) {
        // On ne peut jouer que des cartes de la même famille
        if (card.suit !== lastCard.suit)
            return false;
        // Toutes les cartes de la même famille sont jouables (pas besoin d'être supérieure)
        return true;
    }
    // Si on n'a pas de cartes de la même famille, on peut jouer n'importe quelle carte
    return true;
}
// Obtenir les cartes jouables - LOGIQUE CORRIGÉE
export function getPlayableCards(playerCards, lastCard) {
    if (!lastCard)
        return playerCards; // Premier coup - toutes les cartes sont jouables
    const sameFamily = playerCards.filter((c) => c.suit === lastCard.suit);
    if (sameFamily.length > 0) {
        // On a des cartes de la même famille - on DOIT jouer de la même famille
        // Toutes les cartes de la même famille sont jouables
        return sameFamily;
    }
    // Si pas de cartes de la même famille, toutes les cartes sont jouables
    return playerCards;
}
// Déterminer qui prend la main - LOGIQUE CORRIGÉE
export function whoTakesControl(card1, card2, whoPlayedFirst) {
    // Si les cartes sont de la même famille
    if (card1.suit === card2.suit) {
        // La plus haute valeur prend la main
        if (card1.value > card2.value) {
            return whoPlayedFirst === "player" ? "player" : "opponent";
        }
        else {
            return whoPlayedFirst === "player" ? "opponent" : "player";
        }
    }
    // Si les familles sont différentes, celui qui a joué en premier garde la main
    return whoPlayedFirst;
}
// IA choisit une carte selon les règles - LOGIQUE CORRIGÉE avec obligation stricte
export function aiChooseCard(aiCards, lastCard) {
    if (!lastCard) {
        // Premier coup : jouer une carte moyenne-forte (pas la plus forte)
        const sortedCards = [...aiCards].sort((a, b) => b.value - a.value);
        return sortedCards[1] || sortedCards[0];
    }
    // RÈGLE STRICTE : Vérifier l'obligation de jouer la même famille
    const sameFamily = aiCards.filter((c) => c.suit === lastCard.suit);
    if (sameFamily.length > 0) {
        // L'IA DOIT jouer de la même famille - obligation absolue !
        console.log(`🤖 OBLIGATION: IA doit jouer du ${lastCard.suit} (${sameFamily.length} cartes disponibles)`);
        const higher = sameFamily.filter((c) => c.value > lastCard.value);
        if (higher.length > 0) {
            // On peut prendre la main - jouer la plus petite carte qui peut prendre
            const bestCard = higher.reduce((min, card) => card.value < min.value ? card : min);
            console.log(`🤖 IA prend avec ${bestCard.value}${bestCard.suit}`);
            return bestCard;
        }
        else {
            // Pas de carte supérieure - sacrifier la plus petite de la famille
            const sacrifice = sameFamily.reduce((min, card) => card.value < min.value ? card : min);
            console.log(`🤖 IA sacrifice ${sacrifice.value}${sacrifice.suit} (obligation)`);
            return sacrifice;
        }
    }
    // Pas de cartes de la même famille - liberté totale
    console.log(`🤖 LIBERTÉ: IA n'a pas de ${lastCard.suit} - peut jouer n'importe quelle carte`);
    const smallest = aiCards.reduce((min, card) => card.value < min.value ? card : min);
    console.log(`🤖 IA défausse ${smallest.value}${smallest.suit}`);
    return smallest;
}
// Vérifier les bonus (kora)
export function checkKoraBonus(playerWins, playerCards, roundNumber) {
    if (roundNumber !== 5)
        return 1; // Pas de bonus si ce n'est pas le dernier tour
    const lastCard = playerCards[playerCards.length - 1];
    if (lastCard && lastCard.value === 3) {
        // Kora simple : gagner le tour 5 avec un 3
        if (playerWins[4] === "player") {
            // Tour 5 (index 4)
            // Kora double : gagner tours 4 et 5 avec des 3
            if (playerWins[3] === "player" &&
                playerCards[playerCards.length - 2] &&
                playerCards[playerCards.length - 2].value === 3) {
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
// Déterminer qui gagne un tour spécifique - NOUVELLE FONCTION
export function determineTurnWinner(playerCard, iaCard, whoPlayedFirst) {
    console.log(`🎯 Résolution du tour:`, {
        playerCard: `${playerCard.value}${playerCard.suit}`,
        iaCard: `${iaCard.value}${iaCard.suit}`,
        whoPlayedFirst,
    });
    // Si même famille, la plus haute valeur gagne
    if (playerCard.suit === iaCard.suit) {
        const winner = playerCard.value > iaCard.value ? "player" : "ia";
        console.log(`Same suit - Winner: ${winner} (${playerCard.value} vs ${iaCard.value})`);
        return winner;
    }
    // Familles différentes : celui qui a joué en premier garde la main
    console.log(`Different suits - First player (${whoPlayedFirst}) keeps control`);
    return whoPlayedFirst;
}
// Formater le message de jeu - AMÉLIORÉ
export function getGameMessage(gameState, currentTurn, roundNumber) {
    if (gameState.autoWin) {
        return `🎉 ${gameState.autoWin.reason} - Victoire automatique !`;
    }
    if (gameState.gamePhase === "gameEnd") {
        const bonus = gameState.koraBonus || 1;
        const bonusText = bonus > 1 ? ` (Kora x${bonus})` : "";
        return `🎉 ${gameState.winner === "player" ? "Tu as gagné" : "IA a gagné"}${bonusText}`;
    }
    if (gameState.gamePhase === "mancheEnd") {
        return (gameState.message ||
            `Manche terminée - ${gameState.winner === "player" ? "Tu gagnes" : "IA gagne"} !`);
    }
    if (currentTurn === "player") {
        return `Tour ${roundNumber}/5 - À toi de jouer !`;
    }
    else {
        return `Tour ${roundNumber}/5 - Tour de l'IA...`;
    }
}
// Vérifier si le joueur doit jouer une famille spécifique
export function mustPlaySuit(playerCards, lastCard) {
    if (!lastCard)
        return null;
    const sameFamily = playerCards.filter((c) => c.suit === lastCard.suit);
    if (sameFamily.length > 0) {
        return lastCard.suit; // Doit jouer cette famille
    }
    return null; // Peut jouer n'importe quelle famille
}
// Obtenir un message d'aide pour le joueur - AMÉLIORÉ
export function getPlayerHelpMessage(playerCards, lastCard) {
    if (!lastCard) {
        return "Premier à jouer - Tu peux jouer n'importe quelle carte";
    }
    const playableCards = getPlayableCards(playerCards, lastCard);
    const mustPlayFamily = mustPlaySuit(playerCards, lastCard);
    if (mustPlayFamily) {
        const canTakeControl = playableCards.some((c) => c.value > lastCard.value);
        if (canTakeControl) {
            return `Tu dois jouer du ${mustPlayFamily} - Joue plus fort que ${lastCard.value} pour prendre la main`;
        }
        else {
            return `Tu dois jouer du ${mustPlayFamily} - Sacrifice ta plus petite carte (obligation)`;
        }
    }
    else {
        return "Tu n'as pas la famille demandée - Tu peux jouer n'importe quelle carte";
    }
}
// Vérifier le bonus Kora (avec un 3) - CORRIGÉ pour valoir 2 manches
export function checkKoraBonus2(winnerCard, roundNumber) {
    // Le Kora ne s'applique que si on gagne avec un 3
    if (winnerCard && winnerCard.value === 3 && roundNumber === 5) {
        return 2; // Kora = victoire qui vaut 2 manches
    }
    return 1; // Victoire normale = 1 manche
}
// Déterminer le vainqueur d'une manche avec bonus Kora
export function determinerVainqueurMancheAvecKora(roundsGagnés, vainqueurDernierTour, carteGagnante) {
    const vainqueur = vainqueurDernierTour;
    const koraBonus = carteGagnante && carteGagnante.value === 3 ? 2 : 1;
    return {
        vainqueur,
        koraBonus,
        message: koraBonus === 2
            ? `🎉 KORA ! ${vainqueur === "player" ? "Tu gagnes" : "IA gagne"} avec un 3 - Victoire = 2 manches !`
            : `${vainqueur === "player" ? "Tu gagnes" : "IA gagne"} la manche`,
    };
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
    determineTurnWinner,
    determinerVainqueurMancheAvecKora,
    getGameMessage,
    mustPlaySuit,
    getPlayerHelpMessage,
};
