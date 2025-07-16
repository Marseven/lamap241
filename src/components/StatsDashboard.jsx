import React, { useEffect, useState } from 'react';
import useGameStore from '../stores/gameStore';
import LoadingPage from './LoadingPage';

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
      <LoadingPage 
        title="Chargement des statistiques..."
        subtitle="Récupération de vos données de jeu"
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--lamap-red)', marginBottom: '1rem' }}>
            Erreur de chargement
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

  const stats = detailedStats?.basic || {};
  const financialStats = detailedStats?.financial || {};
  const achievements = Array.isArray(myAchievements) ? myAchievements : [];

  return (
    <div className="mobile-container neon-theme">
      <div className="lamap-section">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--lamap-white)', textAlign: 'center', marginBottom: '1rem' }}>
          📊 Tableau de Bord
        </h1>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem' }}>
          Suivez vos performances et vos achievements
        </p>
      </div>

      {/* Statistiques de base */}
      <div className="stats-row" style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }}>Parties jouées</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--lamap-red)' }}>
            {(stats.games_won || 0) + (stats.games_lost || 0)}
          </p>
        </div>
        
        <div style={{ textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }}>Victoires</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--lamap-red)' }}>
            {stats.games_won || 0}
          </p>
        </div>
        
        <div style={{ textAlign: 'center', background: '#111', padding: '1rem', borderRadius: '12px', border: '1px solid var(--lamap-red)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--lamap-white)', marginBottom: '0.5rem' }}>Série actuelle</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--lamap-red)' }}>
            {stats.current_streak || 0}
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="lamap-section">
        <h3 style={{ fontSize: '1.1rem', color: 'var(--lamap-white)', marginBottom: '1rem' }}>
          🏆 Mes Achievements
        </h3>
        
        {achievements.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
            Aucun achievement débloqué pour le moment
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {achievements.slice(0, 6).map((achievement, index) => (
              <div 
                key={index} 
                style={{ 
                  background: '#111', 
                  border: '1px solid var(--lamap-red)', 
                  borderRadius: '12px', 
                  padding: '1rem',
                  boxShadow: '0 0 10px rgba(198, 40, 40, 0.2)'
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--lamap-white)', marginBottom: '0.5rem' }}>
                  {achievement.name}
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.5rem' }}>
                  {achievement.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--lamap-red)', fontWeight: 'bold' }}>
                    {achievement.points} points
                  </span>
                  {achievement.reward && (
                    <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 'bold' }}>
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