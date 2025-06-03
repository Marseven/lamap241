import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';
const GameRoomContext = createContext();
export const useGameRoom = () => {
    const context = useContext(GameRoomContext);
    if (!context) {
        throw new Error('useGameRoom must be used within a GameRoomProvider');
    }
    return context;
};
export const GameRoomProvider = ({ children }) => {
    const { user } = useAuth();
    const { deductGameBet, addGameWinnings } = useWallet();
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    // Charger les salles depuis localStorage (simulation)
    useEffect(() => {
        const savedRooms = localStorage.getItem('lamap_game_rooms');
        let validRooms = [];
        if (savedRooms) {
            try {
                const parsedRooms = JSON.parse(savedRooms);
                // Filtrer les salles expirées (plus de 1 heure)
                validRooms = parsedRooms.filter(room => {
                    const roomAge = Date.now() - new Date(room.createdAt).getTime();
                    return roomAge < 3600000; // 1 heure
                });
                setRooms(validRooms);
            }
            catch (error) {
                console.error('Erreur lors du chargement des salles:', error);
            }
        }
        // Ajouter quelques salles démo
        const demoRooms = [
            {
                id: 'demo1',
                name: 'Partie rapide 500F',
                creator: 'Alpha_241',
                bet: 500,
                status: 'waiting',
                players: ['Alpha_241'],
                maxPlayers: 2,
                createdAt: new Date().toISOString(),
                isDemo: true
            },
            {
                id: 'demo2',
                name: 'Challenge 2000F',
                creator: 'Beta_GBN',
                bet: 2000,
                status: 'waiting',
                players: ['Beta_GBN'],
                maxPlayers: 2,
                createdAt: new Date().toISOString(),
                isDemo: true
            },
            {
                id: 'demo3',
                name: 'Tournoi 5000F',
                creator: 'Gamma_LOL',
                bet: 5000,
                status: 'waiting',
                players: ['Gamma_LOL'],
                maxPlayers: 2,
                createdAt: new Date().toISOString(),
                isDemo: true
            }
        ];
        if (validRooms.length === 0) {
            setRooms(demoRooms);
        }
    }, []);
    // Sauvegarder les salles dans localStorage
    useEffect(() => {
        if (rooms.length > 0) {
            const realRooms = rooms.filter(room => !room.isDemo);
            localStorage.setItem('lamap_game_rooms', JSON.stringify(realRooms));
        }
    }, [rooms]);
    // Créer une nouvelle salle
    const createRoom = async (roomData) => {
        if (!user)
            throw new Error('Utilisateur non connecté');
        setLoading(true);
        try {
            // Validation
            if (roomData.bet < 500)
                throw new Error('Mise minimum : 500 FCFA');
            if (roomData.bet > user.balance)
                throw new Error('Solde insuffisant');
            if (!roomData.name || roomData.name.trim().length < 3) {
                throw new Error('Nom de partie trop court (minimum 3 caractères)');
            }
            // Déduire la mise immédiatement
            const betResult = deductGameBet(roomData.bet, 'multiplayer');
            if (!betResult)
                throw new Error('Impossible de déduire la mise');
            // Créer la salle
            const newRoom = {
                id: Math.random().toString(36).substring(2, 9),
                name: roomData.name.trim(),
                creator: user.pseudo,
                creatorId: user.id,
                bet: roomData.bet,
                status: 'waiting',
                players: [user.pseudo],
                playerIds: [user.id],
                maxPlayers: 2,
                createdAt: new Date().toISOString(),
                gameSettings: {
                    roundsToWin: 3,
                    timeLimit: roomData.timeLimit || 300, // 5 minutes par défaut
                    allowSpectators: roomData.allowSpectators || false
                },
                pot: roomData.bet,
                commission: Math.round(roomData.bet * 2 * 0.1), // 10% de commission
                isDemo: false
            };
            setRooms(prev => [newRoom, ...prev]);
            setCurrentRoom(newRoom);
            // Simuler la latence réseau
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, room: newRoom };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
        finally {
            setLoading(false);
        }
    };
    // Rejoindre une salle
    const joinRoom = async (roomId) => {
        if (!user)
            throw new Error('Utilisateur non connecté');
        setLoading(true);
        try {
            const room = rooms.find(r => r.id === roomId);
            if (!room)
                throw new Error('Salle introuvable');
            if (room.status !== 'waiting')
                throw new Error('Salle non disponible');
            if (room.players.includes(user.pseudo))
                throw new Error('Vous êtes déjà dans cette salle');
            if (room.players.length >= room.maxPlayers)
                throw new Error('Salle complète');
            if (room.bet > user.balance)
                throw new Error('Solde insuffisant');
            // Déduire la mise
            const betResult = deductGameBet(room.bet, 'multiplayer');
            if (!betResult)
                throw new Error('Impossible de déduire la mise');
            // Mettre à jour la salle
            const updatedRoom = {
                ...room,
                players: [...room.players, user.pseudo],
                playerIds: [...room.playerIds, user.id],
                status: room.players.length + 1 >= room.maxPlayers ? 'playing' : 'waiting',
                pot: room.pot + room.bet,
                joinedAt: new Date().toISOString()
            };
            setRooms(prev => prev.map(r => r.id === roomId ? updatedRoom : r));
            setCurrentRoom(updatedRoom);
            // Simuler la latence réseau
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, room: updatedRoom };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
        finally {
            setLoading(false);
        }
    };
    // Quitter une salle
    const leaveRoom = async (roomId) => {
        if (!user)
            return;
        setLoading(true);
        try {
            const room = rooms.find(r => r.id === roomId);
            if (!room || !room.players.includes(user.pseudo))
                return;
            if (room.status === 'playing') {
                // En cours de partie = abandon (perte de la mise)
                setRooms(prev => prev.map(r => r.id === roomId
                    ? { ...r, status: 'finished', winner: room.players.find(p => p !== user.pseudo) }
                    : r));
            }
            else {
                // En attente = remboursement possible
                // TODO: Logique de remboursement ici
                if (room.creator === user.pseudo) {
                    // Créateur quitte = suppression de la salle
                    setRooms(prev => prev.filter(r => r.id !== roomId));
                }
                else {
                    // Joueur quitte = retrait de la salle
                    setRooms(prev => prev.map(r => r.id === roomId
                        ? {
                            ...r,
                            players: r.players.filter(p => p !== user.pseudo),
                            playerIds: r.playerIds.filter(id => id !== user.id),
                            pot: r.pot - r.bet
                        }
                        : r));
                }
            }
            setCurrentRoom(null);
            await new Promise(resolve => setTimeout(resolve, 300));
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
        finally {
            setLoading(false);
        }
    };
    // Terminer une partie
    const finishGame = async (roomId, winnerId) => {
        if (!user)
            return;
        try {
            const room = rooms.find(r => r.id === roomId);
            if (!room)
                return;
            const winner = room.playerIds.indexOf(winnerId) !== -1
                ? room.players[room.playerIds.indexOf(winnerId)]
                : null;
            // Calculer les gains (90% du pot pour le gagnant)
            const winnings = Math.floor(room.pot * 0.9);
            // Mettre à jour la salle
            const finishedRoom = {
                ...room,
                status: 'finished',
                winner: winner,
                winnerId: winnerId,
                winnings: winnings,
                finishedAt: new Date().toISOString()
            };
            setRooms(prev => prev.map(r => r.id === roomId ? finishedRoom : r));
            // Ajouter les gains au gagnant
            if (winnerId === user.id) {
                addGameWinnings(winnings, 'multiplayer');
            }
            // Nettoyer les salles terminées après 5 minutes
            setTimeout(() => {
                setRooms(prev => prev.filter(r => r.id !== roomId));
            }, 300000);
            return { success: true, room: finishedRoom };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    };
    // Obtenir les salles disponibles (filtrer les démonstrations si nécessaire)
    const getAvailableRooms = () => {
        return rooms.filter(room => room.status === 'waiting' &&
            room.players.length < room.maxPlayers &&
            (!user || !room.players.includes(user.pseudo)));
    };
    // Obtenir les salles de l'utilisateur
    const getUserRooms = () => {
        if (!user)
            return [];
        return rooms.filter(room => room.players.includes(user.pseudo) &&
            room.status !== 'finished');
    };
    // Rechercher des salles
    const searchRooms = (query) => {
        const searchTerm = query.toLowerCase();
        return rooms.filter(room => room.name.toLowerCase().includes(searchTerm) ||
            room.creator.toLowerCase().includes(searchTerm));
    };
    const value = {
        rooms,
        currentRoom,
        loading,
        createRoom,
        joinRoom,
        leaveRoom,
        finishGame,
        getAvailableRooms,
        getUserRooms,
        searchRooms,
        setCurrentRoom
    };
    return (_jsx(GameRoomContext.Provider, { value: value, children: children }));
};
