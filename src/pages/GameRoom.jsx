import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameLogic } from '../hooks/useGameLogic';
import GameBoard from '../components/GameBoard';
import GameHeader from '../components/GameHeader';
import PlayerInfo from '../components/PlayerInfo';
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

  // IA intelligente
  const [aiDecisionMaker] = useState(() => new AIDecisionMaker());
  const [aiThinking, setAiThinking] = useState(false);

  // État local pour l'IA avec les vraies règles
  const [aiGameState, setAiGameState] = useState({
    playerCards: [],
    iaCards: [],
    playerTableCards: [],
    opponentTableCards: [],
    currentRound: 1,
    roundWins: [], // Qui a gagné chaque tour
    currentTurn: 'player',
    lastCard: null, // Dernière carte jouée
    hasControl: 'player', // Qui a la main
    score: { player: 0, ia: 0 },
    message: 'Nouvelle partie - Tu commences !',
    gamePhase: 'playing', // playing, roundEnd, gameEnd
    autoWin: null,
    koraBonus: 1
  });

  // Logique pour jeu contre l'IA avec vraies règles
  const startNewAiGame = () => {
    const deck = GarameLogic.createGarameDeck();
    const playerCards = deck.slice(0, 5);
    const iaCards = deck.slice(5, 10);
    
    // Vérifier les victoires automatiques
    const playerAutoWin = GarameLogic.checkAutoWin(playerCards);
    const iaAutoWin = GarameLogic.checkAutoWin(iaCards);
    
    if (playerAutoWin.autoWin) {
      setAiGameState({
        playerCards,
        iaCards,
        playerTableCards: [],
        opponentTableCards: [],
        currentRound: 1,
        roundWins: [],
        currentTurn: 'player',
        lastCard: null,
        hasControl: 'player',
        gamePhase: 'gameEnd',
        autoWin: playerAutoWin,
        winner: 'player',
        message: `🎉 ${playerAutoWin.reason} - Tu gagnes automatiquement !`,
        koraBonus: 1,
        score: { player: 1, ia: 0 }
      });
      return;
    }
    
    if (iaAutoWin.autoWin) {
      setAiGameState({
        playerCards,
        iaCards,
        playerTableCards: [],
        opponentTableCards: [],
        currentRound: 1,
        roundWins: [],
        currentTurn: 'player',
        lastCard: null,
        hasControl: 'player',
        gamePhase: 'gameEnd',
        autoWin: iaAutoWin,
        winner: 'ia',
        message: `😔 IA gagne automatiquement (${iaAutoWin.reason})`,
        koraBonus: 1,
        score: { player: 0, ia: 1 }
      });
      return;
    }
    
    setAiGameState({
      playerCards,
      iaCards,
      playerTableCards: [],
      opponentTableCards: [],
      currentRound: 1,
      roundWins: [],
      currentTurn: 'player',
      lastCard: null,
      hasControl: 'player',
      score: { player: 0, ia: 0 },
      message: GarameLogic.getGameMessage({}, 'player', 1),
      gamePhase: 'playing',
      autoWin: null,
      koraBonus: 1
    });
  };

  // Initialiser le jeu IA
  useEffect(() => {
    if (gameMode === 'ai') {
      startNewAiGame();
    }
  }, [gameMode]);

  // Effet pour gérer les tours de l'IA
  useEffect(() => {
    if (gameMode === 'ai' && 
        aiGameState.currentTurn === 'ia' && 
        aiGameState.gamePhase === 'playing' &&
        !aiThinking &&
        aiGameState.iaCards.length > 0) {
      
      console.log('🤖 IA doit jouer, état:', {
        currentTurn: aiGameState.currentTurn,
        hasControl: aiGameState.hasControl,
        lastCard: aiGameState.lastCard,
        cardsCount: aiGameState.iaCards.length,
        currentRound: aiGameState.currentRound
      });
      
      // Délai différent selon si l'IA a la main ou répond
      const delay = aiGameState.hasControl === 'ia' ? 1000 : 1500;
      setTimeout(() => {
        executeAITurn();
      }, delay);
    }
  }, [aiGameState.currentTurn, aiGameState.gamePhase, aiThinking, gameMode, aiGameState.hasControl]);

  // Fonction pour exécuter le tour de l'IA
  const executeAITurn = async () => {
    if (aiThinking) return; // Éviter les appels multiples
    
    setAiThinking(true);
    
    try {
      // Délai pour simulation de réflexion
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAiGameState(prev => {
        if (prev.currentTurn !== 'ia' || prev.iaCards.length === 0 || prev.gamePhase !== 'playing') {
          console.log('🤖 Conditions IA non remplies, abandon du tour');
          return prev;
        }

        // L'IA prend sa décision
        const decision = aiDecisionMaker.makeDecision(prev.iaCards, {
          lastCard: prev.lastCard,
          currentRound: prev.currentRound,
          roundWins: prev.roundWins,
          hasControl: prev.hasControl,
          playerCards: prev.playerCards,
          playerTableCards: prev.playerTableCards,
          opponentTableCards: prev.opponentTableCards
        });

        const aiCard = decision.card;
        const newIaCards = prev.iaCards.filter(c => c !== aiCard);
        
        console.log(`🤖 IA joue:`, {
          card: `${aiCard.value}${aiCard.suit}`,
          reason: decision.reason,
          hadControl: prev.hasControl
        });
        
        // Déterminer qui prend la main après ce coup
        let newControl;
        let roundWinner = null;
        
        if (prev.hasControl === 'ia') {
          // IA a la main, elle impose sa carte
          newControl = 'player'; // Le joueur doit répondre
        } else {
          // IA répond à la carte du joueur
          if (prev.lastCard && aiCard.suit === prev.lastCard.suit && aiCard.value > prev.lastCard.value) {
            newControl = 'ia'; // IA reprend la main
            roundWinner = 'ia';
          } else {
            newControl = 'player'; // Le joueur garde/reprend la main
            roundWinner = 'player';
          }
        }
        
        const newRoundWins = roundWinner ? [...prev.roundWins, roundWinner] : prev.roundWins;
        const nextRound = roundWinner ? prev.currentRound + 1 : prev.currentRound;
        
        console.log(`🎯 Résultat du tour:`, {
          roundWinner,
          newControl,
          nextRound,
          totalRounds: newRoundWins.length
        });
        
        // Vérifier si c'est la fin du jeu
        if (newRoundWins.length === 5) {
          const finalWinner = GarameLogic.determineWinner(newRoundWins);
          const bonus = finalWinner === 'ia' && aiCard.value === 3 ? 2 : 1;
          
          console.log(`🏆 Fin de partie:`, { finalWinner, bonus });
          
          return {
            ...prev,
            iaCards: newIaCards,
            opponentTableCards: [...prev.opponentTableCards, aiCard],
            lastCard: aiCard,
            roundWins: newRoundWins,
            hasControl: newControl,
            currentRound: nextRound,
            gamePhase: 'gameEnd',
            winner: finalWinner,
            koraBonus: bonus,
            message: `🎉 ${finalWinner === 'ia' ? 'IA gagne' : 'Tu gagnes'} la partie !`,
            score: {
              ...prev.score,
              [finalWinner]: prev.score[finalWinner] + bonus
            },
            currentTurn: null
          };
        }
        
        // Continuer le jeu
        const nextTurn = roundWinner ? newControl : 'player';
        const statusMessage = roundWinner ? 
          `${roundWinner === 'ia' ? 'IA prend' : 'Tu prends'} la main !` :
          (newControl === 'player' ? 'À toi de répondre' : 'IA a toujours la main');
        
        return {
          ...prev,
          iaCards: newIaCards,
          opponentTableCards: [...prev.opponentTableCards, aiCard],
          lastCard: aiCard,
          roundWins: newRoundWins,
          currentRound: nextRound,
          hasControl: newControl,
          currentTurn: nextTurn,
          message: `IA joue ${aiCard.value}${aiCard.suit} - ${statusMessage}`
        };
      });
      
    } finally {
      setAiThinking(false);
    }
  };

  const playAiCard = (card) => {
    if (aiGameState.currentTurn !== 'player' || aiGameState.gamePhase !== 'playing') return;

    // Vérifier si la carte est jouable
    const playableCards = GarameLogic.getPlayableCards(aiGameState.playerCards, aiGameState.lastCard);
    if (!playableCards.some(pc => pc.value === card.value && pc.suit === card.suit)) {
      addNotification('error', 'Cette carte ne peut pas être jouée !');
      return;
    }

    const newPlayerCards = aiGameState.playerCards.filter(c => c !== card);
    
    setAiGameState(prev => {
      let newControl;
      let roundWinner = null;
      
      if (prev.hasControl === 'player') {
        // Joueur a la main, il impose sa carte
        newControl = 'ia'; // L'IA doit répondre
      } else {
        // Joueur répond à la carte de l'IA
        if (prev.lastCard && card.suit === prev.lastCard.suit && card.value > prev.lastCard.value) {
          newControl = 'player'; // Joueur reprend la main
          roundWinner = 'player';
        } else {
          newControl = 'ia'; // L'IA garde la main
          roundWinner = 'ia';
        }
      }
      
      const newRoundWins = roundWinner ? [...prev.roundWins, roundWinner] : prev.roundWins;
      const nextRound = roundWinner ? prev.currentRound + 1 : prev.currentRound;
      
      // Vérifier si c'est la fin du jeu
      if (newRoundWins.length === 5) {
        const finalWinner = GarameLogic.determineWinner(newRoundWins);
        const bonus = finalWinner === 'player' && card.value === 3 ? 
          GarameLogic.checkKoraBonus(newRoundWins, [...prev.playerTableCards, card], 5) : 1;
        
        return {
          ...prev,
          playerCards: newPlayerCards,
          playerTableCards: [...prev.playerTableCards, card],
          lastCard: card,
          roundWins: newRoundWins,
          hasControl: newControl,
          currentRound: nextRound,
          gamePhase: 'gameEnd',
          winner: finalWinner,
          koraBonus: bonus,
          message: GarameLogic.getGameMessage({ 
            gamePhase: 'gameEnd', 
            winner: finalWinner, 
            koraBonus: bonus 
          }, null, 5),
          score: {
            ...prev.score,
            [finalWinner]: prev.score[finalWinner] + bonus
          },
          currentTurn: null
        };
      }
      
      // Continuer le jeu
      const nextTurn = roundWinner ? newControl : 'ia';
      
      return {
        ...prev,
        playerCards: newPlayerCards,
        playerTableCards: [...prev.playerTableCards, card],
        lastCard: card,
        roundWins: newRoundWins,
        currentRound: nextRound,
        hasControl: newControl,
        currentTurn: nextTurn,
        message: `Tu joues ${card.value}${card.suit} - ${roundWinner ? `Tu ${roundWinner === 'player' ? 'prends' : 'perds'} la main` : 'IA doit répondre'}`
      };
    });
  };

  // Gérer l'action de jouer une carte
  const handleCardPlay = async (card) => {
    if (gameMode === 'ai') {
      playAiCard(card);
    } else {
      const result = await actions.playCard(card);
      if (!result.success) {
        addNotification('error', result.error);
      }
    }
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

  // Affichage du loading
  if (gameMode === 'multiplayer' && loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <p>Chargement de la partie...</p>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (gameMode === 'multiplayer' && error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-2">Erreur de chargement</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/rooms')}
            className="btn-primary"
          >
            Retour aux salles
          </button>
        </div>
      </div>
    );
  }

  // Choisir l'état de jeu approprié
  const currentState = gameMode === 'ai' ? aiGameState : gameState;
  
  // Adapter les données pour le GameBoard
  const boardData = gameMode === 'ai' ? {
    playerCards: currentState.playerCards,
    opponentCards: currentState.iaCards,
    tableCards: [],
    playerTableCards: currentState.playerTableCards || [],
    opponentTableCards: currentState.opponentTableCards || [],
    message: aiThinking ? "🤖 IA réfléchit..." : currentState.message,
    currentPlayer: currentState.currentTurn,
    disabled: currentState.currentTurn !== 'player' || currentState.gamePhase !== 'playing' || aiThinking,
    playerName: user?.pseudo || "Toi",
    opponentName: "IA",
    playerScore: currentState.score?.player || 0,
    opponentScore: currentState.score?.ia || 0,
    playableCards: currentState.gamePhase === 'playing' && currentState.currentTurn === 'player' ? 
      GarameLogic.getPlayableCards(currentState.playerCards, currentState.lastCard) : []
  } : {
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
        <div className="fixed top-20 right-4 bg-black bg-opacity-80 text-white p-2 rounded text-xs max-w-xs">
          <div><strong>Debug IA:</strong></div>
          <div>Tour: {currentState.currentRound}/5</div>
          <div>Turn: {currentState.currentTurn}</div>
          <div>Control: {currentState.hasControl}</div>
          <div>Rounds: [{currentState.roundWins?.join(', ')}]</div>
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
        onCardPlay={handleCardPlay}
      />

      {/* Gains potentiels */}
      <div className="game-reward reward-below-cards">
        {gameMode === 'ai' ? (
          '🎁 Gain potentiel : Ta dignité'
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
                Tour {currentState.currentRound}/5 | {currentState.hasControl === 'player' ? '🧍 Tu as la main' : '🤖 IA a la main'}
              </div>
              {currentState.roundWins && currentState.roundWins.length > 0 && (
                <div className="text-sm text-gray-400">
                  Tours gagnés: {currentState.roundWins.map((winner, i) => 
                    `${i + 1}:${winner === 'player' ? '🧍' : '🤖'}`
                  ).join(' | ')}
                </div>
              )}
            </div>
            Score : 🧍 {currentState.score.player} - 🤖 {currentState.score.ia}
            {currentState.gamePhase === 'gameEnd' && (
              <div className="mt-2 text-center">
                <button onClick={startNewAiGame} className="btn btn-success">
                  Nouvelle Partie
                </button>
              </div>
            )}
          </>
        ) : (
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