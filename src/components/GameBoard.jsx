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
  selectedCard,
  onCardSelect,
  onCardPlay,
  disabled = false
}) => {
  
  const handleCardClick = (card) => {
    if (disabled || currentPlayer !== 'player') return;
    
    if (selectedCard === card) {
      // Double clic = jouer la carte
      onCardPlay(card);
    } else {
      // Simple clic = sélectionner
      onCardSelect(card);
    }
  };

  const isCardPlayable = (card) => {
    if (currentPlayer !== 'player' || disabled) return false;
    
    // Si pas de carte sur la table, toutes les cartes sont jouables
    if (!tableCard && !opponentTableCard) return true;
    
    // Si l'adversaire a joué et on doit répondre
    if (opponentTableCard && !tableCard) {
      return card.suit === opponentTableCard.suit && card.value > opponentTableCard.value;
    }
    
    return true;
  };

  return (
    <div className="mobile-container text-white d-flex flex-column align-items-center">
      
      {/* Adversaire */}
      <div className="text-center mb-4">
        <div className="text-sm font-bold mb-2">
          🤖 Adversaire ({opponentCards.length} cartes)
        </div>
        
      </div>

      <div className="flex flex-row justify-center gap-2 flex-wrap">
          {opponentCards.map((_, i) => (
            <div key={i} className="inline-block">
              <Card hidden />
            </div>
          ))}
        </div>

      {/* Zone de jeu centrale */}
      <div className="card-center">
        {opponentTableCard && (
          <div className="relative">
            <Card value={opponentTableCard.value} suit={opponentTableCard.suit} />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-blue-600 px-2 py-1 rounded">
              IA
            </div>
          </div>
        )}
        
        {tableCard && (
          <div className="relative">
            <Card value={tableCard.value} suit={tableCard.suit} />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-green-600 px-2 py-1 rounded">
              Toi
            </div>
          </div>
        )}

        {/* Indication si zone vide */}
        {!tableCard && !opponentTableCard && (
          <div className="text-gray-500 text-center">
            <div className="text-4xxl mb-2">♠</div>
            <div className="text-sm">Zone de jeu</div>
          </div>
        )}
      </div>

      {/* Message de jeu */}
      <GameMessage 
        message={message} 
        currentPlayer={currentPlayer}
        type={disabled ? 'warning' : 'normal'}
      />

      {/* Carte sélectionnée - Actions */}
      {selectedCard && currentPlayer === 'player' && !disabled && (
        <div className="bg-red-800 p-3 rounded-lg mb-4 text-center slide-up">
          <div className="text-sm mb-2">Carte sélectionnée :</div>
          <div className="flex justify-center mb-3">
            <Card 
              value={selectedCard.value} 
              suit={selectedCard.suit} 
              selected 
            />
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => onCardPlay(selectedCard)}
              disabled={!isCardPlayable(selectedCard)}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold text-sm"
            >
              ✓ Jouer
            </button>
            <button
              onClick={() => onCardSelect(null)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-bold text-sm"
            >
              ✗ Annuler
            </button>
          </div>
        </div>
      )}

      {/* Cartes du joueur */}
      <div className="text-center">
        <div className="text-sm font-bold mb-2">
          👤 Tes cartes ({playerCards.length})
        </div>
       
        
        {/* Aide pour le joueur */}
        {currentPlayer === 'player' && !disabled && (
          <div className="mt-3 text-xs text-gray-400">
            {selectedCard ? 
              'Clique sur "Jouer" ou double-clique sur la carte' : 
              'Clique sur une carte pour la sélectionner'
            }
          </div>
        )}
      </div>

       <div className="flex flex-row justify-center gap-2 flex-wrap">
          {playerCards.map((card, i) => (
            <div key={`${card.value}-${card.suit}-${i}`} className="inline-block">
              <Card
                value={card.value}
                suit={card.suit}
                clickable={currentPlayer === 'player' && !disabled}
                selected={selectedCard === card}
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