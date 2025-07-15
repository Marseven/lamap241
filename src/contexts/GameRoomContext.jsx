import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';
import api from '../services/api';

const GameRoomContext = createContext();

export const useGameRoom = () => {
  const context = useContext(GameRoomContext);
  if (!context) {
    throw new Error('useGameRoom must be used within a GameRoomProvider');
  }
  return context;
};

export const GameRoomProvider = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const { refreshWallet } = useWallet();
  
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger les salles depuis l'API
  useEffect(() => {
    if (user) {
      loadRooms();
    } else {
      setRooms([]);
      setCurrentRoom(null);
    }
  }, [user]);

  // Charger les salles disponibles
  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await api.getRooms();
      setRooms(response.rooms || []);
    } catch (error) {
      console.error('Erreur lors du chargement des salles:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle salle
  const createRoom = async (roomData) => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    setLoading(true);
    
    try {
      // Validation côté client (seulement pour les parties non-exhibition)
      if (!roomData.isExhibition && roomData.bet < 500) throw new Error('Mise minimum : 500 FCFA');
      if (!roomData.isExhibition && roomData.bet > user.balance) throw new Error('Solde insuffisant');
      if (!roomData.name || roomData.name.trim().length < 3) {
        throw new Error('Nom de partie trop court (minimum 3 caractères)');
      }

      const response = await api.createRoom(roomData);
      
      if (response.room) {
        const newRoom = response.room;
        
        // Ajouter la salle à la liste locale
        setRooms(prev => [newRoom, ...prev]);
        setCurrentRoom(newRoom);

        // Rafraîchir le solde utilisateur
        await refreshUser();

        return { success: true, room: newRoom };
      } else {
        return { success: false, error: response.message || 'Erreur inconnue' };
      }
    } catch (error) {
      console.error('Erreur création salle:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Rejoindre une salle
  const joinRoom = async (roomCode) => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    setLoading(true);
    
    try {
      const response = await api.joinRoom(roomCode);
      
      if (response.room) {
        const updatedRoom = response.room;
        
        // Mettre à jour la salle dans la liste locale
        setRooms(prev => prev.map(r => 
          r.code === roomCode ? updatedRoom : r
        ));
        setCurrentRoom(updatedRoom);

        // Rafraîchir le solde utilisateur
        await refreshUser();

        return { success: true, room: updatedRoom };
      } else {
        return { success: false, error: response.message || 'Erreur inconnue' };
      }
    } catch (error) {
      console.error('Erreur rejoindre salle:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Quitter une salle
  const leaveRoom = async (roomCode) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const response = await api.leaveRoom(roomCode);
      
      // Retirer la salle de la liste ou mettre à jour son statut
      setRooms(prev => prev.filter(r => r.code !== roomCode));
      
      if (currentRoom && currentRoom.code === roomCode) {
        setCurrentRoom(null);
      }

      // Rafraîchir le solde utilisateur (en cas de remboursement)
      await refreshUser();

      return { success: true };
    } catch (error) {
      console.error('Erreur quitter salle:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Marquer comme prêt
  const markReady = async (roomCode) => {
    if (!user) return;
    
    try {
      const response = await api.request(`/rooms/${roomCode}/ready`, {
        method: 'POST'
      });
      
      if (response.room) {
        const updatedRoom = response.room;
        
        // Mettre à jour la salle
        setRooms(prev => prev.map(r => 
          r.code === roomCode ? updatedRoom : r
        ));
        setCurrentRoom(updatedRoom);

        return { 
          success: true, 
          room: updatedRoom,
          gameStarted: !!response.game_id,
          gameId: response.game_id
        };
      }

      return { success: false, error: response.message };
    } catch (error) {
      console.error('Erreur marquer prêt:', error);
      return { success: false, error: error.message };
    }
  };

  // Obtenir les détails d'une salle
  const getRoomDetails = async (roomCode) => {
    try {
      const response = await api.getRoom(roomCode);
      return response.room;
    } catch (error) {
      console.error('Erreur détails salle:', error);
      return null;
    }
  };

  // Terminer une partie (pour compatibilité avec l'ancien code)
  const finishGame = async (roomCode, winnerId) => {
    // Cette logique sera gérée côté backend
    // On rafraîchit juste les données
    await Promise.all([
      loadRooms(),
      refreshUser(),
      refreshWallet()
    ]);

    return { success: true };
  };

  // Obtenir les salles disponibles
  const getAvailableRooms = () => {
    return rooms.filter(room => 
      room.status === 'waiting' && 
      room.current_players < room.max_players &&
      (!user || !room.players.some(p => p.id === user.id))
    );
  };

  // Obtenir les salles de l'utilisateur
  const getUserRooms = () => {
    if (!user) return [];
    return rooms.filter(room => 
      room.players.some(p => p.id === user.id) &&
      room.status !== 'finished'
    );
  };

  // Rechercher des salles
  const searchRooms = (query) => {
    if (!query.trim()) return rooms;
    
    const searchTerm = query.toLowerCase();
    return rooms.filter(room => 
      room.name.toLowerCase().includes(searchTerm) ||
      room.creator.pseudo.toLowerCase().includes(searchTerm)
    );
  };

  // Rafraîchir les données
  const refreshRooms = async () => {
    await loadRooms();
  };

  // Obtenir le statut d'une salle en temps réel
  const pollRoomStatus = async (roomCode, callback) => {
    const pollInterval = setInterval(async () => {
      try {
        const roomDetails = await getRoomDetails(roomCode);
        if (roomDetails) {
          callback(roomDetails);
          
          // Mettre à jour la salle locale
          setRooms(prev => prev.map(r => 
            r.code === roomCode ? roomDetails : r
          ));
          
          if (currentRoom && currentRoom.code === roomCode) {
            setCurrentRoom(roomDetails);
          }
        }
      } catch (error) {
        console.error('Erreur poll salle:', error);
      }
    }, 3000); // Poll toutes les 3 secondes

    return () => clearInterval(pollInterval);
  };

  // Formatage des données pour l'affichage
  const formatRoomForDisplay = (room) => {
    return {
      id: room.code, // Utiliser le code comme ID pour la compatibilité
      code: room.code,
      name: room.name,
      creator: room.creator.pseudo,
      creatorId: room.creator.id,
      bet: room.bet_amount,
      status: room.status,
      players: room.players.map(p => p.pseudo),
      playerIds: room.players.map(p => p.id),
      maxPlayers: room.max_players,
      createdAt: room.created_at,
      pot: room.pot_amount,
      commission: room.commission_amount,
      gameSettings: {
        roundsToWin: room.rounds_to_win,
        timeLimit: room.time_limit,
        allowSpectators: room.allow_spectators
      },
      isDemo: false // Les vraies salles ne sont jamais des démos
    };
  };

  // Convertir les salles pour la compatibilité avec l'ancien code
  const formattedRooms = rooms.map(formatRoomForDisplay);
  const formattedCurrentRoom = currentRoom ? formatRoomForDisplay(currentRoom) : null;

  const value = {
    rooms: formattedRooms,
    currentRoom: formattedCurrentRoom,
    loading,
    createRoom,
    joinRoom,
    leaveRoom,
    markReady,
    finishGame,
    getAvailableRooms: () => getAvailableRooms().map(formatRoomForDisplay),
    getUserRooms: () => getUserRooms().map(formatRoomForDisplay),
    searchRooms: (query) => searchRooms(query).map(formatRoomForDisplay),
    getRoomDetails,
    refreshRooms,
    pollRoomStatus,
    setCurrentRoom: (room) => setCurrentRoom(room)
  };

  return (
    <GameRoomContext.Provider value={value}>
      {children}
    </GameRoomContext.Provider>
  );
};