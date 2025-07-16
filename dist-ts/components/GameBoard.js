import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Card from './Card';
import GameMessage from './GameMessage';
const GameBoard = ({ playerCards, opponentCards, tableCards = [], // Toutes les cartes jouées dans l'ordre
playerTableCards = [], // Cartes du joueur sur la table
opponentTableCards = [], // Cartes de l'adversaire sur la table
message, currentPlayer, onCardPlay, disabled = false, playerName = "Toi", opponentName = "Adversaire", playerScore = 0, opponentScore = 0, playableCards = [] // Cartes que le joueur peut jouer
 }) => {
    const handleCardClick = (card) => {
        if (disabled || currentPlayer !== 'player')
            return;
        onCardPlay(card);
    };
    const isCardPlayable = (card) => {
        if (currentPlayer !== 'player' || disabled)
            return false;
        return playableCards.some(pc => pc.value === card.value && pc.suit === card.suit);
    };
    return (_jsxs("div", { className: "text-white d-flex flex-column items-center", children: [_jsx("div", { className: "text-center mb-4", children: _jsxs("div", { className: "flex items-center justify-center gap-4 mb-2", children: [_jsx("div", { className: "bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold", children: opponentScore }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold", children: opponentName.charAt(0).toUpperCase() }) }), _jsx("span", { className: "text-sm font-bold", children: opponentName })] })] }) }), _jsx("div", { className: "cards-row mb-4", children: opponentCards.map((_, i) => (_jsx("div", { className: "inline-block", children: _jsx(Card, { hidden: true }) }, i))) }), _jsx("div", { className: "tatami-container", children: _jsxs("div", { className: "tatami-background", children: [opponentTableCards.length > 0 && (_jsx("div", { className: "tatami-section opponent-section", children: _jsx("div", { className: "stacked-cards", children: opponentTableCards.map((card, i) => (_jsx("div", { className: "stacked-card", style: {
                                        zIndex: i + 1,
                                        transform: `translateX(${i * 15}px) rotate(${(i - 2) * 3}deg)`
                                    }, children: _jsx(Card, { value: card.value, suit: card.suit, clickable: false }) }, `opp-${i}`))) }) })), _jsx("div", { className: "tatami-message", children: _jsxs("div", { className: "text-center text-white", children: [_jsx("div", { className: "text-lg font-semibold mb-2", children: message }), currentPlayer === 'player' && playableCards.length > 0 && (_jsxs("div", { className: "text-sm text-green-400", children: [playableCards.length, " carte", playableCards.length > 1 ? 's' : '', " jouable", playableCards.length > 1 ? 's' : ''] })), currentPlayer === 'player' && playableCards.length === 0 && !disabled && (_jsx("div", { className: "text-sm text-red-400", children: "Aucune carte jouable - Joue ta plus petite carte" }))] }) }), playerTableCards.length > 0 && (_jsx("div", { className: "tatami-section player-section", children: _jsx("div", { className: "stacked-cards", children: playerTableCards.map((card, i) => (_jsx("div", { className: "stacked-card", style: {
                                        zIndex: i + 1,
                                        transform: `translateX(${i * 15}px) rotate(${(i - 2) * 2}deg)`
                                    }, children: _jsx(Card, { value: card.value, suit: card.suit, clickable: false }) }, `player-${i}`))) }) })), tableCards.length > 0 && (_jsxs("div", { className: "tatami-history", children: [_jsx("div", { className: "text-xs text-gray-400 text-center mb-2", children: "Derni\u00E8re carte jou\u00E9e:" }), _jsx("div", { className: "flex justify-center", children: _jsx(Card, { value: tableCards[tableCards.length - 1].value, suit: tableCards[tableCards.length - 1].suit, clickable: false }) })] }))] }) }), _jsx("div", { className: "text-center mt-4", children: _jsxs("div", { className: "flex items-center justify-center gap-4 mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-10 h-10 bg-red-600 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold", children: playerName.charAt(0).toUpperCase() }) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "text-sm font-bold", children: playerName }), _jsxs("div", { className: "text-xs text-gray-400", children: ["Somme: ", playerCards.reduce((sum, card) => sum + card.value, 0)] })] })] }), _jsx("div", { className: "bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold", children: playerScore })] }) }), _jsx("div", { className: "cards-row mt-4", children: playerCards.map((card, i) => (_jsx("div", { className: "inline-block", children: _jsx(Card, { value: card.value, suit: card.suit, clickable: currentPlayer === 'player' && !disabled, playable: isCardPlayable(card), onClick: () => handleCardClick(card) }) }, `${card.value}-${card.suit}-${i}`))) })] }));
};
export default GameBoard;
