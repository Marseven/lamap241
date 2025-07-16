import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/GameRoomsPage.jsx - Version mise à jour avec notifications
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameRoom } from '../contexts/GameRoomContext';
import { useGameNotifications } from '../hooks/useGameNotifications';
import '../styles/exhibition.css';
export default function GameRoomsPage() {
    const { user } = useAuth();
    const { getAvailableRooms, getUserRooms, searchRooms, joinRoom, loading } = useGameRoom();
    const { notifyPlayerJoined, notifyGameStart, notifyRoomFull, notifyInsufficientFunds, notifyGameError } = useGameNotifications();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('available');
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [joinLoading, setJoinLoading] = useState(null);
    // Mettre à jour les salles filtrées
    useEffect(() => {
        if (searchQuery.trim()) {
            setFilteredRooms(searchRooms(searchQuery));
        }
        else {
            switch (activeTab) {
                case 'available':
                    setFilteredRooms(getAvailableRooms());
                    break;
                case 'my-rooms':
                    setFilteredRooms(getUserRooms());
                    break;
                default:
                    setFilteredRooms(getAvailableRooms());
            }
        }
    }, [searchQuery, activeTab, getAvailableRooms, getUserRooms, searchRooms]);
    const handleJoinRoom = async (room) => {
        setJoinLoading(room.id);
        try {
            // Vérifications avant de rejoindre
            if (room.players.length >= room.maxPlayers) {
                notifyRoomFull();
                return;
            }
            if (!room.isExhibition && room.bet > (user?.balance || 0)) {
                notifyInsufficientFunds(room.bet, user?.balance || 0);
                return;
            }
            if (room.players.includes(user?.pseudo)) {
                notifyGameError('Vous êtes déjà dans cette salle');
                return;
            }
            const result = await joinRoom(room.id);
            if (result.success) {
                notifyPlayerJoined(user.pseudo, result.room.name);
                if (result.room.status === 'playing') {
                    notifyGameStart(result.room.name);
                }
                navigate(`/game/${room.id}`);
            }
            else {
                notifyGameError(result.error);
            }
        }
        catch (error) {
            notifyGameError('Erreur lors de la connexion à la salle');
        }
        finally {
            setJoinLoading(null);
        }
    };
    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1)
            return 'À l\'instant';
        if (diffMins < 60)
            return `Il y a ${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24)
            return `Il y a ${diffHours}h`;
        return `Il y a ${Math.floor(diffHours / 24)}j`;
    };
    const getBetColor = (bet) => {
        if (bet <= 1000)
            return 'text-green-400';
        if (bet <= 5000)
            return 'text-yellow-400';
        return 'text-red-400';
    };
    const getRoomStatusBadge = (room) => {
        switch (room.status) {
            case 'waiting':
                return (_jsxs("span", { className: "status-badge waiting", children: ["\uD83D\uDFE1 En attente (", room.players.length, "/", room.maxPlayers, ")"] }));
            case 'playing':
                return (_jsx("span", { className: "status-badge playing", children: "\uD83D\uDFE2 En cours" }));
            case 'finished':
                return (_jsx("span", { className: "status-badge finished", children: "\u26AB Termin\u00E9e" }));
            default:
                return null;
        }
    };
    const canJoinRoom = (room) => {
        return room.status === 'waiting' &&
            !room.players.includes(user?.pseudo) &&
            room.players.length < room.maxPlayers &&
            (room.isExhibition || room.bet <= (user?.balance || 0));
    };
    return (_jsxs("div", { className: "game-rooms-page", children: [_jsxs("div", { className: "rooms-header", children: [_jsx(Link, { to: "/", className: "back-btn", children: "\u2190 Accueil" }), _jsx("h1", { className: "page-title", children: "\uD83C\uDFAE Salles de jeu" }), _jsx(Link, { to: "/create-room", className: "create-btn", children: "+ Cr\u00E9er" })] }), _jsx("div", { className: "search-bar", children: _jsxs("div", { className: "search-input-container", children: [_jsx("span", { className: "search-icon", children: "\uD83D\uDD0D" }), _jsx("input", { type: "text", placeholder: "Rechercher une salle ou un joueur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }), searchQuery && (_jsx("button", { onClick: () => setSearchQuery(''), className: "clear-search", children: "\u00D7" }))] }) }), _jsxs("div", { className: "rooms-tabs", children: [_jsxs("button", { onClick: () => setActiveTab('available'), className: `rooms-tab ${activeTab === 'available' ? 'active' : ''}`, children: [_jsx("span", { className: "tab-icon", children: "\uD83C\uDFAF" }), _jsx("span", { className: "tab-label", children: "Disponibles" }), _jsx("span", { className: "tab-count", children: getAvailableRooms().length })] }), _jsxs("button", { onClick: () => setActiveTab('my-rooms'), className: `rooms-tab ${activeTab === 'my-rooms' ? 'active' : ''}`, children: [_jsx("span", { className: "tab-icon", children: "\uD83D\uDC64" }), _jsx("span", { className: "tab-label", children: "Mes salles" }), _jsx("span", { className: "tab-count", children: getUserRooms().length })] })] }), _jsx("div", { className: "rooms-list", children: loading ? (_jsxs("div", { className: "loading-state", children: [_jsx("div", { className: "loading-spinner" }), _jsx("div", { children: "Chargement des salles..." })] })) : filteredRooms.length === 0 ? (_jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-icon", children: searchQuery ? '🔍' : activeTab === 'my-rooms' ? '👤' : '🎮' }), _jsx("div", { className: "empty-title", children: searchQuery ? 'Aucun résultat' :
                                activeTab === 'my-rooms' ? 'Aucune salle' : 'Aucune salle disponible' }), _jsx("div", { className: "empty-message", children: searchQuery ? 'Essayez avec d\'autres mots-clés' :
                                activeTab === 'my-rooms' ? 'Vous n\'avez pas encore créé de salle' :
                                    'Soyez le premier à créer une salle !' }), !searchQuery && (_jsx(Link, { to: "/create-room", className: "empty-action", children: _jsx("button", { className: "btn-primary", children: "Cr\u00E9er une salle" }) }))] })) : (filteredRooms.map(room => (_jsxs("div", { className: "room-card", children: [_jsxs("div", { className: "room-header", children: [_jsxs("div", { className: "room-info", children: [_jsx("h3", { className: "room-name", children: room.name }), _jsxs("div", { className: "room-creator", children: [_jsx("span", { className: "creator-icon", children: "\uD83D\uDC64" }), room.creator, room.isDemo && _jsx("span", { className: "demo-badge", children: "D\u00C9MO" }), room.isExhibition && _jsx("span", { className: "exhibition-badge", children: "\uD83C\uDFAE EXHIBITION" })] })] }), getRoomStatusBadge(room)] }), _jsxs("div", { className: "room-details", children: [room.isExhibition ? (_jsxs("div", { className: "room-exhibition", children: [_jsx("span", { className: "exhibition-icon", children: "\uD83C\uDFAE" }), _jsx("span", { className: "exhibition-text", children: "Partie gratuite - Sans mise" })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "room-bet", children: [_jsx("span", { className: "bet-icon", children: "\uD83D\uDCB0" }), _jsxs("span", { className: `bet-amount ${getBetColor(room.bet)}`, children: [new Intl.NumberFormat('fr-FR').format(room.bet), " FCFA"] })] }), _jsxs("div", { className: "room-pot", children: [_jsx("span", { className: "pot-icon", children: "\uD83C\uDFC6" }), _jsxs("span", { className: "pot-amount", children: ["Pot: ", new Intl.NumberFormat('fr-FR').format(room.pot || room.bet * 2), " FCFA"] })] })] })), _jsxs("div", { className: "room-time", children: [_jsx("span", { className: "time-icon", children: "\u23F0" }), _jsx("span", { className: "time-text", children: formatTimeAgo(room.createdAt) })] })] }), _jsx("div", { className: "room-players", children: _jsxs("div", { className: "players-list", children: [room.players.map((player, index) => (_jsxs("div", { className: "player-badge", children: [_jsx("span", { className: "player-avatar", children: player.charAt(0).toUpperCase() }), _jsx("span", { className: "player-name", children: player }), player === room.creator && (_jsx("span", { className: "creator-crown", children: "\uD83D\uDC51" }))] }, index))), Array.from({ length: room.maxPlayers - room.players.length }).map((_, index) => (_jsxs("div", { className: "player-badge empty", children: [_jsx("span", { className: "player-avatar empty", children: "?" }), _jsx("span", { className: "player-name", children: "En attente..." })] }, `empty-${index}`)))] }) }), _jsxs("div", { className: "room-actions", children: [canJoinRoom(room) && (_jsx("button", { onClick: () => handleJoinRoom(room), disabled: joinLoading === room.id, className: "join-btn", children: joinLoading === room.id ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "loading-spinner small" }), "Connexion..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "btn-icon", children: "\uD83C\uDFAE" }), "Rejoindre"] })) })), room.status === 'waiting' && !canJoinRoom(room) && !room.players.includes(user?.pseudo) && (_jsxs("button", { disabled: true, className: "join-btn", title: !room.isExhibition && room.bet > (user?.balance || 0)
                                        ? 'Solde insuffisant'
                                        : room.players.length >= room.maxPlayers
                                            ? 'Salle complète'
                                            : 'Non disponible', children: [_jsx("span", { className: "btn-icon", children: "\uD83D\uDCB8" }), !room.isExhibition && room.bet > (user?.balance || 0)
                                            ? 'Solde insuffisant'
                                            : room.players.length >= room.maxPlayers
                                                ? 'Salle complète'
                                                : 'Non disponible'] })), room.players.includes(user?.pseudo) && (_jsxs(Link, { to: `/game/${room.id}`, className: "continue-btn", children: [_jsx("span", { className: "btn-icon", children: "\uD83C\uDFAF" }), room.status === 'playing' ? 'Continuer' : 'Entrer'] })), room.status === 'finished' && (_jsxs("div", { className: "finished-info", children: [_jsx("span", { className: "winner-icon", children: "\uD83C\uDFC6" }), "Gagnant: ", room.winner] }))] }), _jsxs("div", { className: "room-quick-info", children: [_jsxs("div", { className: "quick-info-item", children: [_jsx("span", { className: "info-icon", children: "\u23F1\uFE0F" }), _jsx("span", { className: "info-text", children: room.gameSettings?.timeLimit ?
                                                `${Math.floor(room.gameSettings.timeLimit / 60)} min` :
                                                'Pas de limite' })] }), _jsxs("div", { className: "quick-info-item", children: [_jsx("span", { className: "info-icon", children: "\uD83C\uDFAF" }), _jsxs("span", { className: "info-text", children: ["Premier \u00E0 ", room.gameSettings?.roundsToWin || 3] })] }), _jsxs("div", { className: "quick-info-item", children: [_jsx("span", { className: "info-icon", children: "\uD83D\uDC65" }), _jsx("span", { className: "info-text", children: room.gameSettings?.allowSpectators ? 'Spectateurs OK' : 'Privée' })] })] })] }, room.id)))) }), _jsx(Link, { to: "/create-room", className: "floating-create-btn", children: _jsx("span", { className: "fab-icon", children: "+" }) })] }));
}
