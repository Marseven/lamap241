import { useState, useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import { useWallet } from '../contexts/WalletContext';

export default function GameRoom() {
  const { deductGameBet, addGameWinnings } = useWallet();

  const [playerCards, setPlayerCards] = useState([]);
  const [iaCards, setIaCards] = useState([]);
  const [message, setMessage] = useState('');
  const [tableCard, setTableCard] = useState(null);
  const [opponentTableCard, setOpponentTableCard] = useState(null);
  const [turn, setTurn] = useState('player');
  const [score, setScore] = useState({ player: 0, ia: 0 });
  const [games, setGames] = useState({ player: 0, ia: 0 });
  const [roundWinner, setRoundWinner] = useState(null);
  const [gamePhase, setGamePhase] = useState('playing');

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

  const fullDeck = () => {
    const suits = ['♠', '♥', '♣', '♦'];
    const cards = [];
    for (let i = 3; i <= 10; i++) {
      suits.forEach(suit => cards.push({ value: i, suit }));
    }
    return cards;
  };

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

  const playCard = (card) => {
    if (turn !== 'player' || gamePhase !== 'playing') return;

    const newPlayerCards = playerCards.filter(c => c !== card);
    setPlayerCards(newPlayerCards);

    if (tableCard && opponentTableCard) {
      const canWin = card.suit === tableCard.suit && card.value > tableCard.value;

      if (canWin) {
        setMessage(`Tu joues ${card.value}${card.suit} (supérieure) et récupères la main !`);
        setTableCard({ ...card });
        setOpponentTableCard(null);

        if (newPlayerCards.length === 0 && iaCards.length === 0) {
          endRound('player');
        } else {
          setTurn('player');
        }
      } else {
        setMessage(`Tu joues ${card.value}${card.suit} - IA garde la main`);
        setOpponentTableCard(null);

        if (newPlayerCards.length === 0 && iaCards.length === 0) {
          endRound('ia');
        } else {
          setTurn('ia');
        }
      }
    } else {
      setTableCard({ ...card });
      setMessage(`Tu joues ${card.value}${card.suit}`);

      if (newPlayerCards.length === 0 && iaCards.length === 0) {
        setTimeout(() => endRound('player'), 1000);
      } else {
        setTurn('ia');
      }
    }
  };

  const chooseBestCardForIA = () => {
    return iaCards.reduce((a, b) => (a.value > b.value ? a : b));
  };

  const iaPlays = () => {
    if (iaCards.length === 0 || gamePhase !== 'playing') return;

    let iaCardToPlay = null;
    let nextTurn = 'player';
    let messageText = '';

    if (tableCard && opponentTableCard === null) {
      const sameSuit = iaCards.filter(c => c.suit === tableCard.suit);
      const stronger = sameSuit.filter(c => c.value > tableCard.value);
      const weaker = sameSuit.filter(c => c.value < tableCard.value);

      if (stronger.length > 0) {
        iaCardToPlay = stronger.reduce((a, b) => (a.value < b.value ? a : b));
        messageText = `IA joue ${iaCardToPlay.value}${iaCardToPlay.suit} (supérieure) et garde la main`;
        nextTurn = 'ia';
      } else if (weaker.length > 0) {
        iaCardToPlay = weaker.reduce((a, b) => (a.value > b.value ? a : b));
        messageText = `IA joue ${iaCardToPlay.value}${iaCardToPlay.suit} (inférieure) - Tu récupères la main`;
        nextTurn = 'player';
      } else {
        iaCardToPlay = iaCards[Math.floor(Math.random() * iaCards.length)];
        messageText = `IA n'a pas la famille, joue ${iaCardToPlay.value}${iaCardToPlay.suit} - Tu gardes la main`;
        nextTurn = 'player';
      }
    } else {
      iaCardToPlay = chooseBestCardForIA();
      messageText = `IA joue ${iaCardToPlay.value}${iaCardToPlay.suit}`;
      nextTurn = 'player';
    }

    setIaCards(prev => prev.filter(c => c !== iaCardToPlay));
    setOpponentTableCard({ ...iaCardToPlay });
    setMessage(messageText);

    const newIaCards = iaCards.filter(c => c !== iaCardToPlay);

    setTimeout(() => {
      if (newIaCards.length === 0 && playerCards.length === 0) {
        endRound('ia');
      } else if (nextTurn === 'ia' && newIaCards.length > 0) {
        setTableCard({ ...iaCardToPlay });
        setOpponentTableCard(null);
        setTurn('ia');
      } else {
        setTurn(nextTurn);
      }
    }, 1500);
  };

  const endRound = (winner) => {
    setRoundWinner(winner);
    const newScore = { ...score, [winner]: score[winner] + 1 };
    setScore(newScore);

    if (newScore[winner] >= 3) {
      const newGames = { ...games, [winner]: games[winner] + 1 };
      setGames(newGames);
      setMessage(`🎉 ${winner === 'player' ? 'Tu gagnes' : 'IA gagne'} la partie ! (${newScore.player}-${newScore.ia})`);
      setGamePhase('gameEnd');

      setTimeout(() => {
        setScore({ player: 0, ia: 0 });
        startNewRound();
        setTurn('player');
      }, 4000);
    } else {
      setMessage(`${winner === 'player' ? 'Tu gagnes' : 'IA gagne'} cette manche ! Score: ${newScore.player}-${newScore.ia}`);
      setGamePhase('roundEnd');

      setTimeout(() => {
        startNewRound();
        setTurn(winner);
      }, 3000);
    }
  };

  const resetGame = () => {
    setScore({ player: 0, ia: 0 });
    setGames({ player: 0, ia: 0 });
    startNewRound();
  };

  return (
    <div className="mobile-container text-white game-board-content">
      <div className="game-header">
        <button onClick={resetGame} className="btn btn-primary btn-menu">
          <i className="fa fa-refresh"></i> Reset Série
        </button>
      </div>

      <GameBoard
        playerCards={playerCards}
        opponentCards={iaCards}
        tableCard={tableCard}
        opponentTableCard={opponentTableCard}
        message={message}
        currentPlayer={turn}
        onCardPlay={playCard}
        disabled={turn !== 'player' || gamePhase !== 'playing'}
      />

      <div className="game-reward reward-below-cards">
        🎁 Gain potentiel : Ta dignité
      </div>

      <div className="game-footer footer-below-cards">
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