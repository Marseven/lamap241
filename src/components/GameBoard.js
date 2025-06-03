import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import Card from './Card';
import GameMessage from './GameMessage';
const GameBoard = ({ playerCards, opponentCards, tableCard, opponentTableCard, message, currentPlayer, selectedCard, onCardSelect, onCardPlay, disabled = false }) => {
    const handleCardClick = (card) => {
        if (disabled || currentPlayer !== 'player')
            return;
        if (selectedCard === card) {
            // Double clic = jouer la carte
            onCardPlay(card);
        }
        else {
            // Simple clic = sélectionner
            onCardSelect(card);
        }
    };
    const isCardPlayable = (card) => {
        if (currentPlayer !== 'player' || disabled)
            return false;
        // Si pas de carte sur la table, toutes les cartes sont jouables
        if (!tableCard && !opponentTableCard)
            return true;
        // Si l'adversaire a joué et on doit répondre
        if (opponentTableCard && !tableCard) {
            return card.suit === opponentTableCard.suit && card.value > opponentTableCard.value;
        }
        return true;
    };
    return (_jsxs("div", { className: "mobile-container text-white d-flex flex-column align-items-center", children: [_jsx("div", { className: "text-center mb-4", children: _jsxs("div", { className: "text-sm font-bold mb-2", children: ["\uD83E\uDD16 Adversaire (", opponentCards.length, " cartes)"] }) }), _jsx("div", { className: "flex flex-row justify-center gap-2 flex-wrap", children: opponentCards.map((_, i) => (_jsx("div", { className: "inline-block", children: _jsx(Card, { hidden: true }) }, i))) }), _jsxs("div", { className: "card-center", children: [opponentTableCard && (_jsxs("div", { className: "relative", children: [_jsx(Card, { value: opponentTableCard.value, suit: opponentTableCard.suit }), _jsx("div", { className: "absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-blue-600 px-2 py-1 rounded", children: "IA" })] })), tableCard && (_jsxs("div", { className: "relative", children: [_jsx(Card, { value: tableCard.value, suit: tableCard.suit }), _jsx("div", { className: "absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs bg-green-600 px-2 py-1 rounded", children: "Toi" })] })), !tableCard && !opponentTableCard && (_jsxs("div", { className: "text-gray-500 text-center", children: [_jsx("div", { className: "text-4xxl mb-2", children: "\u2660" }), _jsx("div", { className: "text-sm", children: "Zone de jeu" })] }))] }), _jsx(GameMessage, { message: message, currentPlayer: currentPlayer, type: disabled ? 'warning' : 'normal' }), selectedCard && currentPlayer === 'player' && !disabled && (_jsxs("div", { className: "bg-red-800 p-3 rounded-lg mb-4 text-center slide-up", children: [_jsx("div", { className: "text-sm mb-2", children: "Carte s\u00E9lectionn\u00E9e :" }), _jsx("div", { className: "flex justify-center mb-3", children: _jsx(Card, { value: selectedCard.value, suit: selectedCard.suit, selected: true }) }), _jsxs("div", { className: "flex gap-2 justify-center", children: [_jsx("button", { onClick: () => onCardPlay(selectedCard), disabled: !isCardPlayable(selectedCard), className: "bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold text-sm", children: "\u2713 Jouer" }), _jsx("button", { onClick: () => onCardSelect(null), className: "bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-bold text-sm", children: "\u2717 Annuler" })] })] })), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-sm font-bold mb-2", children: ["\uD83D\uDC64 Tes cartes (", playerCards.length, ")"] }), currentPlayer === 'player' && !disabled && (_jsx("div", { className: "mt-3 text-xs text-gray-400", children: selectedCard ?
                            'Clique sur "Jouer" ou double-clique sur la carte' :
                            'Clique sur une carte pour la sélectionner' }))] }), _jsx("div", { className: "flex flex-row justify-center gap-2 flex-wrap", children: playerCards.map((card, i) => (_jsx("div", { className: "inline-block", children: _jsx(Card, { value: card.value, suit: card.suit, clickable: currentPlayer === 'player' && !disabled, selected: selectedCard === card, playable: isCardPlayable(card), onClick: () => handleCardClick(card) }) }, `${card.value}-${card.suit}-${i}`))) })] }));
};
export default GameBoard;
