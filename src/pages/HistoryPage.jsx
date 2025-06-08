// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';

export default function HistoryPage() {
  const { user } = useAuth();
  const { transactions } = useWallet();
  const [activeTab, setActiveTab] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Données simulées pour les parties (à remplacer par vraies données)
  const gameHistory = [
    {
      id: 'game1',
      type: 'game',
      opponent: 'Alpha_241',
      result: 'win',
      amount: 1800,
      bet: 1000,
      duration: '5:32',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      roomName: 'Bataille Royale'
    },
    {
      id: 'game2',
      type: 'game',
      opponent: 'Beta_GBN',
      result: 'loss',
      amount: -1000,
      bet: 1000,
      duration: '3:45',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      roomName: 'Défi Express'
    },
    {
      id: 'game3',
      type: 'game',
      opponent: 'IA',
      result: 'win',
      amount: 0,
      bet: 0,
      duration: '7:12',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      roomName: 'Entraînement IA'
    }
  ];

  // Combiner et filtrer les données
  useEffect(() => {
    let allData = [];

    if (activeTab === 'all' || activeTab === 'games') {
      allData = [...allData, ...gameHistory];
    }

    if (activeTab === 'all' || activeTab === 'transactions') {
      const formattedTransactions = transactions.map(t => ({
        ...t,
        type: 'transaction',
        date: new Date(t.timestamp)
      }));
      allData = [...allData, ...formattedTransactions];
    }

    // Filtrer par date
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      allData = allData.filter(item => item.date >= filterDate);
    }

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      allData = allData.filter(item => {
        if (item.type === 'game') {
          return item.opponent?.toLowerCase().includes(query) ||
                 item.roomName?.toLowerCase().includes(query);
        } else {
          return item.description?.toLowerCase().includes(query) ||
                 item.method?.toLowerCase().includes(query);
        }
      });
    }

    // Trier par date (plus récent en premier)
    allData.sort((a, b) => b.date - a.date);

    setFilteredData(allData);
  }, [activeTab, dateFilter, searchQuery, transactions]);

  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(Math.abs(amount));
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'win': return '🏆';
      case 'loss': return '😔';
      case 'draw': return '🤝';
      default: return '🎮';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': return '📈';
      case 'withdraw': return '📉';
      case 'game_win': return '🏆';
      case 'game_bet': return '🎯';
      case 'bonus': return '🎁';
      default: return '💰';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <Link to="/" className="back-btn">
          ← Accueil
        </Link>
        <h1 className="page-title">📊 Historique</h1>
        <div className="header-stats">
          <span className="stat-item">
            {filteredData.length} éléments
          </span>
        </div>
      </div>

      {/* Filtres */}
      <div className="history-filters">
        {/* Barre de recherche */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="clear-search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filtres par date */}
        <div className="date-filters">
          {[
            { value: 'all', label: 'Tout' },
            { value: 'today', label: 'Aujourd\'hui' },
            { value: 'week', label: '7 jours' },
            { value: 'month', label: '30 jours' }
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setDateFilter(filter.value)}
              className={`date-filter ${dateFilter === filter.value ? 'active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Onglets */}
      <div className="history-tabs">
        <button
          onClick={() => setActiveTab('all')}
          className={`history-tab ${activeTab === 'all' ? 'active' : ''}`}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-label">Tout</span>
          <span className="tab-count">{filteredData.length}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('games')}
          className={`history-tab ${activeTab === 'games' ? 'active' : ''}`}
        >
          <span className="tab-icon">🎮</span>
          <span className="tab-label">Parties</span>
          <span className="tab-count">
            {filteredData.filter(item => item.type === 'game').length}
          </span>
        </button>
        
        <button
          onClick={() => setActiveTab('transactions')}
          className={`history-tab ${activeTab === 'transactions' ? 'active' : ''}`}
        >
          <span className="tab-icon">💰</span>
          <span className="tab-label">Transactions</span>
          <span className="tab-count">
            {filteredData.filter(item => item.type === 'transaction').length}
          </span>
        </button>
      </div>

      {/* Liste des éléments */}
      <div className="history-content">
        {filteredData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {searchQuery ? '🔍' : '📭'}
            </div>
            <div className="empty-title">
              {searchQuery ? 'Aucun résultat' : 'Aucun élément'}
            </div>
            <div className="empty-message">
              {searchQuery 
                ? 'Essayez avec d\'autres mots-clés'
                : 'Votre historique apparaîtra ici au fur et à mesure'
              }
            </div>
          </div>
        ) : (
          <div className="history-list">
            {filteredData.map(item => (
              <div key={item.id} className="history-item">
                {item.type === 'game' ? (
                  /* Élément de partie */
                  <div className="game-item">
                    <div className="item-icon">
                      <span className="game-result-icon">
                        {getResultIcon(item.result)}
                      </span>
                    </div>
                    
                    <div className="item-content">
                      <div className="item-header">
                        <div className="item-title">
                          vs {item.opponent}
                          {item.opponent === 'IA' && (
                            <span className="ai-badge">Entraînement</span>
                          )}
                        </div>
                        <div className="item-subtitle">
                          {item.roomName} • Durée: {item.duration}
                        </div>
                      </div>
                      
                      <div className="item-details">
                        <span className="game-status">
                          {item.result === 'win' ? 'Victoire' :
                           item.result === 'loss' ? 'Défaite' : 'Égalité'}
                        </span>
                        {item.bet > 0 && (
                          <span className="game-bet">
                            Mise: {formatAmount(item.bet)} FCFA
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="item-meta">
                      <div className={`item-amount ${
                        item.amount > 0 ? 'positive' : 
                        item.amount < 0 ? 'negative' : 'neutral'
                      }`}>
                        {item.amount > 0 && '+'}
                        {item.amount !== 0 ? `${formatAmount(item.amount)} FCFA` : 'Gratuit'}
                      </div>
                      <div className="item-date">{formatDate(item.date)}</div>
                    </div>
                  </div>
                ) : (
                  /* Élément de transaction */
                  <div className="transaction-item">
                    <div className="item-icon">
                      <span className="transaction-icon">
                        {getTransactionIcon(item.type)}
                      </span>
                    </div>
                    
                    <div className="item-content">
                      <div className="item-header">
                        <div className="item-title">{item.description}</div>
                        <div className="item-subtitle">
                          {item.method && `via ${item.method}`}
                          {item.phoneNumber && ` • ${item.phoneNumber}`}
                        </div>
                      </div>
                      
                      <div className="item-details">
                        <span className={`transaction-status ${getStatusColor(item.status)}`}>
                          {item.status === 'completed' ? 'Terminé' :
                           item.status === 'pending' ? 'En cours' :
                           item.status === 'failed' ? 'Échec' : item.status}
                        </span>
                        {item.fees > 0 && (
                          <span className="transaction-fees">
                            Frais: {formatAmount(item.fees)} FCFA
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="item-meta">
                      <div className={`item-amount ${
                        item.type === 'withdraw' || item.type === 'game_bet' ? 'negative' : 'positive'
                      }`}>
                        {item.type === 'withdraw' || item.type === 'game_bet' ? '-' : '+'}
                        {formatAmount(item.amount)} FCFA
                      </div>
                      <div className="item-date">{formatDate(item.date)}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Résumé en bas */}
      {filteredData.length > 0 && (
        <div className="history-summary">
          <div className="summary-card">
            <div className="summary-stat">
              <span className="summary-icon">🎮</span>
              <div className="summary-content">
                <div className="summary-value">
                  {filteredData.filter(item => item.type === 'game').length}
                </div>
                <div className="summary-label">Parties</div>
              </div>
            </div>
            
            <div className="summary-stat">
              <span className="summary-icon">🏆</span>
              <div className="summary-content">
                <div className="summary-value">
                  {filteredData.filter(item => item.type === 'game' && item.result === 'win').length}
                </div>
                <div className="summary-label">Victoires</div>
              </div>
            </div>
            
            <div className="summary-stat">
              <span className="summary-icon">💰</span>
              <div className="summary-content">
                <div className="summary-value">
                  {formatAmount(
                    filteredData
                      .filter(item => item.type === 'game')
                      .reduce((sum, item) => sum + (item.amount || 0), 0)
                  )}
                </div>
                <div className="summary-label">Gains nets (FCFA)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}