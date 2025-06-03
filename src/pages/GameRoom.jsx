import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import { useWallet } from '../contexts/WalletContext';

// Dans le composant GameRoom, ajoute :
const { deductGameBet, addGameWinnings } = useWallet();

// Modifier la fonction endRound pour gérer les gains :
const endRound = (winner) => {
  setRoundWinner(winner);
  const newScore = {
    ...score,
    [winner]: score[winner] + 1
  };
  setScore(newScore);
  
  if (newScore[winner] >= 3) {
    // Partie terminée
    if (winner === 'player') {
      // Le joueur gagne - ajouter les gains (simulation)
      const winnings = 1800; // 90% d'une mise de 2000 FCFA par exemple
      addGameWinnings(winnings, 'vs-ai');
    }
    
    setMessage(`🎉 ${winner === 'player' ? 'Tu gagnes' : 'IA gagne'} la partie !`);
    setGamePhase('gameEnd');
    
    // Retour à l'accueil après 4 secondes
    setTimeout(() => {
      setScore({ player: 0, ia: 0 });
      window.location.href = '/';
    }, 4000);
  } else {
    // Manche suivante
    setMessage(`${winner === 'player' ? 'Tu gagnes' : 'IA gagne'} cette manche ! Score: ${newScore.player}-${newScore.ia}`);
    setGamePhase('roundEnd');
    
    setTimeout(() => {
      startNewRound();
      setTurn(winner);
    }, 3000);
  }
};

const fullDeck = () => {
  const suits = ['♠', '♥', '♣', '♦'];
  const cards = [];
  for (let i = 2; i <= 10; i++) {
    suits.forEach(suit => cards.push({ value: i, suit }));
  }
  return cards;
};


export default function GameRoom() {
  const [playerCards, setPlayerCards] = useState([]);
  const [iaCards, setIaCards] = useState([]);
  const [message, setMessage] = useState('');
  const [tableCard, setTableCard] = useState(null);
  const [opponentTableCard, setOpponentTableCard] = useState(null);
  const [turn, setTurn] = useState('player');
  const [score, setScore] = useState({ player: 0, ia: 0 }); // Score des manches dans la partie courante
  const [games, setGames] = useState({ player: 0, ia: 0 }); // Score des parties gagnées
  const [roundWinner, setRoundWinner] = useState(null);
  const [gamePhase, setGamePhase] = useState('playing'); // 'playing', 'roundEnd', 'gameEnd'

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    if (turn === 'ia' && gamePhase === 'playing' && iaCards.length > 0) {
      const timer = setTimeout(() => {
        iaPlays();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn, gamePhase, iaCards.length]);

  const startNewRound = () => {
    const deck = fullDeck().sort(() => 0.5 - Math.random());
    setPlayerCards(deck.slice(0, 5));
    setIaCards(deck.slice(5, 10));
    setTableCard(null);
    setOpponentTableCard(null);
    setMessage('Nouvelle manche - Tu commences !');
    setTurn('player');
    setRoundWinner(null);
    setGamePhase('playing');
  };

  const iaPlays = () => {
    if (iaCards.length === 0 || gamePhase !== 'playing') return;

    let iaCardToPlay = null;
    let nextTurn = 'player';
    let messageText = '';

    // Si le joueur a joué une carte (IA répond)
    if (tableCard && opponentTableCard === null) {
      const sameSuit = iaCards.filter(c => c.suit === tableCard.suit);
      const stronger = sameSuit.filter(c => c.value > tableCard.value);
      const weaker = sameSuit.filter(c => c.value < tableCard.value);

      if (stronger.length > 0) {
        // IA a une carte plus forte de la même famille
        iaCardToPlay = stronger.reduce((a, b) => (a.value < b.value ? a : b)); // Prend la plus petite des cartes supérieures
        messageText = `IA joue ${iaCardToPlay.value}${iaCardToPlay.suit} (supérieure) et garde la main`;
        nextTurn = 'ia'; // IA garde la main et va rejouer
      } else if (weaker.length > 0) {
        // IA a une carte plus faible de la même famille
        iaCardToPlay = weaker.reduce((a, b) => (a.value > b.value ? a : b)); // Prend la plus forte des cartes inférieures
        messageText = `IA joue ${iaCardToPlay.value}${iaCardToPlay.suit} (inférieure) - Tu récupères la main`;
        nextTurn = 'player'; // Joueur récupère la main
      } else {
        // IA n'a pas de carte de la même famille
        iaCardToPlay = iaCards[Math.floor(Math.random() * iaCards.length)]; // Carte aléatoire
        messageText = `IA n'a pas la famille, joue ${iaCardToPlay.value}${iaCardToPlay.suit} - Tu gardes la main`;
        nextTurn = 'player'; // Joueur garde la main
      }
    } else {
      // IA commence ou continue (elle a la main)
      // Stratégie : jouer une carte forte dans une famille où elle domine
      iaCardToPlay = chooseBestCardForIA();
      messageText = `IA joue ${iaCardToPlay.value}${iaCardToPlay.suit}`;
      nextTurn = 'player'; // Maintenant c'est au joueur de répondre
    }

    // Jouer la carte
    setIaCards(prev => prev.filter(c => c !== iaCardToPlay));
    setOpponentTableCard({ ...iaCardToPlay });
    setMessage(messageText);

    // Vérifier si c'est la fin de la manche
    const newIaCards = iaCards.filter(c => c !== iaCardToPlay);
    
    setTimeout(() => {
      if (newIaCards.length === 0 && playerCards.length === 0) {
        // Fin de manche - celui qui vient de jouer a la main
        endRound('ia');
      } else if (nextTurn === 'ia' && newIaCards.length > 0) {
        // IA continue à jouer car elle garde la main
        setTableCard({ ...iaCardToPlay });
        setOpponentTableCard(null);
        setTurn('ia'); // Ceci va déclencher un nouveau iaPlays() via useEffect
      } else {
        // Passer la main au joueur
        setTurn(nextTurn);
      }
    }, 1500);
  };

  const chooseBestCardForIA = () => {
    // Stratégie simple : jouer la carte la plus forte
    // On pourrait améliorer en analysant les cartes du joueur déjà jouées
    return iaCards.reduce((a, b) => (a.value > b.value ? a : b));
  };

  const playCard = (card) => {
    if (turn !== 'player' || gamePhase !== 'playing') return;

    const newPlayerCards = playerCards.filter(c => c !== card);
    setPlayerCards(newPlayerCards);
    
    // Si IA a déjà joué, le joueur répond
    if (tableCard && opponentTableCard) {
      const canWin = card.suit === tableCard.suit && card.value > tableCard.value;
      
      if (canWin) {
        setMessage(`Tu joues ${card.value}${card.suit} (supérieure) et récupères la main !`);
        setTableCard({ ...card });
        setOpponentTableCard(null);
        
        // Vérifier fin de manche
        if (newPlayerCards.length === 0 && iaCards.length === 0) {
          endRound('player');
        } else {
          setTurn('player'); // Joueur garde la main
        }
      } else {
        setMessage(`Tu joues ${card.value}${card.suit} - IA garde la main`);
        setOpponentTableCard(null);
        
        // Vérifier fin de manche
        if (newPlayerCards.length === 0 && iaCards.length === 0) {
          endRound('ia');
        } else {
          setTurn('ia'); // IA garde la main
        }
      }
    } else {
      // Joueur commence ou continue
      setTableCard({ ...card });
      setMessage(`Tu joues ${card.value}${card.suit}`);
      
      // Vérifier fin de manche
      if (newPlayerCards.length === 0 && iaCards.length === 0) {
        setTimeout(() => endRound('player'), 1000);
      } else {
        setTurn('ia'); // IA doit répondre
      }
    }
  };

  const endRound = (winner) => {
    setRoundWinner(winner);
    const newScore = {
      ...score,
      [winner]: score[winner] + 1
    };
    setScore(newScore);
    
    if (newScore[winner] >= 3) {
      // Une partie se termine, incrémenter le score des parties
      const newGames = {
        ...games,
        [winner]: games[winner] + 1
      };
      setGames(newGames);
      setMessage(`🎉 ${winner === 'player' ? 'Tu gagnes' : 'IA gagne'} la partie ! (${newScore[winner]}-${newScore[winner === 'player' ? 'ia' : 'player']})`);
      setGamePhase('gameEnd');
      
      // Remettre à zéro le score des manches pour la prochaine partie
      setTimeout(() => {
        setScore({ player: 0, ia: 0 });
        startNewRound();
        setTurn('player'); // Le joueur commence toujours une nouvelle partie
      }, 4000);
    } else {
      setMessage(`${winner === 'player' ? 'Tu gagnes' : 'IA gagne'} cette manche ! Score: ${newScore.player}-${newScore.ia}`);
      setGamePhase('roundEnd');
      
      // Démarrer une nouvelle manche après 3 secondes
      setTimeout(() => {
        startNewRound();
        setTurn(winner); // Le gagnant de la manche précédente commence
      }, 3000);
    }
  };

  const resetGame = () => {
    setScore({ player: 0, ia: 0 });
    setGames({ player: 0, ia: 0 });
    startNewRound();
  };

  return (
    <div className="mobile-container">
      <div className="game-header">
        <Link to="/" className="btn btn-primary btn-menu">
         <i className="fa fa-home"></i> Accueil
        </Link>
        <button onClick={resetGame} className="btn btn-primary btn-menu">
           <i className="fa fa-refresh"></i> Reset Série
        </button>
        <button
          className="btn btn-primary btn-menu"
          onClick={() =>
            window.open(`https://wa.me/?text=J'ai joué à LaMap241 ! Manches: ${score.player}-${score.ia} | Parties: ${games.player}-${games.ia}`, '_blank')
          }
        >
          <i className="fa fa-whatsapp"></i> Share
        </button>
      </div>

      <GameBoard
        playerCards={playerCards}
        opponentCards={iaCards}
        tableCard={tableCard}
        opponentTableCard={opponentTableCard}
        message={message}
        onPlay={playCard}
        disabled={turn !== 'player' || gamePhase !== 'playing'}
      />

      <div className="game-reward text-center my-2">
        🎁 Gain potentiel : Ta dignité
      </div>

      <div className="game-footer mt-2">
        Manches : 🧍 {score.player} - 🤖 {score.ia} | Parties : 🎯 {games.player} - {games.ia}
        {gamePhase === 'gameEnd' && (
          <div className="mt-2">
            <button onClick={resetGame} className="btn btn-success">
              Nouvelle Série
            </button>
          </div>
        )}
      </div>
    </div>
  );
}