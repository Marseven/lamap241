import React, { useState } from 'react';
import StatsDashboard from '../components/StatsDashboard';
import EnhancedLeaderboard from '../components/EnhancedLeaderboard';
import {
  ChartBarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const StatsPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      name: 'Mon Dashboard',
      icon: ChartBarIcon,
      component: StatsDashboard
    },
    {
      id: 'leaderboards',
      name: 'Classements',
      icon: TrophyIcon,
      component: EnhancedLeaderboard
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="mobile-container neon-theme">
      {/* En-tête */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: 'var(--lamap-white)', 
          textAlign: 'center',
          marginBottom: '0.5rem'
        }}>
          📊 Statistiques
        </h1>
        <p style={{ 
          color: '#888', 
          textAlign: 'center', 
          fontSize: '0.9rem' 
        }}>
          Suivez vos performances et classements
        </p>
      </div>

      {/* Navigation des onglets avec neon theme */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '8px',
        marginBottom: '2rem',
        display: 'flex',
        gap: '8px'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '12px 8px',
                background: activeTab === tab.id ? 'var(--lamap-red)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: activeTab === tab.id ? 'white' : '#888',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '12px',
                fontWeight: '500',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(198, 40, 40, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#888';
                }
              }}
            >
              <Icon style={{ fontSize: '1.1rem' }} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Contenu de l'onglet actif */}
      <div>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default StatsPage;