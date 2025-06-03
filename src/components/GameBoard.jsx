import React from 'react';
import Card from './Card';

const GameBoard = ({
  playerCards,
  opponentCards,
  tableCard,
  opponentTableCard,
  message,
  onPlay
}) => {
  return (
    <div className="mobile-container text-white d-flex flex-column align-items-center justify-content-top">

      <div className="mb-2 fw-bold">Adversaire</div>
      <div className="d-flex gap-2 mb-4">
        {opponentCards.map((card, i) => (
          <Card key={i} hidden />
        ))}
      </div>

      <div className="card-center">
        {opponentTableCard && <Card value={opponentTableCard.value} suit={opponentTableCard.suit} />}
        {tableCard && <Card value={tableCard.value} suit={tableCard.suit} />}
      </div>

      <div className="text-center fw-semibold mb-4">{message}</div>

      <div className="mb-2 fw-bold">Vous</div>
      <div className="d-flex gap-2 mt-3">
        {playerCards.map((card, i) => (
          <div key={i} onClick={() => onPlay(card)} style={{ cursor: 'pointer' }}>
            <Card value={card.value} suit={card.suit} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;