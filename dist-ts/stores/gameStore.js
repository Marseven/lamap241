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
                console.log('Enhanced stats loaded successfully:', stats);
            }
            catch (error) {
                console.warn('Enhanced stats not available, falling back to basic stats. Error:', error.message);
                try {
                    const basicStats = await apiService.getMyStats();
                    stats = { stats: { basic: basicStats } };
                    console.log('Fallback to basic stats successful:', stats);
                }
                catch (fallbackError) {
                    console.error('Both enhanced and basic stats failed:', fallbackError.message);
                    throw new Error('Impossible de charger les statistiques. Veuillez réessayer plus tard.');
                }
            }
            set({ detailedStats: stats.stats, statsLoading: false });
            return stats;
        }
        catch (error) {
            console.error('fetchDetailedStats error:', error);
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
                console.log('Enhanced leaderboards loaded successfully:', leaderboards);
            }
            catch (error) {
                console.warn('Enhanced leaderboards not available, falling back to basic leaderboard. Error:', error.message);
                try {
                    const basicLeaderboard = await apiService.getLeaderboard();
                    leaderboards = { leaderboards: { winnings: basicLeaderboard.leaderboard || [] } };
                    console.log('Fallback to basic leaderboard successful:', leaderboards);
                }
                catch (fallbackError) {
                    console.error('Both enhanced and basic leaderboards failed:', fallbackError.message);
                    throw new Error('Impossible de charger les classements. Veuillez réessayer plus tard.');
                }
            }
            const leaderboardData = leaderboards.leaderboards || {};
            // Ensure each leaderboard type is an array
            Object.keys(leaderboardData).forEach(key => {
                if (!Array.isArray(leaderboardData[key])) {
                    leaderboardData[key] = [];
                }
            });
            set({ allLeaderboards: leaderboardData, statsLoading: false });
            return leaderboards;
        }
        catch (error) {
            console.error('fetchAllLeaderboards error:', error);
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
                console.log('Enhanced achievements loaded successfully:', achievements);
            }
            catch (error) {
                console.warn('Enhanced achievements not available, falling back to basic achievements. Error:', error.message);
                try {
                    const basicAchievements = await apiService.getAchievements();
                    achievements = { achievements: basicAchievements.achievements || [] };
                    console.log('Fallback to basic achievements successful:', achievements);
                }
                catch (fallbackError) {
                    console.error('Both enhanced and basic achievements failed:', fallbackError.message);
                    throw new Error('Impossible de charger les achievements. Veuillez réessayer plus tard.');
                }
            }
            set({ myAchievements: Array.isArray(achievements.achievements) ? achievements.achievements : [], statsLoading: false });
            return achievements;
        }
        catch (error) {
            console.error('fetchMyAchievements error:', error);
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
                console.log('Enhanced global stats loaded successfully:', globalStats);
            }
            catch (error) {
                console.warn('Enhanced global stats not available, using mock data. Error:', error.message);
                globalStats = {
                    stats: {
                        total_players: 150,
                        total_games: 1250,
                        total_winnings: 3500000,
                        total_achievements: 75
                    }
                };
                console.log('Using mock global stats:', globalStats);
            }
            set({ globalStats: globalStats.stats });
            return globalStats;
        }
        catch (error) {
            console.error('fetchGlobalStats error:', error);
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
            set({ availableBots: Array.isArray(response.bots) ? response.bots : [], botsLoading: false });
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
