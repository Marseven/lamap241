import { create } from 'zustand';
import apiService from '../services/api';
const useGameStore = create((set, get) => ({
    // État des statistiques
    detailedStats: null,
    allLeaderboards: null,
    myAchievements: null,
    globalStats: null,
    statsLoading: false,
    statsError: null,
    // État des bots
    availableBots: [],
    botsLoading: false,
    botsError: null,
    // Actions pour les statistiques
    fetchDetailedStats: async () => {
        set({ statsLoading: true, statsError: null });
        try {
            // Fallback vers les stats de base si enhanced-stats n'est pas disponible
            let stats;
            try {
                stats = await apiService.getDetailedStats();
            }
            catch (error) {
                console.warn('Enhanced stats not available, falling back to basic stats');
                stats = await apiService.getMyStats();
                stats = { stats: { basic: stats } };
            }
            set({ detailedStats: stats.stats, statsLoading: false });
            return stats;
        }
        catch (error) {
            set({ statsError: error.message, statsLoading: false });
            throw error;
        }
    },
    fetchAllLeaderboards: async () => {
        set({ statsLoading: true, statsError: null });
        try {
            // Fallback vers le leaderboard de base
            let leaderboards;
            try {
                leaderboards = await apiService.getAllLeaderboards();
            }
            catch (error) {
                console.warn('Enhanced leaderboards not available, falling back to basic leaderboard');
                const basicLeaderboard = await apiService.getLeaderboard();
                leaderboards = { leaderboards: { winnings: basicLeaderboard.leaderboard || [] } };
            }
            set({ allLeaderboards: leaderboards.leaderboards, statsLoading: false });
            return leaderboards;
        }
        catch (error) {
            set({ statsError: error.message, statsLoading: false });
            throw error;
        }
    },
    fetchMyAchievements: async () => {
        set({ statsLoading: true, statsError: null });
        try {
            // Fallback vers les achievements de base
            let achievements;
            try {
                achievements = await apiService.getMyAchievements();
            }
            catch (error) {
                console.warn('Enhanced achievements not available, falling back to basic achievements');
                achievements = await apiService.getAchievements();
                achievements = { achievements: achievements.achievements || [] };
            }
            set({ myAchievements: achievements.achievements, statsLoading: false });
            return achievements;
        }
        catch (error) {
            set({ statsError: error.message, statsLoading: false });
            throw error;
        }
    },
    fetchGlobalStats: async () => {
        try {
            // Fallback vers des stats globales simulées
            let globalStats;
            try {
                globalStats = await apiService.getGlobalStats();
            }
            catch (error) {
                console.warn('Enhanced global stats not available, using mock data');
                globalStats = {
                    stats: {
                        total_players: 150,
                        total_games: 1250,
                        total_winnings: 3500000,
                        total_achievements: 75
                    }
                };
            }
            set({ globalStats: globalStats.stats });
            return globalStats;
        }
        catch (error) {
            console.error('Erreur lors du chargement des stats globales:', error);
            throw error;
        }
    },
    // Actions pour les bots
    fetchAvailableBots: async () => {
        set({ botsLoading: true, botsError: null });
        try {
            // Fallback vers des bots simulés si l'endpoint n'est pas disponible
            let response;
            try {
                response = await apiService.getBots();
            }
            catch (error) {
                console.warn('Bots endpoint not available, using mock data');
                response = {
                    bots: [
                        { id: 1, name: 'AlphaBot', difficulty: 'easy', is_bot: true },
                        { id: 2, name: 'BetaBot', difficulty: 'medium', is_bot: true },
                        { id: 3, name: 'GammaBot', difficulty: 'hard', is_bot: true }
                    ]
                };
            }
            set({ availableBots: response.bots, botsLoading: false });
            return response;
        }
        catch (error) {
            set({ botsError: error.message, botsLoading: false });
            throw error;
        }
    },
    createBot: async (botData) => {
        set({ botsLoading: true, botsError: null });
        try {
            const bot = await apiService.createBot(botData);
            const currentBots = get().availableBots;
            set({
                availableBots: [...currentBots, bot.bot],
                botsLoading: false
            });
            return bot;
        }
        catch (error) {
            set({ botsError: error.message, botsLoading: false });
            throw error;
        }
    },
    addBotToRoom: async (roomCode, botId) => {
        try {
            const result = await apiService.addBotToRoom(roomCode, botId);
            return result;
        }
        catch (error) {
            console.error('Erreur lors de l\'ajout du bot:', error);
            throw error;
        }
    },
    // Actions utilitaires
    clearStats: () => {
        set({
            detailedStats: null,
            allLeaderboards: null,
            myAchievements: null,
            globalStats: null,
            statsError: null
        });
    },
    clearBots: () => {
        set({
            availableBots: [],
            botsError: null
        });
    },
    reset: () => {
        set({
            detailedStats: null,
            allLeaderboards: null,
            myAchievements: null,
            globalStats: null,
            statsLoading: false,
            statsError: null,
            availableBots: [],
            botsLoading: false,
            botsError: null,
        });
    },
}));
export default useGameStore;
