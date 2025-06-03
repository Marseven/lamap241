import React from 'react';
import logo from '../assets/logo.png'; // logo visible quand la carte est cachée

export default function Card({ value, suit, hidden = false }) {
  // ♥ (coeur) et ♦ (carreau) sont rouges, ♠ (pique) et ♣ (trèfle) sont noirs
  const getSuitColor = (suit) => {
    return suit === '♥' || suit === '♦' ? 'red' : 'black';
  };

  if (hidden) {
    return (
      <div className="card-hidden">
        <img src={logo} alt="LaMap Logo" />
      </div>
    );
  }

  const colorClass = getSuitColor(suit) === 'red' ? 'text-danger' : 'text-dark';

  return (
    <div className={`card-face ${colorClass}`}>
      <div className="corner-top">
        {value}
        {suit}
      </div>
      <div className="suit-center">{suit}</div>
      <div className="corner-bottom">
        {value}
        {suit}
      </div>
    </div>
  );
}