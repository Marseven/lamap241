import React from 'react';

export default function PlayerInfo({ 
  name, 
  score, 
  isCurrentPlayer = false, 
  cardCount = 0,
  isAI = false 
}) {
  return (
    <div className={`text-center p-3 rounded-lg border-2 transition-all ${
      isCurrentPlayer 
        ? 'border-red-500 bg-red-900 bg-opacity-30' 
        : 'border-gray-600 bg-gray-800'
    }`}>
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-lg">{isAI ? '🤖' : '👤'}</span>
        <span className="font-bold">{name}</span>
        {isCurrentPlayer && (
          <span className="text-xs bg-red-600 px-2 py-1 rounded-full animate-pulse">
            En jeu
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-2xl font-bold text-yellow-400">{score}</div>
          <div className="text-xs text-gray-400">Manches</div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-400">{cardCount}</div>
          <div className="text-xs text-gray-400">Cartes</div>
        </div>
      </div>
    </div>
  );
}