import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import NotificationToast from '../components/NotificationToast';

export default function WalletPage() {
  const { user } = useAuth();
  const { transactions, loading, deposit, withdraw, getWalletStats } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);

  // États pour les formulaires
  const [depositForm, setDepositForm] = useState({
    amount: '',
    method: 'airtel',
    phoneNumber: ''
  });

  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    method: 'airtel',
    phoneNumber: ''
  });

  const addNotification = (type, message, title = '') => {
    const notification = {
      id: Math.random().toString(36),
      type,
      title,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const methods = [
    { id: 'airtel', name: 'Airtel Money', icon: '', color: 'bg-red-600' },
    { id: 'moov', name: 'Moov Money', icon: '', color: 'bg-orange-600' }
  ];

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    const amount = parseInt(depositForm.amount);
    if (!amount || !depositForm.phoneNumber) {
      addNotification('error', 'Veuillez remplir tous les champs');
      return;
    }

    const result = await deposit(amount, depositForm.method, depositForm.phoneNumber);
    
    if (result.success) {
      addNotification('success', `Recharge de ${amount} FCFA en cours...`, 'Dépôt initié');
      setDepositForm({ amount: '', method: 'airtel', phoneNumber: '' });
    } else {
      addNotification('error', result.error);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    const amount = parseInt(withdrawForm.amount);
    if (!amount || !withdrawForm.phoneNumber) {
      addNotification('error', 'Veuillez remplir tous les champs');
      return;
    }

    const result = await withdraw(amount, withdrawForm.method, withdrawForm.phoneNumber);
    
    if (result.success) {
      addNotification('success', `Retrait de ${amount} FCFA en cours...`, 'Retrait initié');
      setWithdrawForm({ amount: '', method: 'airtel', phoneNumber: '' });
    } else {
      addNotification('error', result.error);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit': return '📈';
      case 'withdraw': return '📉';
      case 'game_win': return '🏆';
      case 'game_bet': return '🎯';
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

  const stats = getWalletStats();

  return (
    <div className="wallet-page">
      <NotificationToast notifications={notifications} onRemove={removeNotification} />
      
      {/* Header */}
      <div className="wallet-header">
        <Link to="/" className="back-btn">
          ← Retour
        </Link>
        <h1 className="page-title">💰 Portefeuille</h1>
        <div></div>
      </div>

      {/* Solde principal */}
      <div className="balance-card">
        <div className="balance-main">
          <div className="balance-label">Solde disponible</div>
          <div className="balance-amount text-center">{formatAmount(user?.balance || 0)} FCFA</div>
        </div>
        <div className="balance-actions">
          <button 
            onClick={() => setActiveTab('deposit')}
            className="balance-btn deposit"
          >
            <span></span>
            Recharger
          </button>
          <button 
            onClick={() => setActiveTab('withdraw')}
            className="balance-btn withdraw"
          >
            <span></span>
            Retirer
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="wallet-tabs">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
          { id: 'deposit', label: 'Recharger', icon: '📈' },
          { id: 'withdraw', label: 'Retirer', icon: '📉' },
          { id: 'history', label: 'Historique', icon: '📜' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`wallet-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="tab-content">
        
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-value">{formatAmount(stats.totalDeposits)}</div>
                <div className="stat-label">Total rechargé</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📉</div>
                <div className="stat-value">{formatAmount(stats.totalWithdrawals)}</div>
                <div className="stat-label">Total retiré</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">{formatAmount(stats.totalGameWins)}</div>
                <div className="stat-label">Gains de jeu</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">{formatAmount(stats.totalGameBets)}</div>
                <div className="stat-label">Mises totales</div>
              </div>
            </div>

            <div className="profit-card">
              <div className="profit-header">
                <span className="profit-icon">💰</span>
                <span className="profit-label">Profit net du jeu</span>
              </div>
              <div className={`profit-amount ${stats.netGameProfit >= 0 ? 'positive' : 'negative'}`}>
                {stats.netGameProfit >= 0 ? '+' : ''}{formatAmount(stats.netGameProfit)} FCFA
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de dépôt */}
        {activeTab === 'deposit' && (
          <div className="form-content">
            <form onSubmit={handleDeposit} className="transaction-form">
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">📈</span>
                  Recharger le compte
                </h3>
                
                {/* Méthode de paiement */}
                <div className="payment-methods">
                  {methods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setDepositForm({...depositForm, method: method.id})}
                      className={`payment-method ${depositForm.method === method.id ? 'active' : ''}`}
                    >
                      <span className="method-icon">{method.icon}</span>
                      <span className="method-name">{method.name}</span>
                    </button>
                  ))}
                </div>

                {/* Montants rapides */}
                <div className="quick-amounts">
                  <div className="quick-amounts-label">Montants rapides :</div>
                  <div className="quick-amounts-buttons">
                    {[500, 1000, 5000, 10000, 25000].map(amount => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setDepositForm({...depositForm, amount: amount.toString()})}
                        className="quick-amount-btn"
                      >
                        {formatAmount(amount)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formulaire */}
                <div className="form-fields">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">💰</span>
                      Montant (FCFA)
                    </label>
                    <input
                      type="number"
                      value={depositForm.amount}
                      onChange={(e) => setDepositForm({...depositForm, amount: e.target.value})}
                      className="form-input"
                      placeholder="Montant à recharger"
                      min="500"
                      max="500000"
                      disabled={loading}
                    />
                    <div className="form-help">Minimum : 500 FCFA - Maximum : 500,000 FCFA</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">📱</span>
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      value={depositForm.phoneNumber}
                      onChange={(e) => setDepositForm({...depositForm, phoneNumber: e.target.value})}
                      className="form-input"
                      placeholder="074XXXXXXXX"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !depositForm.amount || !depositForm.phoneNumber}
                  className="submit-btn deposit"
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon"></span>
                      Recharger {depositForm.amount && `${formatAmount(parseInt(depositForm.amount))} FCFA`}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulaire de retrait */}
        {activeTab === 'withdraw' && (
          <div className="form-content">
            <form onSubmit={handleWithdraw} className="transaction-form">
              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">📉</span>
                  Retirer des gains
                </h3>

                {/* Méthode de paiement */}
                <div className="payment-methods">
                  {methods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setWithdrawForm({...withdrawForm, method: method.id})}
                      className={`payment-method ${withdrawForm.method === method.id ? 'active' : ''}`}
                    >
                      <span className="method-icon">{method.icon}</span>
                      <span className="method-name">{method.name}</span>
                    </button>
                  ))}
                </div>

                {/* Formulaire */}
                <div className="form-fields">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">💰</span>
                      Montant (FCFA)
                    </label>
                    <input
                      type="number"
                      value={withdrawForm.amount}
                      onChange={(e) => setWithdrawForm({...withdrawForm, amount: e.target.value})}
                      className="form-input"
                      placeholder="Montant à retirer"
                      min="1000"
                      max={user?.balance || 0}
                      disabled={loading}
                    />
                    <div className="form-help">
                      Minimum : 1,000 FCFA - Disponible : {formatAmount(user?.balance || 0)} FCFA
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">📱</span>
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      value={withdrawForm.phoneNumber}
                      onChange={(e) => setWithdrawForm({...withdrawForm, phoneNumber: e.target.value})}
                      className="form-input"
                      placeholder="+241 XX XX XX XX"
                      disabled={loading}
                    />
                  </div>

                  {/* Calcul des frais */}
                  {withdrawForm.amount && (
                    <div className="fees-info">
                      <div className="fees-row">
                        <span>Montant demandé :</span>
                        <span>{formatAmount(parseInt(withdrawForm.amount))} FCFA</span>
                      </div>
                      <div className="fees-row">
                        <span>Frais (2%, min 100 FCFA) :</span>
                        <span>{formatAmount(Math.max(Math.round(parseInt(withdrawForm.amount) * 0.02), 100))} FCFA</span>
                      </div>
                      <div className="fees-row total">
                        <span>Total à déduire :</span>
                        <span>{formatAmount(parseInt(withdrawForm.amount) + Math.max(Math.round(parseInt(withdrawForm.amount) * 0.02), 100))} FCFA</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !withdrawForm.amount || !withdrawForm.phoneNumber}
                  className="submit-btn withdraw"
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">📉</span>
                      Retirer {withdrawForm.amount && `${formatAmount(parseInt(withdrawForm.amount))} FCFA`}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Historique des transactions */}
        {activeTab === 'history' && (
          <div className="history-content">
            {transactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <div className="empty-title">Aucune transaction</div>
                <div className="empty-message">Vos transactions apparaîtront ici</div>
              </div>
            ) : (
              <div className="transactions-list">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-icon">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="transaction-info">
                      <div className="transaction-desc">{transaction.description}</div>
                      <div className="transaction-meta">
                        <span className="transaction-date">{formatDate(transaction.timestamp)}</span>
                        <span className={`transaction-status ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'completed' ? 'Terminé' : 
                           transaction.status === 'pending' ? 'En cours' : 'Échec'}
                        </span>
                      </div>
                      {transaction.fees > 0 && (
                        <div className="transaction-fees">Frais: {formatAmount(transaction.fees)} FCFA</div>
                      )}
                    </div>
                    <div className={`transaction-amount ${
                      transaction.type === 'withdraw' || transaction.type === 'game_bet' ? 'negative' : 'positive'
                    }`}>
                      {transaction.type === 'withdraw' || transaction.type === 'game_bet' ? '-' : '+'}
                      {formatAmount(Math.abs(transaction.amount))} FCFA
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}