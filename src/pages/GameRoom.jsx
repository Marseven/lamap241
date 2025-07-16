import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameWebSocket } from '../hooks/useWebSocket';
import GameBoard from '../components/GameBoard';
import GameHeader from '../components/GameHeader';
import PlayerInfo from '../components/PlayerInfo';
import WaitingRoom from '../components/WaitingRoom';
import LoadingPage from '../components/LoadingPage';
import RoomJoinLoading from '../components/RoomJoinLoading';
import { useNotifications } from '../hooks/useNotifications';
import NotificationToast from '../components/NotificationToast';
import * as GarameLogic from '../utils/garameLogic';
import AIDecisionMaker from '../utils/aiDecisionMaker';

export default function GameRoom() {
  const { id: gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, addNotification, removeNotification } = useNotifications();
  
  // Déterminer le mode de jeu
  const gameMode = gameId === 'vs-ai' ? 'ai' : 'multiplayer';
  
  // Utiliser la logique de jeu appropriée
  const { gameState, loading, error, actions } = useGameLogic(
    gameMode === 'ai' ? null : gameId, 
    gameMode
  );

  // WebSocket pour les parties multijoueurs
  const gameChannel = useGameWebSocket(gameMode === 'multiplayer' ? gameId : null, {
    onCardPlayed: (event) => {
      console.log('🃏 Carte jouée par l\'adversaire:', event);
      addNotification({
        type: 'info',
        message: `${event.player.pseudo} a joué une carte`,
        duration: 3000
      });
      // Actualiser l'état du jeu
      if (actions.refreshGameState) {
        actions.refreshGameState();
      }
    },
    onPlayerPassed: (event) => {
      console.log('⏭️ Joueur a passé:', event);
      addNotification({
        type: 'info',
        message: `${event.player.pseudo} a passé son tour`,
        duration: 3000
      });
      // Actualiser l'état du jeu
      if (actions.refreshGameState) {
        actions.refreshGameState();
      }
    },
    onGameStateChanged: (event) => {
      console.log('🔄 État du jeu changé:', event);
      // Actualiser l'état du jeu
      if (actions.refreshGameState) {
        actions.refreshGameState();
      }
    },
    onPlayerJoining: (user) => {
      addNotification({
        type: 'success',
        message: `${user.pseudo} a rejoint la partie`,
        duration: 3000
      });
    },
    onPlayerLeaving: (user) => {
      addNotification({
        type: 'warning',
        message: `${user.pseudo} a quitté la partie`,
        duration: 3000
      });
    }
  });

  // IA intelligente
  const [aiDecisionMaker] = useState(() => new AIDecisionMaker());
  const [aiThinking, setAiThinking] = useState(false);

  // État local pour l'IA suivant l'algorithme corrigé
  const [aiGameState, setAiGameState] = useState({
    // Scores de partie (manches gagnées)
    scoreJoueur: 0,
    scoreIA: 0,
    mancheActuelle: 1,
    nombreManchesPourGagner: 5,
    
    // État de la manche actuelle
    playerCards: [],
    iaCards: [],
    playerTableCards: [],
    opponentTableCards: [],
    
    // Logique de tour
    currentRound: 1,
    roundsGagnés: [], // Qui a gagné chaque tour de la manche actuelle
    main: 'player', // Qui a la main pour jouer en premier
    currentTurn: 'player', // Qui doit jouer maintenant
    lastCard: null,
    waitingForTurnResolution: false, // Nouveau flag pour éviter les doubles résolutions
    
    // Statut du jeu
    gamePhase: 'playing', // playing, mancheEnd, gameEnd
    message: '',
    winner: null,
    koraBonus: 1,
    
    // Meta
    joueurCommence: true, // Alternance entre les manches
  });

  // Sons (placeholders pour l'instant)
  const playSound = (soundType) => {
    console.log(`🔊 Playing sound: ${soundType}`);
    // TODO: Implémenter les vrais sons
  };

  // Initialiser une nouvelle partie complète
  const startNewGame = () => {
    console.log('🎮 Démarrage d\'une nouvelle partie');
    playSound('carte_posée');
    
    setAiGameState({
      scoreJoueur: 0,
      scoreIA: 0,
      mancheActuelle: 1,
      nombreManchesPourGagner: 5,
      playerCards: [],
      iaCards: [],
      playerTableCards: [],
      opponentTableCards: [],
      currentRound: 1,
      roundsGagnés: [],
      main: Math.random() > 0.5 ? 'player' : 'ia', // Tirage au sort
      currentTurn: 'player',
      lastCard: null,
      waitingForTurnResolution: false,
      gamePhase: 'playing',
      message: 'Nouvelle partie - Premier à 5 manches !',
      winner: null,
      koraBonus: 1,
      joueurCommence: Math.random() > 0.5,
    });

    // Démarrer la première manche
    setTimeout(() => startNewManche(), 500);
  };

  // Initialiser une nouvelle manche
  const startNewManche = () => {
    setAiGameState(prev => {
      console.log(`🎯 Manche ${prev.mancheActuelle} commence`);
      playSound('carte_posée');
      
      const deck = GarameLogic.createGarameDeck();
      const playerCards = deck.slice(0, 5);
      const iaCards = deck.slice(5, 10);
      
      // Vérifier les victoires automatiques
      const playerAutoWin = GarameLogic.checkAutoWin(playerCards);
      const iaAutoWin = GarameLogic.checkAutoWin(iaCards);
      
      if (playerAutoWin.autoWin) {
        console.log('🎉 Victoire automatique du joueur!');
        return {
          ...prev,
          playerCards,
          iaCards,
          playerTableCards: [],
          opponentTableCards: [],
          currentRound: 1,
          roundsGagnés: [],
          gamePhase: 'mancheEnd',
          winner: 'player',
          message: `🎉 ${playerAutoWin.reason} - Tu gagnes la manche !`,
          currentTurn: null,
          waitingForTurnResolution: false
        };
      }
      
      if (iaAutoWin.autoWin) {
        console.log('😔 Victoire automatique de l\'IA');
        return {
          ...prev,
          playerCards,
          iaCards,
          playerTableCards: [],
          opponentTableCards: [],
          currentRound: 1,
          roundsGagnés: [],
          gamePhase: 'mancheEnd',
          winner: 'ia',
          message: `😔 IA gagne automatiquement (${iaAutoWin.reason})`,
          currentTurn: null,
          waitingForTurnResolution: false
        };
      }
      
      // Déterminer qui commence cette manche
      const main = prev.joueurCommence ? 'player' : 'ia';
      
      return {
        ...prev,
        playerCards,
        iaCards,
        playerTableCards: [],
        opponentTableCards: [],
        currentRound: 1,
        roundsGagnés: [],
        main,
        currentTurn: main,
        lastCard: null,
        waitingForTurnResolution: false,
        gamePhase: 'playing',
        message: `Manche ${prev.mancheActuelle} - ${main === 'player' ? 'Tu commences' : 'IA commence'} !`,
        winner: null,
        koraBonus: 1
      };
    });
  };

  // Initialiser le jeu au démarrage
  useEffect(() => {
    if (gameMode === 'ai') {
      startNewGame();
    }
  }, [gameMode]);

  // Gérer les tours de l'IA
  useEffect(() => {
    if (gameMode === 'ai' && 
        aiGameState.currentTurn === 'ia' && 
        aiGameState.gamePhase === 'playing' &&
        !aiThinking &&
        !aiGameState.waitingForTurnResolution &&
        aiGameState.iaCards.length > 0) {
      
      console.log('🤖 IA doit jouer');
      
      setTimeout(() => {
        executeAITurn();
      }, 1000);
    }
  }, [aiGameState.currentTurn, aiGameState.gamePhase, aiThinking, gameMode, aiGameState.waitingForTurnResolution]);

  // Gérer la fin de manche automatiquement
  useEffect(() => {
    if (aiGameState.gamePhase === 'mancheEnd' && aiGameState.winner) {
      setTimeout(() => {
        handleMancheEnd(aiGameState.winner);
      }, 2000);
    }
  }, [aiGameState.gamePhase, aiGameState.winner]);

  // Exécuter le tour de l'IA
  const executeAITurn = async () => {
    if (aiThinking || aiGameState.waitingForTurnResolution) return;
    
    setAiThinking(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAiGameState(prev => {
        if (prev.currentTurn !== 'ia' || prev.iaCards.length === 0 || prev.gamePhase !== 'playing' || prev.waitingForTurnResolution) {
          return prev;
        }

        const decision = aiDecisionMaker.makeDecision(prev.iaCards, {
          lastCard: prev.lastCard,
          currentRound: prev.currentRound,
          roundWins: prev.roundsGagnés,
          hasControl: prev.main,
          playerCards: prev.playerCards,
          playerTableCards: prev.playerTableCards,
          opponentTableCards: prev.opponentTableCards
        });

        const aiCard = decision.card;
        
        // VÉRIFICATION DE SÉCURITÉ : L'IA respecte-t-elle les règles ?
        const playableCards = GarameLogic.getPlayableCards(prev.iaCards, prev.lastCard);
        const isValidMove = playableCards.some(pc => pc.value === aiCard.value && pc.suit === aiCard.suit);
        
        if (!isValidMove) {
          console.error('🚨 IA TRICHE ! Carte non autorisée:', `${aiCard.value}${aiCard.suit}`);
          console.log('Cartes jouables:', playableCards.map(c => `${c.value}${c.suit}`));
          
          // Forcer l'IA à jouer une carte valide
          const fallbackCard = playableCards[0] || prev.iaCards[0];
          console.log('🔧 Correction automatique:', `${fallbackCard.value}${fallbackCard.suit}`);
          
          const correctedDecision = {
            card: fallbackCard,
            reason: "Correction automatique - carte forcée"
          };
          
          // Utiliser la carte corrigée
          const newIaCards = prev.iaCards.filter(c => c !== fallbackCard);
          
          console.log(`🤖 IA joue (corrigé): ${fallbackCard.value}${fallbackCard.suit} - ${correctedDecision.reason}`);
          playSound('carte_posée');

          const newState = {
            ...prev,
            iaCards: newIaCards,
            opponentTableCards: [...prev.opponentTableCards, fallbackCard],
            lastCard: fallbackCard,
          };

          // Si l'IA a la main, le joueur doit répondre
          if (prev.main === 'ia') {
            newState.message = `IA joue ${fallbackCard.value}${fallbackCard.suit} - À toi de répondre`;
            newState.currentTurn = 'player';
          } else {
            // IA répond au joueur - résoudre le tour
            newState.currentTurn = null;
            newState.waitingForTurnResolution = true;
            newState.message = `IA joue ${fallbackCard.value}${fallbackCard.suit} - Résolution du tour...`;
            
            // Résoudre après un court délai
            setTimeout(() => {
              const playerCard = prev.playerTableCards[prev.playerTableCards.length - 1];
              resolveTurn(playerCard, fallbackCard, prev.main);
            }, 1500);
          }

          return newState;
        }
        
        const newIaCards = prev.iaCards.filter(c => c !== aiCard);
        
        console.log(`🤖 IA joue: ${aiCard.value}${aiCard.suit} - ${decision.reason}`);
        playSound('carte_posée');

        const newState = {
          ...prev,
          iaCards: newIaCards,
          opponentTableCards: [...prev.opponentTableCards, aiCard],
          lastCard: aiCard,
        };

        // Si l'IA a la main, le joueur doit répondre
        if (prev.main === 'ia') {
          newState.message = `IA joue ${aiCard.value}${aiCard.suit} - À toi de répondre`;
          newState.currentTurn = 'player';
        } else {
          // IA répond au joueur - résoudre le tour
          newState.currentTurn = null;
          newState.waitingForTurnResolution = true;
          newState.message = `IA joue ${aiCard.value}${aiCard.suit} - Résolution du tour...`;
          
          // Résoudre après un court délai
          setTimeout(() => {
            const playerCard = prev.playerTableCards[prev.playerTableCards.length - 1];
            resolveTurn(playerCard, aiCard, prev.main);
          }, 1500);
        }

        return newState;
      });
      
    } finally {
      setAiThinking(false);
    }
  };

  // Résoudre qui gagne le tour et passer au suivant
  const resolveTurn = (playerCard, iaCard, whoPlayedFirst) => {
    setAiGameState(prev => {
      if (!prev.waitingForTurnResolution) return prev;

      // Utiliser la nouvelle fonction de résolution
      const vainqueurTour = GarameLogic.determineTurnWinner(playerCard, iaCard, whoPlayedFirst);
      
      const newRoundsGagnés = [...prev.roundsGagnés, vainqueurTour];
      const nextRound = prev.currentRound + 1;
      
      console.log(`🎯 Tour ${prev.currentRound} - Vainqueur: ${vainqueurTour}`);

      // Vérifier si la manche est terminée
      if (nextRound > 5) {
        // Déterminer la carte gagnante pour vérifier le Kora
        const carteGagnante = vainqueurTour === 'player' ? playerCard : iaCard;
        
        // Utiliser la nouvelle fonction avec bonus Kora
        const resultatManche = GarameLogic.determinerVainqueurMancheAvecKora(
          newRoundsGagnés, 
          vainqueurTour, 
          carteGagnante
        );
        
        console.log(`🏆 Fin de manche - Vainqueur: ${resultatManche.vainqueur}, Bonus: ${resultatManche.koraBonus}`);
        
        if (resultatManche.vainqueur === 'player') {
          playSound(resultatManche.koraBonus === 2 ? 'kora_victoire' : 'victoire_manche');
        } else {
          playSound('defaite_manche');
        }

        return {
          ...prev,
          roundsGagnés: newRoundsGagnés,
          currentRound: nextRound,
          gamePhase: 'mancheEnd',
          winner: resultatManche.vainqueur,
          koraBonus: resultatManche.koraBonus,
          carteGagnante: carteGagnante,
          message: resultatManche.message,
          currentTurn: null,
          waitingForTurnResolution: false
        };
      }

      // Continuer la manche
      return {
        ...prev,
        roundsGagnés: newRoundsGagnés,
        currentRound: nextRound,
        main: vainqueurTour,
        currentTurn: vainqueurTour,
        message: `Tour ${nextRound}/5 - ${vainqueurTour === 'player' ? 'Tu as' : 'IA a'} la main`,
        lastCard: null, // Reset pour le prochain tour
        waitingForTurnResolution: false
      };
    });
  };

  // Déterminer le vainqueur d'une manche
  const determinerVainqueurManche = (roundsGagnés, mainAuDernierTour) => {
    // Dans le Garame, celui qui a la main au dernier tour gagne la manche
    return mainAuDernierTour;
  };

  // Gérer la fin d'une manche
  const handleMancheEnd = (vainqueurManche) => {
    setAiGameState(prev => {
      // Utiliser le bonus Kora s'il y en a un
      const koraBonus = prev.koraBonus || 1;
      
      const newScoreJoueur = prev.scoreJoueur + (vainqueurManche === 'player' ? koraBonus : 0);
      const newScoreIA = prev.scoreIA + (vainqueurManche === 'ia' ? koraBonus : 0);
      
      console.log(`📊 Scores: Joueur ${newScoreJoueur} - IA ${newScoreIA} ${koraBonus === 2 ? '(KORA +2!)' : ''}`);

      // Vérifier si la partie est terminée
      if (newScoreJoueur >= prev.nombreManchesPourGagner) {
        console.log('🎉 Joueur gagne la partie!');
        playSound('victoire_finale');
        return {
          ...prev,
          scoreJoueur: newScoreJoueur,
          gamePhase: 'gameEnd',
          winner: 'player',
          message: koraBonus === 2 ? 
            '🎉 Vous avez gagné la partie avec un KORA !' : 
            '🎉 Vous avez gagné la partie !'
        };
      }

      if (newScoreIA >= prev.nombreManchesPourGagner) {
        console.log('😢 IA gagne la partie');
        playSound('defaite_finale');
        return {
          ...prev,
          scoreIA: newScoreIA,
          gamePhase: 'gameEnd',
          winner: 'ia',
          message: koraBonus === 2 ? 
            '😢 L\'IA a gagné la partie avec un KORA.' : 
            '😢 L\'IA a gagné la partie.'
        };
      }

      // Continuer avec une nouvelle manche
      const nextManche = prev.mancheActuelle + 1;
      console.log(`🔄 Préparation manche ${nextManche}`);
      
      const newState = {
        ...prev,
        scoreJoueur: newScoreJoueur,
        scoreIA: newScoreIA,
        mancheActuelle: nextManche,
        joueurCommence: !prev.joueurCommence, // Alternance
        gamePhase: 'playing',
        message: `Manche ${nextManche} dans 3 secondes...${koraBonus === 2 ? ' (Bonus KORA appliqué !)' : ''}`,
        waitingForTurnResolution: false,
        koraBonus: 1, // Reset du bonus
        carteGagnante: null
      };

      // Démarrer la nouvelle manche après un délai
      setTimeout(() => startNewManche(), 3000);

      return newState;
    });
  };

  // Jouer une carte (joueur)
  const playAiCard = (card) => {
    if (aiGameState.currentTurn !== 'player' || aiGameState.gamePhase !== 'playing' || aiGameState.waitingForTurnResolution) {
      console.log('Impossible de jouer maintenant:', {
        currentTurn: aiGameState.currentTurn,
        gamePhase: aiGameState.gamePhase,
        waiting: aiGameState.waitingForTurnResolution
      });
      return;
    }

    // Vérifier si la carte est jouable avec la logique corrigée
    const playableCards = GarameLogic.getPlayableCards(aiGameState.playerCards, aiGameState.lastCard);
    if (!playableCards.some(pc => pc.value === card.value && pc.suit === card.suit)) {
      const helpMessage = GarameLogic.getPlayerHelpMessage(aiGameState.playerCards, aiGameState.lastCard);
      addNotification('error', `Cette carte ne peut pas être jouée ! ${helpMessage}`);
      return;
    }

    const newPlayerCards = aiGameState.playerCards.filter(c => c !== card);
    
    console.log(`👤 Joueur joue: ${card.value}${card.suit}`);
    playSound('carte_posée');

    setAiGameState(prev => {
      const newState = {
        ...prev,
        playerCards: newPlayerCards,
        playerTableCards: [...prev.playerTableCards, card],
        lastCard: card,
      };

      // Si le joueur a la main, l'IA doit répondre
      if (prev.main === 'player') {
        newState.message = `Tu joues ${card.value}${card.suit} - IA doit répondre`;
        newState.currentTurn = 'ia';
      } else {
        // Joueur répond à l'IA - résoudre le tour
        newState.currentTurn = null;
        newState.waitingForTurnResolution = true;
        newState.message = `Tu joues ${card.value}${card.suit} - Résolution du tour...`;
        
        // Résoudre après un court délai
        setTimeout(() => {
          const iaCard = prev.opponentTableCards[prev.opponentTableCards.length - 1];
          resolveTurn(card, iaCard, prev.main);
        }, 1500);
      }

      return newState;
    });
  };

  // Gérer l'abandon
  const handleAbandon = async () => {
    if (gameMode === 'ai') {
      navigate('/');
    } else {
      const result = await actions.forfeitGame();
      if (result.success) {
        addNotification('info', 'Tu as abandonné la partie');
        setTimeout(() => navigate('/rooms'), 2000);
      }
    }
  };

  // Redémarrer une nouvelle partie
  const handleNewGame = () => {
    startNewGame();
  };

  // Affichage de la page d'attente pour multijoueur (priorité sur loading)
  if (gameMode === 'multiplayer' && gameState.gamePhase === 'waiting') {
    return <WaitingRoom roomInfo={gameState.roomInfo || { status: 'waiting', players: [] }} gameId={gameId} />;
  }

  // Affichage du loading pour multijoueur (seulement si pas en attente et pas d'erreur)
  if (gameMode === 'multiplayer' && loading && gameState.gamePhase !== 'waiting' && !error) {
    return (
      <RoomJoinLoading 
        roomCode={gameId}
        roomName={gameState.roomInfo?.name}
        playerCount={gameState.roomInfo?.players?.length || 0}
        maxPlayers={gameState.roomInfo?.maxPlayers || 4}
        status="loading"
      />
    );
  }

  // Affichage de l'erreur pour multijoueur (seulement pour les vraies erreurs)
  if (gameMode === 'multiplayer' && error && !error.includes("Aucun jeu en cours")) {
    return (
      <div className="game-rooms-page">
        <div className="rooms-header">
          <button 
            onClick={() => navigate('/rooms')}
            className="back-btn"
          >
            ← Retour aux salles
          </button>
          <h1 className="page-title">⚠️ Erreur</h1>
          <div className="create-btn" style={{ visibility: 'hidden' }}>
            + Créer
          </div>
        </div>

        <div className="empty-state">
          <div className="empty-icon">
            ⚠️
          </div>
          <div className="empty-title">
            Erreur de chargement
          </div>
          <div className="empty-message">
            {error}
          </div>
          <div className="empty-actions">
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              <span className="btn-icon">🔄</span>
              Réessayer
            </button>
            <button 
              onClick={() => navigate('/rooms')}
              className="btn-secondary"
            >
              <span className="btn-icon">🏠</span>
              Retour aux salles
            </button>
          </div>
          <div className="empty-info">
            Code de la salle : {gameId}
          </div>
        </div>
      </div>
    );
  }

  // Choisir l'état de jeu approprié
  const currentState = gameMode === 'ai' ? aiGameState : gameState;
  
  // Générer le message d'aide pour le joueur en mode IA
  const getPlayerMessage = () => {
    if (gameMode !== 'ai') return currentState.message;
    
    if (aiThinking) return "🤖 IA réfléchit...";
    if (currentState.waitingForTurnResolution) return currentState.message;
    
    if (currentState.gamePhase === 'playing' && currentState.currentTurn === 'player') {
      const helpMessage = GarameLogic.getPlayerHelpMessage(currentState.playerCards, currentState.lastCard);
      return helpMessage;
    }
    
    return currentState.message;
  };
  
  // Adapter les données pour le GameBoard
  const boardData = gameMode === 'ai' ? {
    playerCards: currentState.playerCards,
    opponentCards: currentState.iaCards,
    tableCards: [],
    playerTableCards: currentState.playerTableCards || [],
    opponentTableCards: currentState.opponentTableCards || [],
    message: getPlayerMessage(),
    currentPlayer: currentState.currentTurn,
    disabled: currentState.currentTurn !== 'player' || 
              currentState.gamePhase !== 'playing' || 
              aiThinking || 
              currentState.waitingForTurnResolution,
    playerName: user?.pseudo || "Toi",
    opponentName: "IA",
    playerScore: currentState.scoreJoueur || 0,
    opponentScore: currentState.scoreIA || 0,
    playableCards: currentState.gamePhase === 'playing' && 
                   currentState.currentTurn === 'player' && 
                   !currentState.waitingForTurnResolution ? 
      GarameLogic.getPlayableCards(currentState.playerCards, currentState.lastCard) : []
  } : {
    // Logic multijoueur inchangée
    playerCards: currentState.playerCards || [],
    opponentCards: Array(Object.values(currentState.other_players || {})[0]?.cards_count || 0).fill({}),
    tableCards: currentState.tableCards || [],
    playerTableCards: (currentState.tableCards || []).filter(c => c.played_by === user?.id),
    opponentTableCards: (currentState.tableCards || []).filter(c => c.played_by !== user?.id),
    message: currentState.message,
    currentPlayer: currentState.isMyTurn ? 'player' : 'opponent',
    disabled: !currentState.isMyTurn || currentState.status !== 'in_progress',
    playerName: user?.pseudo || "Toi",
    opponentName: Object.values(currentState.scores || {})[0]?.player?.pseudo || "Adversaire",
    playerScore: currentState.scores?.[user?.id]?.rounds_won || 0,
    opponentScore: Object.values(currentState.scores || {})[0]?.rounds_won || 0,
    playableCards: []
  };

  return (
    <div className="mobile-container text-white game-board-content">
      <NotificationToast notifications={notifications} onRemove={removeNotification} />
      
      <GameHeader 
        gameMode={gameMode}
        pot={gameMode === 'multiplayer' ? currentState.room?.pot_amount : 0}
        onAbandon={handleAbandon}
        showPot={gameMode === 'multiplayer'}
      />

      {/* Debug info pour développement */}
      {import.meta.env.DEV && gameMode === 'ai' && (
        <div className="fixed top-20 right-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs max-w-xs z-50">
          <div><strong>Debug IA:</strong></div>
          <div>Manche: {currentState.mancheActuelle}</div>
          <div>Score: {currentState.scoreJoueur}-{currentState.scoreIA}</div>
          <div>Tour: {currentState.currentRound}/5</div>
          <div>Turn: {currentState.currentTurn}</div>
          <div>Main: {currentState.main}</div>
          <div>Phase: {currentState.gamePhase}</div>
          <div>Waiting: {currentState.waitingForTurnResolution ? 'YES' : 'NO'}</div>
          <div>Playable: {boardData.playableCards?.length || 0}</div>
          <div>Kora: {currentState.koraBonus > 1 ? `x${currentState.koraBonus}` : 'None'}</div>
          {currentState.lastCard && (
            <div>LastCard: {currentState.lastCard.value}{currentState.lastCard.suit}</div>
          )}
          {currentState.carteGagnante && (
            <div>WinCard: {currentState.carteGagnante.value}{currentState.carteGagnante.suit}</div>
          )}
          {aiThinking && <div className="text-yellow-400">🤖 IA réfléchit...</div>}
        </div>
      )}

      {/* Infos des joueurs pour le multijoueur */}
      {gameMode === 'multiplayer' && currentState.scores && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {Object.entries(currentState.scores).map(([playerId, scoreData]) => (
            <PlayerInfo
              key={playerId}
              name={scoreData.player.pseudo}
              score={scoreData.rounds_won}
              isCurrentPlayer={currentState.currentPlayerId === playerId}
              cardCount={playerId === user?.id ? 
                currentState.playerCards?.length : 
                currentState.other_players?.[playerId]?.cards_count || 0
              }
              isAI={false}
            />
          ))}
        </div>
      )}

      {/* Board de jeu */}
      <GameBoard
        {...boardData}
        onCardPlay={gameMode === 'ai' ? playAiCard : actions.playCard}
      />

      {/* Indication des cartes jouables en mode IA */}
      {gameMode === 'ai' && currentState.gamePhase === 'playing' && currentState.currentTurn === 'player' && !currentState.waitingForTurnResolution && (
        <div className="fixed top-32 left-4 bg-blue-900/80 border border-blue-500 rounded-lg p-3 text-sm max-w-xs z-40">
          <div className="font-bold text-blue-300 mb-1">💡 Aide:</div>
          <div className="text-white">{GarameLogic.getPlayerHelpMessage(currentState.playerCards, currentState.lastCard)}</div>
          {boardData.playableCards && boardData.playableCards.length > 0 && (
            <div className="mt-2 text-green-300">
              {boardData.playableCards.length} carte{boardData.playableCards.length > 1 ? 's' : ''} jouable{boardData.playableCards.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Gains potentiels */}
      <div className="game-reward reward-below-cards">
        {gameMode === 'ai' ? (
          '🎁 Gain potentiel : Ta dignité et progression'
        ) : (
          `🎁 Gain potentiel : ${new Intl.NumberFormat('fr-FR').format(
            Math.floor((currentState.room?.pot_amount || 0) * 0.9)
          )} FCFA`
        )}
      </div>

      {/* Footer avec scores et infos */}
      <div className="game-footer footer-below-cards">
        {gameMode === 'ai' ? (
          <>
            <div className="text-center mb-2">
              <div className="text-lg font-bold">
                Partie: Premier à {currentState.nombreManchesPourGagner} manches | 
                Manche {currentState.mancheActuelle} - Tour {currentState.currentRound}/5
              </div>
              {currentState.roundsGagnés && currentState.roundsGagnés.length > 0 && (
                <div className="text-sm text-gray-400">
                  Tours gagnés: {currentState.roundsGagnés.map((winner, i) => 
                    `${i + 1}:${winner === 'player' ? '🧍' : '🤖'}`
                  ).join(' | ')}
                </div>
              )}
              {currentState.main && !currentState.waitingForTurnResolution && (
                <div className="text-sm text-blue-300">
                  {currentState.main === 'player' ? '🧍 Tu as la main' : '🤖 IA a la main'}
                </div>
              )}
            </div>
            <div className="text-center">
              Score des manches : 🧍 {currentState.scoreJoueur} - 🤖 {currentState.scoreIA}
            </div>
            {currentState.gamePhase === 'gameEnd' && (
              <div className="mt-4 text-center space-y-4">
                <div className="text-xl font-bold mb-4">
                  {currentState.winner === 'player' ? '🎉 Félicitations ! Tu as gagné !' : '😢 L\'IA a gagné cette fois.'}
                </div>
                
                {/* Résumé de la partie */}
                <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-300 mb-2">Résumé de la partie :</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-blue-400">🧍 Vous</div>
                      <div className="text-2xl font-bold">{currentState.scoreJoueur}</div>
                      <div className="text-gray-400">manches gagnées</div>
                    </div>
                    <div>
                      <div className="text-red-400">🤖 IA</div>
                      <div className="text-2xl font-bold">{currentState.scoreIA}</div>
                      <div className="text-gray-400">manches gagnées</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center text-xs text-gray-500">
                    Partie terminée en {currentState.mancheActuelle} manche{currentState.mancheActuelle > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={handleNewGame} 
                    className="btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, var(--lamap-red), #a32222)',
                      color: 'var(--lamap-white)',
                      border: '2px solid var(--lamap-red)',
                      borderRadius: '12px',
                      padding: '16px 24px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(198, 40, 40, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(198, 40, 40, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(198, 40, 40, 0.3)';
                    }}
                  >
                    🎮 Nouvelle Partie
                  </button>
                  
                  <button 
                    onClick={() => navigate('/')} 
                    className="btn-secondary"
                    style={{
                      background: '#2A2A2A',
                      color: 'var(--lamap-white)',
                      border: '1px solid #444',
                      borderRadius: '12px',
                      padding: '16px 24px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#444';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = '#2A2A2A';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    🏠 Accueil
                  </button>
                </div>

                {/* Message d'encouragement */}
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#888', 
                  marginTop: '1rem',
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  {currentState.winner === 'player' ? 
                    (currentState.koraBonus === 2 ? '🔥 KORA ! Victoire magistrale avec un 3 !' : '🔥 Excellent ! Vous maîtrisez le Garame !') : 
                    '💪 Ne lâchez rien ! La prochaine sera la bonne !'
                  }
                </div>
              </div>
            )}
          </>
        ) : (
          // Logic multijoueur inchangée
          <>
            {currentState.room && (
              <>
                Premier à {currentState.room.rounds_to_win} manches |
                Manche {currentState.roundNumber}
              </>
            )}
            {currentState.status === 'completed' && (
              <div className="mt-2">
                <button 
                  onClick={() => navigate('/rooms')}
                  className="btn btn-primary"
                >
                  Retour aux salles
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions rapides pour le multijoueur */}
      {gameMode === 'multiplayer' && currentState.isMyTurn && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2">
          <button
            onClick={actions.passTurn}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
            disabled={!currentState.isMyTurn}
          >
            Passer le tour
          </button>
        </div>
      )}
    </div>
  );
}