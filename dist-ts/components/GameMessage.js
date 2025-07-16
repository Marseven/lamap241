import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export default function GameMessage({ message, type = 'normal', currentPlayer }) {
    const getMessageClass = () => {
        switch (type) {
            case 'important':
                return 'game-message important';
            case 'success':
                return 'game-message bg-green-800 border-green-600';
            case 'warning':
                return 'game-message bg-yellow-800 border-yellow-600';
            case 'error':
                return 'game-message bg-red-800 border-red-600';
            default:
                return 'game-message';
        }
    };
    const getTurnIndicator = () => {
        if (!currentPlayer)
            return '';
        return currentPlayer === 'player' ? '👤 Ton tour' : '🤖 Tour de l\'IA';
    };
    return (_jsxs("div", { className: `${getMessageClass()} fade-in`, children: [_jsx("div", { className: "font-semibold", children: message }), currentPlayer && (_jsx("div", { className: "text-sm opacity-80", children: getTurnIndicator() }))] }));
}
