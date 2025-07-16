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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation des onglets */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="py-8">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default StatsPage;