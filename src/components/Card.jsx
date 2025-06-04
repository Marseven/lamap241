import React from 'react';
import logo from '../assets/logo.jpg'; 

export default function Card({ 
  value, 
  suit, 
  hidden = false, 
  clickable = false, 
  selected = false, 
  playable = false,
  onClick 
}) {
  // Détermine la couleur de la carte
  const getSuitColor = (suit) => {
    return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-black';
  };

  // Carte cachée (dos)
  if (hidden) {
    return (
      <div 
        className={`card-hidden ${clickable ? 'cursor-pointer' : ''}`}
        onClick={clickable ? onClick : undefined}
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-lg">
          <img src={logo} alt="Logo" className="w-full h-full" />
        </div>
      </div>
    );
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

  return (
    <div 
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
    >
      <div className="corner-top">
        <div className="font-bold">{value}</div>
        <div>{suit}</div>
      </div>
      
      <div className="suit-center">
        {suit}
      </div>
      
      <div className="corner-bottom">
        <div className="font-bold">{value}</div>
        <div>{suit}</div>
      </div>

      {/* Indicateur de sélection */}
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          ✓
        </div>
      )}
    </div>
  );
}