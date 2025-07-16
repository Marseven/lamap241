import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import WebSocketService from '../services/websocket';
/**
 * Hook pour gérer les WebSockets
 */
export function useWebSocket() {
    const { user } = useAuth();
    const isConnected = useRef(false);
    useEffect(() => {
        if (user && !isConnected.current) {
            // Connecter les WebSockets avec le token de l'utilisateur
            const token = localStorage.getItem('lamap_token');
            if (token) {
                WebSocketService.connect(token);
                isConnected.current = true;
            }
        }
        return () => {
            if (isConnected.current) {
                WebSocketService.disconnect();
                isConnected.current = false;
            }
        };
    }, [user]);
    return WebSocketService;
}
/**
 * Hook pour écouter les événements d'une salle
 */
export function useRoomWebSocket(roomCode, callbacks = {}) {
    const websocket = useWebSocket();
    const channelRef = useRef(null);
    useEffect(() => {
        if (roomCode && websocket.isConnected()) {
            // Rejoindre la salle
            channelRef.current = websocket.joinRoom(roomCode, callbacks);
            return () => {
                if (channelRef.current) {
                    websocket.leaveRoom(roomCode);
                    channelRef.current = null;
                }
            };
        }
    }, [roomCode, websocket]);
    return channelRef.current;
}
/**
 * Hook pour écouter les événements d'une partie
 */
export function useGameWebSocket(gameCode, callbacks = {}) {
    const websocket = useWebSocket();
    const channelRef = useRef(null);
    useEffect(() => {
        if (gameCode && websocket.isConnected()) {
            // Rejoindre la partie
            channelRef.current = websocket.joinGame(gameCode, callbacks);
            return () => {
                if (channelRef.current) {
                    websocket.leaveGame(gameCode);
                    channelRef.current = null;
                }
            };
        }
    }, [gameCode, websocket]);
    return channelRef.current;
}
