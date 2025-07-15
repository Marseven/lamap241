import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRoomWebSocket } from '../hooks/useWebSocket';
import { useNavigate } from 'react-router-dom';

export default function WaitingRoom({ roomInfo, gameId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState(roomInfo?.players || []);
  const [roomStatus, setRoomStatus] = useState(roomInfo?.status || 'waiting');

  // WebSocket pour les mises à jour de la salle
  const roomChannel = useRoomWebSocket(gameId, {
    onPlayerJoined: (event) => {
      console.log('🎮 Nouveau joueur:', event);
      setPlayers(prev => [...prev, event.player]);
    },
    onUserJoining: (newUser) => {
      console.log('➕ Utilisateur rejoint:', newUser);
      setPlayers(prev => {
        if (!prev.find(p => p.id === newUser.id)) {
          return [...prev, newUser];
        }
        return prev;
      });
    },
    onUserLeaving: (leftUser) => {
      console.log('➖ Utilisateur parti:', leftUser);
      setPlayers(prev => prev.filter(p => p.id !== leftUser.id));
    },
    onGameStarted: (event) => {
      console.log('🚀 Partie commencée:', event);
      setRoomStatus('in_progress');
      // Recharger la page pour commencer la partie
      window.location.reload();
    }
  });

  const handleLeaveRoom = () => {
    navigate('/rooms');
  };

  const currentPlayerCount = players.length;
  const maxPlayers = roomInfo?.max_players || 2;
  const isRoomFull = currentPlayerCount >= maxPlayers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⏳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {roomInfo?.name || 'Salle de jeu'}
          </h1>
          <p className="text-gray-600">
            {roomInfo?.is_exhibition ? 'Partie d\'exhibition' : `Mise: ${roomInfo?.bet_amount || 0} FCFA`}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Joueurs ({currentPlayerCount}/{maxPlayers})
            </h2>
            <div className="text-sm text-gray-500">
              Code: {gameId}
            </div>
          </div>

          <div className="space-y-3">
            {players.map((player, index) => (
              <div
                key={player.id || index}
                className={`flex items-center p-3 rounded-lg border-2 ${
                  player.id === user?.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  {(player.pseudo || player.name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    {player.pseudo || player.name || 'Joueur'}
                  </div>
                  {player.id === user?.id && (
                    <div className="text-xs text-blue-600">C'est vous</div>
                  )}
                </div>
                <div className="text-green-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}

            {/* Emplacements vides */}
            {Array.from({ length: maxPlayers - currentPlayerCount }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex items-center p-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm mr-3">
                  ?
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-500">
                    En attente d'un joueur...
                  </div>
                </div>
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center text-gray-600">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>En attente d'autres joueurs...</span>
          </div>

          <div className="text-sm text-gray-500">
            {isRoomFull
              ? 'La partie va bientôt commencer !'
              : `Besoin de ${maxPlayers - currentPlayerCount} joueur(s) supplémentaire(s)`}
          </div>

          <button
            onClick={handleLeaveRoom}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Quitter la salle
          </button>
        </div>
      </div>
    </div>
  );
}