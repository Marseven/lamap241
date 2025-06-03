import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import logo from '../assets/logo.jpg';
export default function Card({ value, suit, hidden = false, clickable = false, selected = false, playable = false, onClick }) {
    // Détermine la couleur de la carte
    const getSuitColor = (suit) => {
        return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-black';
    };
    // Carte cachée (dos)
    if (hidden) {
        return (_jsx("div", { className: `card-hidden ${clickable ? 'cursor-pointer' : ''}`, onClick: clickable ? onClick : undefined, children: _jsx("div", { className: "w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-lg", children: _jsx("img", { src: logo, alt: "Logo", className: "w-full h-full object-contain" }) }) }));
    }
    // Carte face visible
    const colorClass = getSuitColor(suit);
    const cardClasses = [
        'card-face',
        colorClass,
        clickable ? 'cursor-pointer hover:scale-105' : '',
        selected ? 'card-selected' : '',
        playable ? 'card-playable' : '',
        'transition-all duration-200'
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: cardClasses, onClick: clickable ? onClick : undefined, children: [_jsxs("div", { className: "corner-top", children: [_jsx("div", { className: "font-bold", children: value }), _jsx("div", { children: suit })] }), _jsx("div", { className: "suit-center", children: suit }), _jsxs("div", { className: "corner-bottom", children: [_jsx("div", { className: "font-bold", children: value }), _jsx("div", { children: suit })] }), selected && (_jsx("div", { className: "absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold", children: "\u2713" }))] }));
}
