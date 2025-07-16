import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import useGameStore from '../stores/gameStore';
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
        return (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" }) }));
    }
    if (statsError) {
        return (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: _jsxs("p", { className: "text-red-800", children: ["Erreur lors du chargement: ", statsError] }) }));
    }
    const currentLeaderboard = allLeaderboards?.[activeLeaderboard] || [];
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Classements" }), _jsx("p", { className: "mt-2 text-gray-600", children: "D\u00E9couvrez les meilleurs joueurs de La Map 241" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Joueurs actifs" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: globalStats?.total_players || 0 })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Parties jou\u00E9es" }), _jsx("p", { className: "text-3xl font-bold text-green-600", children: (globalStats?.total_games || 0).toLocaleString() })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Gains distribu\u00E9s" }), _jsxs("p", { className: "text-3xl font-bold text-yellow-600", children: [(globalStats?.total_winnings || 0).toLocaleString(), " FCFA"] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Achievements" }), _jsx("p", { className: "text-3xl font-bold text-purple-600", children: globalStats?.total_achievements || 0 })] })] }), _jsx("div", { className: "mb-8", children: _jsx("div", { className: "border-b border-gray-200", children: _jsx("nav", { className: "-mb-px flex space-x-8 overflow-x-auto", children: leaderboardTypes.map((type) => (_jsx("button", { onClick: () => setActiveLeaderboard(type.id), className: `py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeLeaderboard === type.id
                                ? 'border-red-500 text-red-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: type.name }, type.id))) }) }) }), _jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-200", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900", children: leaderboardTypes.find(t => t.id === activeLeaderboard)?.name }), _jsx("p", { className: "text-sm text-gray-500", children: leaderboardTypes.find(t => t.id === activeLeaderboard)?.description })] }), _jsx("div", { className: "p-6", children: currentLeaderboard.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "Aucun classement disponible" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Les donn\u00E9es de classement seront disponibles apr\u00E8s quelques parties" })] })) : (_jsx("div", { className: "space-y-4", children: currentLeaderboard.map((player, index) => (_jsx("div", { className: `bg-white rounded-lg shadow-sm border-l-4 p-4 ${index + 1 <= 3 ? 'border-yellow-400' : 'border-gray-200'}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `h-10 w-10 rounded-full flex items-center justify-center ${index + 1 <= 3 ? 'bg-yellow-100' : 'bg-gray-100'}`, children: _jsx("span", { className: "text-sm font-bold", children: getRankIcon(index + 1) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: player.name || player.pseudo }), _jsx("p", { className: "text-sm text-gray-500", children: formatValue(player.value, activeLeaderboard) })] })] }), player.is_bot && (_jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: "IA" }))] }) }, player.id || index))) })) })] })] }));
};
export default EnhancedLeaderboard;
