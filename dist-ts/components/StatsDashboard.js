import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import useGameStore from '../stores/gameStore';
import LoadingPage from './LoadingPage';
const StatsDashboard = () => {
    const { detailedStats, myAchievements, globalStats, statsLoading, statsError, fetchDetailedStats, fetchMyAchievements, fetchGlobalStats } = useGameStore();
    const [activeTab, setActiveTab] = useState('overview');
    useEffect(() => {
        const loadStats = async () => {
            try {
                await Promise.all([
                    fetchDetailedStats(),
                    fetchMyAchievements(),
                    fetchGlobalStats()
                ]);
            }
            catch (error) {
                console.error('Erreur lors du chargement des statistiques:', error);
            }
        };
        loadStats();
    }, [fetchDetailedStats, fetchMyAchievements, fetchGlobalStats]);
    if (statsLoading) {
        return (_jsx(LoadingPage, { title: "Chargement des statistiques...", subtitle: "R\u00E9cup\u00E9ration de vos donn\u00E9es de jeu", showLogo: true }));
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
                }, children: [_jsx("div", { style: { fontSize: '4rem', marginBottom: '1rem' }, children: "\u274C" }), _jsx("div", { style: { fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)', marginBottom: '1rem' }, children: "Erreur de chargement" }), _jsx("div", { style: { fontSize: '0.9rem', color: '#888', marginBottom: '2rem' }, children: statsError }), _jsx("button", { onClick: () => window.location.reload(), style: {
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
    const stats = detailedStats?.basic || {};
    const financialStats = detailedStats?.financial || {};
    const achievements = Array.isArray(myAchievements) ? myAchievements : [];
    return (_jsxs("div", { className: "mobile-container neon-theme", children: [_jsxs("div", { className: "lamap-section", children: [_jsx("h1", { style: { fontSize: '2rem', fontWeight: 'bold', color: 'var(--lamap-white)', textAlign: 'center', marginBottom: '1rem' }, children: "\uD83D\uDCCA Tableau de Bord" }), _jsx("p", { style: { color: '#888', textAlign: 'center', marginBottom: '2rem' }, children: "Suivez vos performances et vos achievements" })] }), _jsxs("div", { className: "stats-row", style: { marginBottom: '2rem' }, children: [_jsxs("div", { style: { textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }, children: [_jsx("h3", { style: { fontSize: '1rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }, children: "Parties jou\u00E9es" }), _jsx("p", { style: { fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--lamap-red)' }, children: (stats.games_won || 0) + (stats.games_lost || 0) })] }), _jsxs("div", { style: { textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }, children: [_jsx("h3", { style: { fontSize: '1rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }, children: "Victoires" }), _jsx("p", { style: { fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--lamap-red)' }, children: stats.games_won || 0 })] }), _jsxs("div", { style: { textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }, children: [_jsx("h3", { style: { fontSize: '1rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }, children: "S\u00E9rie actuelle" }), _jsx("p", { style: { fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--lamap-red)' }, children: stats.current_streak || 0 })] })] }), _jsxs("div", { className: "lamap-section", children: [_jsx("h3", { style: { fontSize: '1.1rem', color: 'var(--lamap-white)', marginBottom: '1rem' }, children: "\uD83C\uDFC6 Mes Achievements" }), achievements.length === 0 ? (_jsx("p", { style: { color: '#888', textAlign: 'center', padding: '2rem' }, children: "Aucun achievement d\u00E9bloqu\u00E9 pour le moment" })) : (_jsx("div", { style: { display: 'grid', gap: '1rem' }, children: achievements.slice(0, 6).map((achievement, index) => (_jsxs("div", { style: {
                                background: '#111',
                                border: '1px solid var(--lamap-red)',
                                borderRadius: '12px',
                                padding: '1rem',
                                boxShadow: '0 0 10px rgba(198, 40, 40, 0.2)'
                            }, children: [_jsx("h4", { style: { fontSize: '1rem', fontWeight: 'bold', color: 'var(--lamap-white)', marginBottom: '0.5rem' }, children: achievement.name }), _jsx("p", { style: { fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem' }, children: achievement.description }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("span", { style: { fontSize: '0.8rem', color: 'var(--lamap-red)', fontWeight: 'bold' }, children: [achievement.points, " points"] }), achievement.reward && (_jsxs("span", { style: { fontSize: '0.8rem', color: '#4ade80', fontWeight: 'bold' }, children: ["+", achievement.reward, " FCFA"] }))] })] }, index))) }))] })] }));
};
export default StatsDashboard;
