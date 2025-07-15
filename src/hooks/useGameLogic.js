import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export const useGameLogic = (gameId, gameMode = "multiplayer") => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState({
    gameId: gameId,
    roundNumber: 1,
    status: "waiting", // waiting, in_progress, completed, abandoned
    playerCards: [],
    opponentCards: [],
    tableCards: [],
    currentPlayerId: null,
    isMyTurn: false,
    scores: {},
    message: "Chargement de la partie...",
    gamePhase: "loading", // loading, playing, roundEnd, gameEnd
    roomInfo: null,
    lastMove: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'état initial du jeu
  const loadGameState = useCallback(async () => {
    if (!gameId || !user) return;

    try {
      setLoading(true);
      setError(null);

      const state = await api.getGameState(gameId);

      setGameState((prevState) => ({
        ...prevState,
        ...state,
        gamePhase: state.status === "completed" ? "gameEnd" : "playing",
        message:
          state.status === "completed"
            ? `Partie terminée !`
            : state.isMyTurn
            ? "À toi de jouer !"
            : "Tour de l'adversaire",
      }));
    } catch (error) {
      console.error("Erreur lors du chargement du jeu:", error);
      
      // Vérifier si c'est une erreur de "pas de jeu en cours"
      if (error.message === "Aucun jeu en cours dans cette salle") {
        // Vérifier le statut de la salle
        try {
          const roomInfo = await api.getRoom(gameId);
          if (roomInfo.status === 'waiting') {
            setGameState((prev) => ({
              ...prev,
              status: "waiting",
              gamePhase: "waiting",
              message: "En attente d'autres joueurs...",
              roomInfo: roomInfo,
            }));
            setError(null);
          } else {
            setError(error.message);
            setGameState((prev) => ({
              ...prev,
              message: "Erreur de chargement",
              gamePhase: "error",
            }));
          }
        } catch (roomError) {
          setError(error.message);
          setGameState((prev) => ({
            ...prev,
            message: "Erreur de chargement",
            gamePhase: "error",
          }));
        }
      } else {
        setError(error.message);
        setGameState((prev) => ({
          ...prev,
          message: "Erreur de chargement",
          gamePhase: "error",
        }));
      }
    } finally {
      setLoading(false);
    }
  }, [gameId, user]);

  // Charger l'état initial
  useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  // Polling pour les mises à jour temps réel
  useEffect(() => {
    if (!gameId || gameState.status === "completed") return;

    const pollInterval = setInterval(async () => {
      try {
        const state = await api.getGameState(gameId);

        setGameState((prevState) => {
          // Ne mettre à jour que si quelque chose a changé
          if (
            JSON.stringify(prevState.tableCards) !==
              JSON.stringify(state.tableCards) ||
            prevState.currentPlayerId !== state.currentPlayerId ||
            prevState.status !== state.status
          ) {
            return {
              ...prevState,
              ...state,
              gamePhase: state.status === "completed" ? "gameEnd" : "playing",
              message: getGameMessage(state, user.id),
            };
          }
          return prevState;
        });
      } catch (error) {
        console.error("Erreur polling:", error);
        
        // Si c'est une erreur de "pas de jeu en cours", vérifier le statut de la salle
        if (error.message === "Aucun jeu en cours dans cette salle") {
          try {
            const roomInfo = await api.getRoom(gameId);
            if (roomInfo.status === 'waiting') {
              setGameState((prev) => ({
                ...prev,
                status: "waiting",
                gamePhase: "waiting",
                message: "En attente d'autres joueurs...",
                roomInfo: roomInfo,
              }));
            }
          } catch (roomError) {
            // Ignorer l'erreur de polling
          }
        }
      }
    }, 2000); // Poll toutes les 2 secondes

    return () => clearInterval(pollInterval);
  }, [gameId, gameState.status, user.id]);

  // Générer le message de jeu approprié
  const getGameMessage = (state, userId) => {
    if (state.status === "completed") {
      const winner = Object.entries(state.scores).find(
        ([_, score]) => score.rounds_won >= state.room.rounds_to_win
      );
      if (winner) {
        return winner[0] === userId
          ? "🎉 Tu as gagné la partie !"
          : "😔 Tu as perdu la partie";
      }
      return "Partie terminée";
    }

    if (state.isMyTurn) {
      if (state.tableCards.length === 0) {
        return "À toi de commencer !";
      } else {
        const lastCard = state.tableCards[state.tableCards.length - 1];
        return `Réponds à ${lastCard.value}${lastCard.suit} ou passe ton tour`;
      }
    } else {
      return "Tour de l'adversaire...";
    }
  };

  // Jouer une carte
  const playCard = async (card) => {
    if (!gameState.isMyTurn || gameState.status !== "in_progress") {
      return { success: false, error: "Ce n'est pas votre tour" };
    }

    try {
      setGameState((prev) => ({
        ...prev,
        message: "Envoi du coup...",
      }));

      const response = await api.playCard(gameId, card);

      if (response.message) {
        // Recharger l'état complet du jeu
        await loadGameState();

        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error("Erreur jouer carte:", error);
      setGameState((prev) => ({
        ...prev,
        message: "Erreur lors du coup",
      }));
      return { success: false, error: error.message };
    }
  };

  // Passer son tour
  const passTurn = async () => {
    if (!gameState.isMyTurn || gameState.status !== "in_progress") {
      return { success: false, error: "Ce n'est pas votre tour" };
    }

    try {
      setGameState((prev) => ({
        ...prev,
        message: "Passage du tour...",
      }));

      const response = await api.request(`/games/${gameId}/pass`, {
        method: "POST",
      });

      if (response.message) {
        await loadGameState();
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error("Erreur passer tour:", error);
      return { success: false, error: error.message };
    }
  };

  // Abandonner la partie
  const forfeitGame = async () => {
    try {
      setGameState((prev) => ({
        ...prev,
        message: "Abandon en cours...",
      }));

      await api.forfeitGame(gameId);

      setGameState((prev) => ({
        ...prev,
        status: "abandoned",
        gamePhase: "gameEnd",
        message: "Tu as abandonné la partie",
      }));

      return { success: true };
    } catch (error) {
      console.error("Erreur abandon:", error);
      return { success: false, error: error.message };
    }
  };

  // Vérifier si une carte est jouable
  const isCardPlayable = (card) => {
    if (!gameState.isMyTurn || gameState.status !== "in_progress") {
      return false;
    }

    // Si aucune carte sur la table, toutes les cartes sont jouables
    if (gameState.tableCards.length === 0) {
      return true;
    }

    const lastCard = gameState.tableCards[gameState.tableCards.length - 1];

    // Doit jouer la même couleur avec une valeur supérieure
    return card.suit === lastCard.suit && card.value > lastCard.value;
  };

  // Obtenir les cartes jouables
  const getPlayableCards = () => {
    return gameState.playerCards.filter(isCardPlayable);
  };

  // Redémarrer une nouvelle manche (pour les parties contre l'IA)
  const startNewRound = async () => {
    if (gameMode === "ai") {
      // Pour l'IA, réinitialiser localement
      setGameState((prev) => ({
        ...prev,
        playerCards: [],
        opponentCards: [],
        tableCards: [],
        currentPlayerId: user.id,
        isMyTurn: true,
        roundNumber: prev.roundNumber + 1,
        gamePhase: "playing",
        message: "Nouvelle manche - À toi de jouer !",
      }));
    } else {
      // Pour le multijoueur, recharger depuis l'API
      await loadGameState();
    }
  };

  return {
    gameState,
    loading,
    error,
    actions: {
      playCard,
      passTurn,
      forfeitGame,
      startNewRound,
      loadGameState,
      isCardPlayable,
      getPlayableCards,
    },
  };
};
