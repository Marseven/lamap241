import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export default function PlayerInfo({ name, score, isCurrentPlayer = false, cardCount = 0, isAI = false }) {
    return (_jsxs("div", { className: `text-center p-3 rounded-lg border-2 transition-all ${isCurrentPlayer
            ? 'border-red-500 bg-red-900 bg-opacity-30'
            : 'border-gray-600 bg-gray-800'}`, children: [_jsxs("div", { className: "flex items-center justify-center gap-2 mb-1", children: [_jsx("span", { className: "text-lg", children: isAI ? '🤖' : '👤' }), _jsx("span", { className: "font-bold", children: name }), isCurrentPlayer && (_jsx("span", { className: "text-xs bg-red-600 px-2 py-1 rounded-full animate-pulse", children: "En jeu" }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-yellow-400", children: score }), _jsx("div", { className: "text-xs text-gray-400", children: "Manches" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-lg font-bold text-blue-400", children: cardCount }), _jsx("div", { className: "text-xs text-gray-400", children: "Cartes" })] })] })] }));
}
