import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link } from 'react-router-dom';
export default function GameHeader({ gameMode = 'ai', pot = 0, onAbandon, showPot = false }) {
    const handleAbandon = () => {
        const confirmMessage = gameMode === 'ai'
            ? 'Abandonner la partie contre l\'IA ?'
            : `Abandonner la partie ? Tu perdras ta mise de ${pot} FCFA !`;
        if (window.confirm(confirmMessage)) {
            onAbandon();
        }
    };
    return (_jsxs("div", { className: "game-header", children: [_jsxs(Link, { to: "/", className: "btn-menu", children: [_jsx("i", { className: "fa fa-home" }), " Accueil"] }), showPot && pot > 0 && (_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-yellow-400 font-bold text-lg", children: ["\uD83D\uDCB0 ", pot, " FCFA"] }), _jsx("div", { className: "text-xs text-gray-400", children: "Enjeu total" })] })), _jsxs("button", { onClick: handleAbandon, className: "btn-menu bg-red-600 hover:bg-red-700", children: [_jsx("i", { className: "fa fa-flag" }), gameMode === 'ai' ? 'Quitter' : 'Abandonner'] })] }));
}
