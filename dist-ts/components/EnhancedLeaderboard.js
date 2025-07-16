import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import useGameStore from '../stores/gameStore';
import LoadingPage from './LoadingPage';
const EnhancedLeaderboard = () => {
    const { allLeaderboards, globalStats, statsLoading, statsError, fetchAllLeaderboards, fetchGlobalStats } = useGameStore();
    const [activeLeaderboard, setActiveLeaderboard] = useState('winnings');
    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    fetchAllLeaderboards(),
                    fetchGlobalStats()
                ]);
            }
            catch (error) {
                console.error('Erreur lors du chargement des leaderboards:', error);
            }
        };
        loadData();
    }, [fetchAllLeaderboards, fetchGlobalStats]);
    const leaderboardTypes = [
        { id: 'winnings', name: 'Gains', description: 'Classement par gains totaux' },
        { id: 'winrate', name: 'Taux de victoire', description: 'Classement par pourcentage de victoires' },
        { id: 'volume', name: 'Volume', description: 'Classement par nombre de parties' },
        { id: 'streak', name: 'Séries', description: 'Classement par meilleure série' },
        { id: 'achievements', name: 'Achievements', description: 'Classement par points d\'achievements' },
        { id: 'weekly', name: 'Hebdomadaire', description: 'Classement de la semaine' }
    ];
    const formatValue = (value, type) => {
        switch (type) {
            case 'winnings':
                return `${value.toLocaleString()} FCFA`;
            case 'winrate':
                return `${value.toFixed(1)}%`;
            case 'volume':
                return `${value} parties`;
            case 'streak':
                return `${value} victoires`;
            case 'achievements':
                return `${value} points`;
            case 'weekly':
                return `${value.toLocaleString()} FCFA`;
            default:
                return value;
        }
    };
    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return `#${rank}`;
        }
    };
    if (statsLoading) {
        return (_jsx(LoadingPage, { title: "Chargement des classements...", subtitle: "R\u00E9cup\u00E9ration des donn\u00E9es de performance", showLogo: true }));
    }
    if (statsError) {
        return (_jsx("div", { className: "mobile-container neon-theme", children: _jsxs("div", { style: {
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '2rem',
                }, children: [_jsx("div", { style: { fontSize: '4rem', marginBottom: '1rem' }, children: "\uD83C\uDFC6" }), _jsx("div", { style: { fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)', marginBottom: '1rem' }, children: "Erreur de chargement des classements" }), _jsx("div", { style: { fontSize: '0.9rem', color: '#888', marginBottom: '2rem' }, children: statsError }), _jsx("button", { onClick: () => window.location.reload(), style: {
                            background: 'linear-gradient(135deg, var(--lamap-red), #a32222)',
                            color: 'var(--lamap-white)',
                            border: '2px solid var(--lamap-red)',
                            borderRadius: '12px',
                            padding: '12px 24px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(198, 40, 40, 0.3)',
                        }, children: "\uD83D\uDD04 R\u00E9essayer" })] }) }));
    }
    const currentLeaderboard = Array.isArray(allLeaderboards?.[activeLeaderboard])
        ? allLeaderboards[activeLeaderboard]
        : [];
    return (_jsxs("div", { className: "mobile-container neon-theme", children: [_jsxs("div", { className: "lamap-section", children: [_jsx("h1", { style: { fontSize: '2rem', fontWeight: 'bold', color: 'var(--lamap-white)', textAlign: 'center', marginBottom: '1rem' }, children: "\uD83C\uDFC6 Classements" }), _jsx("p", { style: { color: '#888', textAlign: 'center', marginBottom: '2rem' }, children: "D\u00E9couvrez les meilleurs joueurs de La Map 241" })] }), _jsxs("div", { className: "stats-row", style: { gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }, children: [_jsxs("div", { style: { textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }, children: [_jsx("h3", { style: { fontSize: '0.9rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }, children: "Joueurs actifs" }), _jsx("p", { style: { fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)' }, children: globalStats?.total_players || 0 })] }), _jsxs("div", { style: { textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }, children: [_jsx("h3", { style: { fontSize: '0.9rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }, children: "Parties jou\u00E9es" }), _jsx("p", { style: { fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)' }, children: (globalStats?.total_games || 0).toLocaleString() })] }), _jsxs("div", { style: { textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }, children: [_jsx("h3", { style: { fontSize: '0.9rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }, children: "Gains distribu\u00E9s" }), _jsxs("p", { style: { fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)' }, children: [(globalStats?.total_winnings || 0).toLocaleString(), " FCFA"] })] }), _jsxs("div", { style: { textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }, children: [_jsx("h3", { style: { fontSize: '0.9rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }, children: "Achievements" }), _jsx("p", { style: { fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)' }, children: globalStats?.total_achievements || 0 })] })] }), _jsx("div", { className: "lamap-section", children: _jsx("div", { style: { display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1rem' }, children: leaderboardTypes.map((type) => (_jsx("button", { onClick: () => setActiveLeaderboard(type.id), className: "btn-menu", style: {
                            background: activeLeaderboard === type.id
                                ? 'linear-gradient(135deg, var(--lamap-red), #a32222)'
                                : '#2A2A2A',
                            color: 'var(--lamap-white)',
                            border: activeLeaderboard === type.id ? '2px solid var(--lamap-red)' : '1px solid #444',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: activeLeaderboard === type.id ? '0 0 10px rgba(198, 40, 40, 0.3)' : 'none'
                        }, children: type.name }, type.id))) }) }), _jsx("div", { className: "lamap-section", children: _jsxs("div", { style: { background: '#111', border: '1px solid var(--lamap-red)', borderRadius: '12px', padding: '1rem' }, children: [_jsx("h2", { style: { fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--lamap-white)', marginBottom: '0.5rem' }, children: leaderboardTypes.find(t => t.id === activeLeaderboard)?.name }), _jsx("p", { style: { fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }, children: leaderboardTypes.find(t => t.id === activeLeaderboard)?.description }), currentLeaderboard.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '2rem' }, children: [_jsx("h3", { style: { fontSize: '1rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }, children: "Aucun classement disponible" }), _jsx("p", { style: { fontSize: '0.9rem', color: '#888' }, children: "Les donn\u00E9es de classement seront disponibles apr\u00E8s quelques parties" })] })) : (_jsx("div", { style: { display: 'grid', gap: '1rem' }, children: currentLeaderboard.map((player, index) => (_jsx("div", { style: {
                                    background: '#1A1A1A',
                                    border: index + 1 <= 3 ? '2px solid #fbbf24' : '1px solid #444',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    boxShadow: index + 1 <= 3 ? '0 0 10px rgba(251, 191, 36, 0.2)' : 'none'
                                }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [_jsx("div", { style: {
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        background: index + 1 <= 3 ? '#fbbf24' : '#444',
                                                        marginRight: '1rem'
                                                    }, children: _jsx("span", { style: { fontSize: '1rem', fontWeight: 'bold', color: index + 1 <= 3 ? '#000' : '#fff' }, children: getRankIcon(index + 1) }) }), _jsxs("div", { children: [_jsx("h4", { style: { fontSize: '1rem', fontWeight: 'bold', color: 'var(--lamap-white)', marginBottom: '0.25rem' }, children: player.name || player.pseudo }), _jsx("p", { style: { fontSize: '0.9rem', color: 'var(--lamap-red)', fontWeight: 'bold' }, children: formatValue(player.value, activeLeaderboard) })] })] }), player.is_bot && (_jsx("span", { style: {
                                                background: '#1d4ed8',
                                                color: '#fff',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '12px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold'
                                            }, children: "IA" }))] }) }, player.id || index))) }))] }) })] }));
};
export default EnhancedLeaderboard;
