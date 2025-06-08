// src/hooks/useGameNotifications.js
import { useNotifications } from "../contexts/NotificationContext";
import { useCallback } from "react";

export const useGameNotifications = () => {
  const {
    gameNotification,
    walletNotification,
    success,
    error,
    warning,
    info,
  } = useNotifications();

  // Notifications de début/fin de partie
  const notifyGameStart = useCallback(
    (roomName) => {
      gameNotification(`La partie "${roomName}" commence !`, {
        duration: 4000,
        persistent: false,
      });
    },
    [gameNotification]
  );

  const notifyGameEnd = useCallback(
    (winner, roomName) => {
      const message =
        winner === "player"
          ? `🎉 Vous avez gagné la partie "${roomName}" !`
          : `😔 Vous avez perdu la partie "${roomName}"`;

      const type = winner === "player" ? "success" : "error";

      if (winner === "player") {
        success(message, { duration: 8000, persistent: true });
      } else {
        error(message, { duration: 6000 });
      }
    },
    [success, error]
  );

  // Notifications de joueurs
  const notifyPlayerJoined = useCallback(
    (playerName, roomName) => {
      info(`${playerName} a rejoint "${roomName}"`, {
        duration: 4000,
        title: "Nouveau joueur",
      });
    },
    [info]
  );

  const notifyPlayerLeft = useCallback(
    (playerName, reason = "") => {
      const message = reason
        ? `${playerName} a quitté la partie (${reason})`
        : `${playerName} a quitté la partie`;

      warning(message, {
        duration: 5000,
        title: "Joueur parti",
      });
    },
    [warning]
  );

  const notifyPlayerReady = useCallback(
    (playerName) => {
      info(`${playerName} est prêt !`, {
        duration: 3000,
        title: "Joueur prêt",
      });
    },
    [info]
  );

  // Notifications de victoire/défaite avec gains
  const notifyGameWin = useCallback(
    (amount) => {
      const formattedAmount = new Intl.NumberFormat("fr-FR").format(amount);
      success(`🎉 Félicitations ! Vous avez gagné ${formattedAmount} FCFA !`, {
        title: "Victoire !",
        duration: 10000,
        persistent: true,
      });
    },
    [success]
  );

  const notifyGameLoss = useCallback(
    (amount = null) => {
      const message = amount
        ? `Vous avez perdu ${new Intl.NumberFormat("fr-FR").format(
            amount
          )} FCFA. Bonne chance pour la prochaine !`
        : "Vous avez perdu cette partie. Bonne chance pour la prochaine !";

      error(message, {
        title: "Défaite",
        duration: 6000,
      });
    },
    [error]
  );

  // Notifications de tour de jeu
  const notifyYourTurn = useCallback(() => {
    gameNotification("C'est votre tour de jouer !", {
      duration: 3000,
      persistent: false,
      title: "Votre tour",
    });
  }, [gameNotification]);

  const notifyOpponentTurn = useCallback(
    (opponentName) => {
      gameNotification(`${opponentName} joue...`, {
        duration: 2000,
        title: "Tour adversaire",
      });
    },
    [gameNotification]
  );

  const notifyTimeWarning = useCallback(
    (secondsLeft) => {
      warning(`Plus que ${secondsLeft} secondes pour jouer !`, {
        duration: 2000,
        title: "Temps limité",
      });
    },
    [warning]
  );

  // Notifications de cartes et coups
  const notifyCardPlayed = useCallback(
    (playerName, card) => {
      gameNotification(`${playerName} a joué ${card.value}${card.suit}`, {
        duration: 2000,
      });
    },
    [gameNotification]
  );

  const notifyInvalidMove = useCallback(() => {
    error("Coup invalide ! Vérifiez les règles du jeu.", {
      duration: 3000,
      title: "Coup invalide",
    });
  }, [error]);

  const notifyRoundWin = useCallback(
    (roundNumber) => {
      success(`🏆 Vous avez gagné la manche ${roundNumber} !`, {
        duration: 4000,
        title: "Manche gagnée",
      });
    },
    [success]
  );

  const notifyRoundLoss = useCallback(
    (roundNumber) => {
      warning(`Vous avez perdu la manche ${roundNumber}`, {
        duration: 4000,
        title: "Manche perdue",
      });
    },
    [warning]
  );

  // Notifications portefeuille liées au jeu
  const notifyWalletUpdate = useCallback(
    (type, amount) => {
      const formattedAmount = new Intl.NumberFormat("fr-FR").format(amount);

      switch (type) {
        case "deposit":
          walletNotification(
            `Votre compte a été crédité de ${formattedAmount} FCFA`,
            {
              duration: 6000,
            }
          );
          break;
        case "withdraw":
          walletNotification(`Retrait de ${formattedAmount} FCFA effectué`, {
            duration: 6000,
          });
          break;
        case "bet_placed":
          walletNotification(`Mise de ${formattedAmount} FCFA placée`, {
            duration: 4000,
          });
          break;
        case "winnings":
          walletNotification(`🎉 Gains de ${formattedAmount} FCFA ajoutés !`, {
            duration: 8000,
          });
          break;
        case "refund":
          walletNotification(`Remboursement de ${formattedAmount} FCFA`, {
            duration: 5000,
          });
          break;
      }
    },
    [walletNotification]
  );

  // Notifications de connexion
  const notifyConnectionLost = useCallback(() => {
    error("Connexion perdue. Tentative de reconnexion...", {
      title: "Connexion",
      persistent: true,
      duration: 0,
    });
  }, [error]);

  const notifyConnectionRestored = useCallback(() => {
    success("Connexion rétablie !", {
      title: "Connexion",
      duration: 3000,
    });
  }, [success]);

  const notifyReconnecting = useCallback(() => {
    info("Reconnexion en cours...", {
      title: "Connexion",
      duration: 3000,
    });
  }, [info]);

  // Notifications d'erreur de jeu
  const notifyGameError = useCallback(
    (errorMessage) => {
      error(errorMessage, {
        title: "Erreur de jeu",
        duration: 5000,
      });
    },
    [error]
  );

  const notifyRoomFull = useCallback(() => {
    warning("Cette salle est complète", {
      duration: 4000,
      title: "Salle pleine",
    });
  }, [warning]);

  const notifyInsufficientFunds = useCallback(
    (required, available) => {
      const requiredFormatted = new Intl.NumberFormat("fr-FR").format(required);
      const availableFormatted = new Intl.NumberFormat("fr-FR").format(
        available
      );

      error(
        `Solde insuffisant. Requis: ${requiredFormatted} FCFA, Disponible: ${availableFormatted} FCFA`,
        {
          title: "Solde insuffisant",
          duration: 6000,
          action: {
            text: "Recharger",
            callback: () => {
              // Navigation vers la page de recharge
              window.location.href = "/wallet";
            },
          },
        }
      );
    },
    [error]
  );

  // Notifications de mise à jour
  const notifyAppUpdate = useCallback(() => {
    info("Une nouvelle version de l'app est disponible", {
      title: "Mise à jour",
      persistent: true,
      action: {
        text: "Actualiser",
        callback: () => {
          window.location.reload();
        },
      },
    });
  }, [info]);

  return {
    // Jeu
    notifyGameStart,
    notifyGameEnd,
    notifyYourTurn,
    notifyOpponentTurn,
    notifyTimeWarning,
    notifyCardPlayed,
    notifyInvalidMove,
    notifyRoundWin,
    notifyRoundLoss,

    // Joueurs
    notifyPlayerJoined,
    notifyPlayerLeft,
    notifyPlayerReady,

    // Victoires/Défaites
    notifyGameWin,
    notifyGameLoss,

    // Portefeuille
    notifyWalletUpdate,

    // Connexion
    notifyConnectionLost,
    notifyConnectionRestored,
    notifyReconnecting,

    // Erreurs
    notifyGameError,
    notifyRoomFull,
    notifyInsufficientFunds,

    // Système
    notifyAppUpdate,
  };
};
