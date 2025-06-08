import Card from './Card';
import GameMessage from './GameMessage';

const GameBoard = ({
  playerCards,
  opponentCards,
  tableCards = [], // Toutes les cartes jouées dans l'ordre
  playerTableCards = [], // Cartes du joueur sur la table
  opponentTableCards = [], // Cartes de l'adversaire sur la table
  message,
  currentPlayer,
  onCardPlay,
  disabled = false,
  playerName = "Toi",
  opponentName = "Adversaire",
  playerScore = 0,
  opponentScore = 0,
  playableCards = [] // Cartes que le joueur peut jouer
}) => {

  const handleCardClick = (card) => {
    if (disabled || currentPlayer !== 'player') return;
    onCardPlay(card);
  };

  const isCardPlayable = (card) => {
    if (currentPlayer !== 'player' || disabled) return false;
    return playableCards.some(pc => pc.value === card.value && pc.suit === card.suit);
  };

  return (
    <div className="text-white d-flex flex-column items-center">
      
      {/* Adversaire */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {opponentScore}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {opponentName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-bold">{opponentName}</span>
          </div>
        </div>
      </div>

      {/* Cartes adversaires (face cachée) */}
      <div className="cards-row mb-4">
        {opponentCards.map((_, i) => (
          <div key={i} className="inline-block">
            <Card hidden />
          </div>
        ))}
      </div>

      {/* Tatami avec toutes les cartes jouées */}
      <div className="tatami-container">
        <div className="tatami-background">
          {/* Cartes de l'adversaire sur le tatami */}
          {opponentTableCards.length > 0 && (
            <div className="tatami-section opponent-section">
              <div className="stacked-cards">
                {opponentTableCards.map((card, i) => (
                  <div 
                    key={`opp-${i}`} 
                    className="stacked-card"
                    style={{ 
                      zIndex: i + 1,
                      transform: `translateX(${i * 15}px) rotate(${(i - 2) * 3}deg)`
                    }}
                  >
                    <Card 
                      value={card.value} 
                      suit={card.suit}
                      clickable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message central avec infos de tour */}
          <div className="tatami-message">
            <div className="text-center text-white">
              <div className="text-lg font-semibold mb-2">{message}</div>
              {currentPlayer === 'player' && playableCards.length > 0 && (
                <div className="text-sm text-green-400">
                  {playableCards.length} carte{playableCards.length > 1 ? 's' : ''} jouable{playableCards.length > 1 ? 's' : ''}
                </div>
              )}
              {currentPlayer === 'player' && playableCards.length === 0 && !disabled && (
                <div className="text-sm text-red-400">
                  Aucune carte jouable - Joue ta plus petite carte
                </div>
              )}
            </div>
          </div>

          {/* Cartes du joueur sur le tatami */}
          {playerTableCards.length > 0 && (
            <div className="tatami-section player-section">
              <div className="stacked-cards">
                {playerTableCards.map((card, i) => (
                  <div 
                    key={`player-${i}`} 
                    className="stacked-card"
                    style={{ 
                      zIndex: i + 1,
                      transform: `translateX(${i * 15}px) rotate(${(i - 2) * 2}deg)`
                    }}
                  >
                    <Card 
                      value={card.value} 
                      suit={card.suit}
                      clickable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historique complet au centre si nécessaire */}
          {tableCards.length > 0 && (
            <div className="tatami-history">
              <div className="text-xs text-gray-400 text-center mb-2">
                Dernière carte jouée:
              </div>
              <div className="flex justify-center">
                <Card 
                  value={tableCards[tableCards.length - 1].value}
                  suit={tableCards[tableCards.length - 1].suit}
                  clickable={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Joueur avec infos détaillées */}
      <div className="text-center mt-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {playerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">{playerName}</div>
              <div className="text-xs text-gray-400">
                Somme: {playerCards.reduce((sum, card) => sum + card.value, 0)}
              </div>
            </div>
          </div>
          <div className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {playerScore}
          </div>
        </div>
      </div>

      {/* Cartes du joueur */}
      <div className="cards-row mt-4">
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