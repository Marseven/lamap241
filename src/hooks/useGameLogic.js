import { useState, useEffect } from "react";

// Utilitaire pour créer un deck
const createDeck = () => {
  const suits = ["♠", "♥", "♣", "♦"];
  const deck = [];
  for (let v = 2; v <= 10; v++) {
    suits.forEach((suit) => deck.push({ value: v, suit }));
  }
  return deck.sort(() => 0.5 - Math.random());
};

export const useGameLogic = (gameMode = "ai") => {
  const [gameState, setGameState] = useState({
    playerCards: [],
    opponentCards: [],
    tableCard: null,
    opponentTableCard: null,
    currentPlayer: "player",
    score: { player: 0, opponent: 0 },
    gamePhase: "playing", // 'playing', 'roundEnd', 'gameEnd'
    selectedCard: null,
    message: "Nouvelle partie - À toi de jouer !",
  });

  // Initialiser une nouvelle manche
  const startNewRound = () => {
    const deck = createDeck();
    setGameState((prev) => ({
      ...prev,
      playerCards: deck.slice(0, 5),
      opponentCards: deck.slice(5, 10),
      tableCard: null,
      opponentTableCard: null,
      currentPlayer: "player",
      selectedCard: null,
      message: "Nouvelle manche - À toi de jouer !",
      gamePhase: "playing",
    }));
  };

  // Sélectionner une carte
  const selectCard = (card) => {
    setGameState((prev) => ({
      ...prev,
      selectedCard: prev.selectedCard === card ? null : card,
    }));
  };

  // Jouer une carte
  const playCard = (card) => {
    if (
      gameState.currentPlayer !== "player" ||
      gameState.gamePhase !== "playing"
    ) {
      return false;
    }

    // Logique de jeu ici (sera remplacée par les appels API)
    const newPlayerCards = gameState.playerCards.filter((c) => c !== card);

    setGameState((prev) => ({
      ...prev,
      playerCards: newPlayerCards,
      tableCard: card,
      selectedCard: null,
      currentPlayer: "opponent",
      message: `Tu joues ${card.value}${card.suit}`,
    }));

    return true;
  };

  // IA joue (simulation - sera remplacé par API)
  const aiPlay = () => {
    if (
      gameState.currentPlayer !== "opponent" ||
      gameState.opponentCards.length === 0
    ) {
      return;
    }

    setTimeout(() => {
      const randomCard =
        gameState.opponentCards[
          Math.floor(Math.random() * gameState.opponentCards.length)
        ];
      const newOpponentCards = gameState.opponentCards.filter(
        (c) => c !== randomCard
      );

      setGameState((prev) => ({
        ...prev,
        opponentCards: newOpponentCards,
        opponentTableCard: randomCard,
        currentPlayer: "player",
        message: `IA joue ${randomCard.value}${randomCard.suit}`,
      }));
    }, 1500);
  };

  // Effet pour l'IA
  useEffect(() => {
    if (
      gameState.currentPlayer === "opponent" &&
      gameState.gamePhase === "playing"
    ) {
      aiPlay();
    }
  }, [gameState.currentPlayer, gameState.gamePhase]);

  // Initialiser le jeu
  useEffect(() => {
    startNewRound();
  }, []);

  return {
    gameState,
    actions: {
      startNewRound,
      selectCard,
      playCard,
    },
  };
};
