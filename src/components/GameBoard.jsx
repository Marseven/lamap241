import React from 'react';
import Card from './Card';
import GameMessage from './GameMessage';

const GameBoard = ({
  playerCards,
  opponentCards,
  tableCard,
  opponentTableCard,
  message,
  currentPlayer,
  onCardPlay,
  disabled = false
}) => {

  const handleCardClick = (card) => {
    if (disabled || currentPlayer !== 'player') return;
    onCardPlay(card); // carte jouée directement au clic
  };

  const isCardPlayable = (card) => {
    if (currentPlayer !== 'player' || disabled) return false;
    if (!tableCard && !opponentTableCard) return true;
    if (opponentTableCard && !tableCard) {
      return card.suit === opponentTableCard.suit && card.value > opponentTableCard.value;
    }
    return true;
  };

  return (
    <div className="text-white d-flex flex-column items-center">
      
      {/* Adversaire */}
      <div className="text-center mb-4">
        <div className="text-sm font-bold mb-2">
          🤖 Adversaire ({opponentCards.length} cartes)
        </div>
      </div>

      {/* Cartes adversaires (face cachée) */}
      <div className="cards-row">
        {opponentCards.map((_, i) => (
          <div key={i} className="inline-block">
            <Card hidden />
          </div>
        ))}
      </div>

      {/* Tatami avec superposition */}
      <div className="relative w-full flex flex-col items-center my-6 card-center">
        {/* Carte IA */}
        {opponentTableCard && (
          <div className="absolute -top-16 z-10">
            <Card value={opponentTableCard.value} suit={opponentTableCard.suit} />
          </div>
        )}

        {/* Message central */}
        <div className="relative z-0 text-center text-white text-lg font-semibold my-20">
          {message}
        </div>

        {/* Carte Joueur */}
        {tableCard && (
          <div className="absolute top-16 z-10">
            <Card value={tableCard.value} suit={tableCard.suit} />
          </div>
        )}
      </div>

      {/* Cartes du joueur */}
      <div className="text-center">
        <div className="text-sm font-bold mb-2">
          👤 Tes cartes ({playerCards.length})
        </div>
      </div>

      <div className="cards-row">
        {playerCards.map((card, i) => (
          <div key={`${card.value}-${card.suit}-${i}`} className="inline-block">
            <Card
              value={card.value}
              suit={card.suit}
              clickable={currentPlayer === 'player' && !disabled}
              playable={isCardPlayable(card)}
              onClick={() => handleCardClick(card)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;