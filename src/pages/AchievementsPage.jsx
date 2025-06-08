// src/pages/AchievementsPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AchievementsPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');

  // Données des succès (à remplacer par vraies données)
  const achievements = [
    // Succès de début
    {
      id: 'first_game',
      title: 'Premier pas',
      description: 'Jouer votre première partie',
      icon: '🎮',
      category: 'beginner',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      xp: 50,
      rarity: 'common'
    },
    {
      id: 'first_win',
      title: 'Première victoire',
      description: 'Remporter votre première partie',
      icon: '🏆',
      category: 'beginner',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      xp: 100,
      rarity: 'common'
    },
    {
      id: 'register_account',
      title: 'Bienvenue !',
      description: 'Créer un compte LaMap241',
      icon: '👋',
      category: 'beginner',
      unlocked: true,
      unlockedAt: new Date(user?.createdAt || Date.now()),
      xp: 25,
      rarity: 'common'
    },

    // Succès de victoires
    {
      id: 'win_streak_3',
      title: 'En forme !',
      description: 'Gagner 3 parties d\'affilée',
      icon: '🔥',
      category: 'victories',
      unlocked: false,
      progress: { current: 1, total: 3 },
      xp: 200,
      rarity: 'uncommon'
    },
    {
      id: 'win_streak_10',
      title: 'Inarrêtable',
      description: 'Gagner 10 parties d\'affilée',
      icon: '⚡',
      category: 'victories',
      unlocked: false,
      progress: { current: 1, total: 10 },
      xp: 500,
      rarity: 'rare'
    },
    {
      id: 'total_wins_10',
      title: 'Vainqueur confirmé',
      description: 'Remporter 10 parties au total',
      icon: '🎯',
      category: 'victories',
      unlocked: false,
      progress: { current: 2, total: 10 },
      xp: 300,
      rarity: 'uncommon'
    },
    {
      id: 'total_wins_50',
      title: 'Champion',
      description: 'Remporter 50 parties au total',
      icon: '👑',
      category: 'victories',
      unlocked: false,
      progress: { current: 2, total: 50 },
      xp: 1000,
      rarity: 'epic'
    },

    // Succès financiers
    {
      id: 'first_deposit',
      title: 'Premier dépôt',
      description: 'Effectuer votre premier dépôt',
      icon: '💳',
      category: 'money',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      xp: 75,
      rarity: 'common'
    },
    {
      id: 'big_win',
      title: 'Gros lot',
      description: 'Gagner plus de 10,000 FCFA en une partie',
      icon: '💰',
      category: 'money',
      unlocked: false,
      progress: { current: 1800, total: 10000 },
      xp: 400,
      rarity: 'rare'
    },
    {
      id: 'millionaire',
      title: 'Millionnaire',
      description: 'Atteindre 1,000,000 FCFA de gains totaux',
      icon: '💎',
      category: 'money',
      unlocked: false,
      progress: { current: 15000, total: 1000000 },
      xp: 2000,
      rarity: 'legendary'
    },

    // Succès spéciaux
    {
      id: 'speed_demon',
      title: 'Éclair',
      description: 'Finir une partie en moins de 2 minutes',
      icon: '⚡',
      category: 'special',
      unlocked: false,
      xp: 150,
      rarity: 'uncommon'
    },
    {
      id: 'comeback_king',
      title: 'Retour gagnant',
      description: 'Gagner une partie après avoir été mené 0-2',
      icon: '🔄',
      category: 'special',
      unlocked: false,
      xp: 250,
      rarity: 'rare'
    },
    {
      id: 'perfect_game',
      title: 'Partie parfaite',
      description: 'Gagner sans perdre une seule manche',
      icon: '✨',
      category: 'special',
      unlocked: false,
      xp: 300,
      rarity: 'epic'
    },

    // Succès sociaux
    {
      id: 'social_player',
      title: 'Sociable',
      description: 'Jouer contre 10 joueurs différents',
      icon: '👥',
      category: 'social',
      unlocked: false,
      progress: { current: 3, total: 10 },
      xp: 200,
      rarity: 'uncommon'
    },
    {
      id: 'friend_referral',
      title: 'Ambassadeur',
      description: 'Inviter 5 amis à rejoindre LaMap241',
      icon: '🎪',
      category: 'social',
      unlocked: false,
      progress: { current: 0, total: 5 },
      xp: 500,
      rarity: 'rare'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous', icon: '🏆' },
    { id: 'beginner', name: 'Débutant', icon: '🌱' },
    { id: 'victories', name: 'Victoires', icon: '👑' },
    { id: 'money', name: 'Financier', icon: '💰' },
    { id: 'special', name: 'Spécial', icon: '✨' },
    { id: 'social', name: 'Social', icon: '👥' }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#9ca3af';
      case 'uncommon': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRarityLabel = (rarity) => {
    switch (rarity) {
      case 'common': return 'Commun';
      case 'uncommon': return 'Peu commun';
      case 'rare': return 'Rare';
      case 'epic': return 'Épique';
      case 'legendary': return 'Légendaire';
      default: return '';
    }
  };

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="achievements-page">
      {/* Header */}
      <div className="achievements-header">
        <Link to="/" className="back-btn">
          ← Accueil
        </Link>
        <h1 className="page-title">🏆 Succès</h1>
        <div className="achievements-stats">
          <span className="stat-item">
            {unlockedCount}/{achievements.length}
          </span>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="achievements-overview">
        <div className="overview-card">
          <div className="overview-stat">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{unlockedCount}</div>
              <div className="stat-label">Succès débloqués</div>
            </div>
          </div>
          
          <div className="overview-stat">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </div>
              <div className="stat-label">Progression</div>
            </div>
          </div>
          
          <div className="overview-stat">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">{totalXP}</div>
              <div className="stat-label">XP Total</div>
            </div>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="global-progress">
          <div className="progress-header">
            <span className="progress-label">Progression globale</span>
            <span className="progress-text">{unlockedCount}/{achievements.length}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="achievements-categories">
        {categories.map(category => {
          const categoryAchievements = category.id === 'all' 
            ? achievements 
            : achievements.filter(a => a.category === category.id);
          const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length;
          
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            >
              <span className="category-icon">{category.icon}</span>
              <div className="category-content">
                <span className="category-name">{category.name}</span>
                <span className="category-count">
                  {categoryUnlocked}/{categoryAchievements.length}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Liste des succès */}
      <div className="achievements-list">
        {filteredAchievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon-wrapper">
              <div 
                className="achievement-icon"
                style={{ 
                  filter: achievement.unlocked ? 'none' : 'grayscale(100%)',
                  borderColor: getRarityColor(achievement.rarity)
                }}
              >
                <span>{achievement.icon}</span>
              </div>
              {achievement.unlocked && (
                <div className="unlock-badge">✓</div>
              )}
            </div>

            <div className="achievement-content">
              <div className="achievement-header">
                <h3 className="achievement-title">{achievement.title}</h3>
                <div className="achievement-meta">
                  <span 
                    className="achievement-rarity"
                    style={{ color: getRarityColor(achievement.rarity) }}
                  >
                    {getRarityLabel(achievement.rarity)}
                  </span>
                  <span className="achievement-xp">+{achievement.xp} XP</span>
                </div>
              </div>
              
              <p className="achievement-description">{achievement.description}</p>
              
              {achievement.unlocked ? (
                <div className="achievement-unlocked">
                  <span className="unlock-icon">🎉</span>
                  <span className="unlock-text">
                    Débloqué le {formatDate(achievement.unlockedAt)}
                  </span>
                </div>
              ) : achievement.progress ? (
                <div className="achievement-progress">
                  <div className="progress-header">
                    <span className="progress-label">Progression</span>
                    <span className="progress-text">
                      {achievement.progress.current.toLocaleString()}/{achievement.progress.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min((achievement.progress.current / achievement.progress.total) * 100, 100)}%`,
                        backgroundColor: getRarityColor(achievement.rarity)
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="achievement-locked">
                  <span className="lock-icon">🔒</span>
                  <span className="lock-text">À débloquer</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Conseils pour débloquer des succès */}
      <div className="achievements-tips">
        <h3 className="tips-title">💡 Conseils pour débloquer plus de succès</h3>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">🎮</span>
            <div className="tip-content">
              <div className="tip-title">Jouez régulièrement</div>
              <div className="tip-desc">Plus vous jouez, plus vous débloquez de succès</div>
            </div>
          </div>
          
          <div className="tip-item">
            <span className="tip-icon">👥</span>
            <div className="tip-content">
              <div className="tip-title">Défiez différents joueurs</div>
              <div className="tip-desc">Variez vos adversaires pour débloquer les succès sociaux</div>
            </div>
          </div>
          
          <div className="tip-item">
            <span className="tip-icon">💰</span>
            <div className="tip-content">
              <div className="tip-title">Participez aux gros enjeux</div>
              <div className="tip-desc">Les parties avec de grosses mises offrent plus de récompenses</div>
            </div>
          </div>
          
          <div className="tip-item">
            <span className="tip-icon">⚡</span>
            <div className="tip-content">
              <div className="tip-title">Maîtrisez votre jeu</div>
              <div className="tip-desc">Les succès spéciaux récompensent les techniques avancées</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}