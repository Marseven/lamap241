import React, { useEffect, useState } from 'react';
import useGameStore from '../stores/gameStore';

const StatsDashboard = () => {
  const {
    detailedStats,
    myAchievements,
    globalStats,
    statsLoading,
    statsError,
    fetchDetailedStats,
    fetchMyAchievements,
    fetchGlobalStats
  } = useGameStore();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadStats = async () => {
      try {
        await Promise.all([
          fetchDetailedStats(),
          fetchMyAchievements(),
          fetchGlobalStats()
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    loadStats();
  }, [fetchDetailedStats, fetchMyAchievements, fetchGlobalStats]);

  if (statsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Erreur lors du chargement: {statsError}</p>
      </div>
    );
  }

  const stats = detailedStats?.basic || {};
  const financialStats = detailedStats?.financial || {};
  const achievements = myAchievements || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Statistiques</h1>
        <p className="mt-2 text-gray-600">Suivez vos performances et vos achievements</p>
      </div>

      {/* Statistiques de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Parties jouées</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(stats.games_won || 0) + (stats.games_lost || 0)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Victoires</h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.games_won || 0}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Série actuelle</h3>
          <p className="text-3xl font-bold text-red-600">
            {stats.current_streak || 0}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Gains totaux</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {(financialStats.total_won || 0).toLocaleString()} FCFA
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Mes Achievements</h2>
        
        {achievements.length === 0 ? (
          <p className="text-gray-500">Aucun achievement débloqué pour le moment</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(0, 6).map((achievement, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium">{achievement.points} points</span>
                  {achievement.reward && (
                    <span className="ml-2 text-sm text-green-600">
                      +{achievement.reward} FCFA
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsDashboard;