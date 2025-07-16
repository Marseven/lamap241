import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import useGameStore from '../stores/gameStore';
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
        return (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" }) }));
    }
    if (statsError) {
        return (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: _jsxs("p", { className: "text-red-800", children: ["Erreur lors du chargement: ", statsError] }) }));
    }
    const stats = detailedStats?.basic || {};
    const financialStats = detailedStats?.financial || {};
    const achievements = myAchievements || [];
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Tableau de Bord Statistiques" }), _jsx("p", { className: "mt-2 text-gray-600", children: "Suivez vos performances et vos achievements" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Parties jou\u00E9es" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: (stats.games_won || 0) + (stats.games_lost || 0) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Victoires" }), _jsx("p", { className: "text-3xl font-bold text-green-600", children: stats.games_won || 0 })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "S\u00E9rie actuelle" }), _jsx("p", { className: "text-3xl font-bold text-red-600", children: stats.current_streak || 0 })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Gains totaux" }), _jsxs("p", { className: "text-3xl font-bold text-yellow-600", children: [(financialStats.total_won || 0).toLocaleString(), " FCFA"] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 mb-4", children: "Mes Achievements" }), achievements.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "Aucun achievement d\u00E9bloqu\u00E9 pour le moment" })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: achievements.slice(0, 6).map((achievement, index) => (_jsxs("div", { className: "border rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: achievement.name }), _jsx("p", { className: "text-sm text-gray-600", children: achievement.description }), _jsxs("div", { className: "flex items-center mt-2", children: [_jsxs("span", { className: "text-sm font-medium", children: [achievement.points, " points"] }), achievement.reward && (_jsxs("span", { className: "ml-2 text-sm text-green-600", children: ["+", achievement.reward, " FCFA"] }))] })] }, index))) }))] })] }));
};
export default StatsDashboard;
