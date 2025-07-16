import React, { useEffect, useState } from 'react';
import useGameStore from '../stores/gameStore';
import LoadingPage from './LoadingPage';

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
      <LoadingPage 
        title="Chargement des classements..."
        subtitle="Récupération des données de performance"
        showLogo={true}
      />
    );
  }

  if (statsError) {
    return (
      <div className="mobile-container neon-theme">
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)', marginBottom: '1rem' }}>
            Erreur de chargement des classements
          </div>
          <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '2rem' }}>
            {statsError}
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
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
            }}
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  const currentLeaderboard = Array.isArray(allLeaderboards?.[activeLeaderboard]) 
    ? allLeaderboards[activeLeaderboard] 
    : [];

  return (
    <div className="mobile-container neon-theme">
      <div className="lamap-section">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--lamap-white)', textAlign: 'center', marginBottom: '1rem' }}>
          🏆 Classements
        </h1>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem' }}>
          Découvrez les meilleurs joueurs de La Map 241
        </p>
      </div>

      {/* Statistiques globales */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }}>Joueurs actifs</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)' }}>
            {globalStats?.total_players || 0}
          </p>
        </div>
        <div style={{ textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }}>Parties jouées</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)' }}>
            {(globalStats?.total_games || 0).toLocaleString()}
          </p>
        </div>
        <div style={{ textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }}>Gains distribués</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)' }}>
            {(globalStats?.total_winnings || 0).toLocaleString()} FCFA
          </p>
        </div>
        <div style={{ textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }}>Achievements</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)' }}>
            {globalStats?.total_achievements || 0}
          </p>
        </div>
      </div>

      {/* Sélecteur de leaderboard */}
      <div className="lamap-section">
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1rem' }}>
          {leaderboardTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveLeaderboard(type.id)}
              className="btn-menu"
              style={{
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
              }}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard actuel */}
      <div className="lamap-section">
        <div style={{ background: '#111', border: '1px solid var(--lamap-red)', borderRadius: '12px', padding: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--lamap-white)', marginBottom: '0.5rem' }}>
            {leaderboardTypes.find(t => t.id === activeLeaderboard)?.name}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
            {leaderboardTypes.find(t => t.id === activeLeaderboard)?.description}
          </p>

          {currentLeaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }}>
                Aucun classement disponible
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#888' }}>
                Les données de classement seront disponibles après quelques parties
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {currentLeaderboard.map((player, index) => (
                <div
                  key={player.id || index}
                  style={{
                    background: '#1A1A1A',
                    border: index + 1 <= 3 ? '2px solid #fbbf24' : '1px solid #444',
                    borderRadius: '12px',
                    padding: '1rem',
                    boxShadow: index + 1 <= 3 ? '0 0 10px rgba(251, 191, 36, 0.2)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: index + 1 <= 3 ? '#fbbf24' : '#444',
                        marginRight: '1rem'
                      }}>
                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: index + 1 <= 3 ? '#000' : '#fff' }}>
                          {getRankIcon(index + 1)}
                        </span>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--lamap-white)', marginBottom: '0.25rem' }}>
                          {player.name || player.pseudo}
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--lamap-red)', fontWeight: 'bold' }}>
                          {formatValue(player.value, activeLeaderboard)}
                        </p>
                      </div>
                    </div>
                    {player.is_bot && (
                      <span style={{
                        background: '#1d4ed8',
                        color: '#fff',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
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