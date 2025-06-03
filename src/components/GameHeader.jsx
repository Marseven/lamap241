import React from 'react';
import { Link } from 'react-router-dom';

export default function GameHeader({ 
  gameMode = 'ai', 
  pot = 0, 
  onAbandon,
  showPot = false 
}) {
  
  const handleAbandon = () => {
    const confirmMessage = gameMode === 'ai' 
      ? 'Abandonner la partie contre l\'IA ?' 
      : `Abandonner la partie ? Tu perdras ta mise de ${pot} FCFA !`;
      
    if (window.confirm(confirmMessage)) {
      onAbandon();
    }
  };

  return (
    <div className="game-header">
      <Link to="/" className="btn-menu">
        <i className="fa fa-home"></i> Accueil
      </Link>
      
      {showPot && pot > 0 && (
        <div className="text-center">
          <div className="text-yellow-400 font-bold text-lg">💰 {pot} FCFA</div>
          <div className="text-xs text-gray-400">Enjeu total</div>
        </div>
      )}
      
      <button onClick={handleAbandon} className="btn-menu bg-red-600 hover:bg-red-700">
        <i className="fa fa-flag"></i> 
        {gameMode === 'ai' ? 'Quitter' : 'Abandonner'}
      </button>
    </div>
  );
}