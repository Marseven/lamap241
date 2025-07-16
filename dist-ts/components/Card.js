import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import logo from '../assets/logo.jpg';
export default function Card({ value, suit, hidden = false, clickable = false, selected = false, playable = false, onClick, size = 'normal' // 'normal' ou 'small'
 }) {
    // Détermine la couleur de la carte
    const getSuitColor = (suit) => {
        return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-black';
    };
    // Carte cachée (dos)
    if (hidden) {
        return (_jsx("div", { className: `card-hidden ${clickable ? 'cursor-pointer' : ''} ${size === 'small' ? 'w-12 h-16' : ''}`, onClick: clickable ? onClick : undefined, children: _jsx("div", { className: `bg-white rounded-full flex items-center justify-center text-red-600 font-bold ${size === 'small' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-lg'}`, children: _jsx("img", { src: logo, alt: "Logo", className: "w-full h-full" }) }) }));
    }
    // Carte face visible
    const colorClass = getSuitColor(suit);
    const cardClasses = [
        'card-face',
        colorClass,
        clickable ? 'cursor-pointer hover:scale-105' : '',
        selected ? 'card-selected' : '',
        playable ? 'card-playable' : '',
        'transition-all duration-200',
        size === 'small' ? 'w-12 h-16 text-xs' : ''
    ].filter(Boolean).join(' ');
    return (_jsxs("div", { className: cardClasses, onClick: clickable ? onClick : undefined, children: [_jsxs("div", { className: `corner-top ${size === 'small' ? 'text-xs' : ''}`, children: [_jsx("div", { className: "font-bold", children: value }), _jsx("div", { children: suit })] }), _jsx("div", { className: `suit-center ${size === 'small' ? 'text-lg' : ''}`, children: suit }), _jsxs("div", { className: `corner-bottom ${size === 'small' ? 'text-xs' : ''}`, children: [_jsx("div", { className: "font-bold", children: value }), _jsx("div", { children: suit })] }), selected && (_jsx("div", { className: `absolute bg-red-600 rounded-full flex items-center justify-center text-white font-bold ${size === 'small' ? '-top-1 -right-1 w-4 h-4 text-xs' : '-top-2 -right-2 w-6 h-6 text-xs'}`, children: "\u2713" })), playable && (_jsx("div", { className: "absolute inset-0 border-2 border-green-400 rounded-lg animate-pulse pointer-events-none" }))] }));
}
