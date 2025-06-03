// Crée un deck de 2 à 10 pour ♠ ♥ ♣ ♦
export function createDeck() {
    const suits = ["♠", "♥", "♣", "♦"];
    const deck = [];
    for (let v = 2; v <= 10; v++) {
        suits.forEach((suit) => deck.push({ value: v, suit }));
    }
    return deck;
}
// Mélange un deck
export function shuffle(deck) {
    return [...deck].sort(() => 0.5 - Math.random());
}
// Donne 5 cartes à 2 joueurs
export function deal(deck) {
    return {
        player: deck.slice(0, 5),
        opponent: deck.slice(5, 10),
    };
}
// Vérifie si une carte est valide pour répondre à la précédente
export function isValidMove(prevCard, nextCard) {
    return (nextCard &&
        prevCard &&
        prevCard.suit === nextCard.suit &&
        nextCard.value > prevCard.value);
}
