import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import LoadingSpinner from './LoadingSpinner';
const RoomJoinLoading = ({ roomCode = null, roomName = null, playerCount = 0, maxPlayers = 4, status = "joining" }) => {
    const getStatusMessage = () => {
        switch (status) {
            case 'joining':
                return 'Connexion à la salle...';
            case 'waiting':
                return 'En attente d\'autres joueurs...';
            case 'starting':
                return 'Démarrage de la partie...';
            case 'loading':
                return 'Chargement du jeu...';
            default:
                return 'Chargement...';
        }
    };
    const getStatusIcon = () => {
        switch (status) {
            case 'joining':
                return '🚪';
            case 'waiting':
                return '⏰';
            case 'starting':
                return '🚀';
            case 'loading':
                return '🎮';
            default:
                return '⏳';
        }
    };
    const getSubtitle = () => {
        if (roomName && status === 'joining') {
            return `Rejoindre "${roomName}"`;
        }
        if (status === 'waiting') {
            return `${playerCount}/${maxPlayers} joueurs connectés`;
        }
        if (status === 'starting') {
            return 'Tous les joueurs sont prêts !';
        }
        return 'Veuillez patienter...';
    };
    return (_jsx("div", { className: "mobile-container neon-theme", children: _jsxs("div", { style: {
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
            }, children: [_jsx("div", { style: { marginBottom: '2rem' }, children: _jsx("img", { src: "/logo.png", alt: "La Map 241", style: {
                            width: '100px',
                            height: 'auto',
                            opacity: 0.9,
                        } }) }), roomCode && (_jsxs("div", { style: {
                        background: '#111',
                        border: '1px solid var(--lamap-red)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '2rem',
                        width: '100%',
                        maxWidth: '300px',
                    }, children: [_jsxs("div", { style: {
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                color: 'var(--lamap-white)',
                                marginBottom: '0.5rem',
                            }, children: ["Salle ", roomCode] }), roomName && (_jsx("div", { style: {
                                fontSize: '0.9rem',
                                color: '#888',
                            }, children: roomName }))] })), _jsx("div", { style: {
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        animation: status === 'waiting' ? 'pulse 2s infinite' : 'none',
                    }, children: getStatusIcon() }), _jsx(LoadingSpinner, { size: "large", color: "primary" }), _jsx("div", { style: {
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'var(--lamap-white)',
                        marginTop: '2rem',
                    }, children: getStatusMessage() }), _jsx("div", { style: {
                        fontSize: '0.9rem',
                        color: '#888',
                        marginTop: '0.5rem',
                        fontStyle: 'italic',
                    }, children: getSubtitle() }), status === 'waiting' && (_jsx("div", { style: {
                        width: '200px',
                        height: '4px',
                        backgroundColor: '#333',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        marginTop: '2rem',
                    }, children: _jsx("div", { style: {
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--lamap-red), #a32222)',
                            borderRadius: '2px',
                            width: `${(playerCount / maxPlayers) * 100}%`,
                            transition: 'width 0.5s ease',
                            boxShadow: '0 0 10px rgba(198, 40, 40, 0.5)',
                        } }) })), status === 'waiting' && (_jsx("div", { style: {
                        display: 'flex',
                        gap: '0.5rem',
                        marginTop: '2rem',
                    }, children: [...Array(maxPlayers)].map((_, index) => (_jsx("div", { style: {
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: index < playerCount
                                ? 'linear-gradient(135deg, var(--lamap-red), #a32222)'
                                : '#333',
                            border: index < playerCount
                                ? '2px solid var(--lamap-red)'
                                : '1px solid #666',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            transition: 'all 0.3s ease',
                            boxShadow: index < playerCount
                                ? '0 0 10px rgba(198, 40, 40, 0.3)'
                                : 'none',
                        }, children: index < playerCount ? '👤' : '⚬' }, index))) })), _jsx("div", { style: {
                        fontSize: '0.8rem',
                        color: '#666',
                        marginTop: '3rem',
                        fontStyle: 'italic',
                        maxWidth: '300px',
                        lineHeight: '1.4',
                    }, children: status === 'waiting' ?
                        '💡 Astuce : Préparez votre stratégie pendant que les autres joueurs se connectent !' :
                        '🎯 La partie va bientôt commencer...' }), _jsx("style", { jsx: true, children: `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        ` })] }) }));
};
export default RoomJoinLoading;
