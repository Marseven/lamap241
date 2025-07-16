import React, { useEffect, useState } from 'react';
import useGameStore from '../stores/gameStore';

const EnhancedLeaderboard = () => {
  const {
    allLeaderboards,
    globalStats,
    statsLoading,
    statsError,
    fetchAllLeaderboards,
    fetchGlobalStats
  } = useGameStore();

  const [activeLeaderboard, setActiveLeaderboard] = useState('winnings');

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchAllLeaderboards(),
          fetchGlobalStats()
        ]);
      } catch (error) {
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

  const currentLeaderboard = allLeaderboards?.[activeLeaderboard] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Classements</h1>
        <p className="mt-2 text-gray-600">Découvrez les meilleurs joueurs de La Map 241</p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Joueurs actifs</h3>
          <p className="text-3xl font-bold text-blue-600">{globalStats?.total_players || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Parties jouées</h3>
          <p className="text-3xl font-bold text-green-600">{(globalStats?.total_games || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Gains distribués</h3>
          <p className="text-3xl font-bold text-yellow-600">{(globalStats?.total_winnings || 0).toLocaleString()} FCFA</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
          <p className="text-3xl font-bold text-purple-600">{globalStats?.total_achievements || 0}</p>
        </div>
      </div>

      {/* Sélecteur de leaderboard */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {leaderboardTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveLeaderboard(type.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeLeaderboard === type.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {type.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Leaderboard actuel */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {leaderboardTypes.find(t => t.id === activeLeaderboard)?.name}
          </h2>
          <p className="text-sm text-gray-500">
            {leaderboardTypes.find(t => t.id === activeLeaderboard)?.description}
          </p>
        </div>

        <div className="p-6">
          {currentLeaderboard.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun classement disponible</h3>
              <p className="mt-1 text-sm text-gray-500">
                Les données de classement seront disponibles après quelques parties
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentLeaderboard.map((player, index) => (
                <div
                  key={player.id || index}
                  className={`bg-white rounded-lg shadow-sm border-l-4 p-4 ${
                    index + 1 <= 3 ? 'border-yellow-400' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        index + 1 <= 3 ? 'bg-yellow-100' : 'bg-gray-100'
                      }`}>
                        <span className="text-sm font-bold">{getRankIcon(index + 1)}</span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{player.name || player.pseudo}</h4>
                        <p className="text-sm text-gray-500">
                          {formatValue(player.value, activeLeaderboard)}
                        </p>
                      </div>
                    </div>
                    {player.is_bot && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        IA
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedLeaderboard;