import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import NotificationToast from '../components/NotificationToast';

export default function WalletPage() {
  const { user } = useAuth();
  const { 
    transactions, 
    loading, 
    deposit, 
    withdraw, 
    getWalletStats,
    validatePhone,
    getOperatorFromPhone,
    formatAmount,
    pollingTransactions,
    checkTransactionStatus,
    retryTransaction
  } = useWallet();
  
  const [searchParams] = useSearchParams();
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

  // États pour le suivi des transactions
  const [depositStatus, setDepositStatus] = useState('');
  const [depositProgress, setDepositProgress] = useState({ elapsed: 0, remaining: 60 });
  const [depositInProgress, setDepositInProgress] = useState(false);

  // Vérifier les paramètres URL pour définir l'onglet initial
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'deposit', 'withdraw', 'history'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
    { 
      id: 'airtel', 
      name: 'Airtel Money', 
      icon: '📱', 
      color: 'bg-red-600',
      prefixes: ['074', '077', '076']
    },
    { 
      id: 'moov', 
      name: 'Moov Money', 
      icon: '💳', 
      color: 'bg-orange-600',
      prefixes: ['062', '065', '066', '060']
    }
  ];

  // Validation en temps réel du numéro pour les dépôts
  const handleDepositPhoneChange = (value) => {
    setDepositForm({...depositForm, phoneNumber: value});
    
    if (validatePhone(value)) {
      const operator = getOperatorFromPhone(value);
      if (operator && operator !== depositForm.method) {
        setDepositForm(prev => ({...prev, method: operator, phoneNumber: value}));
        addNotification('info', `Opérateur auto-détecté: ${operator === 'airtel' ? 'Airtel Money' : 'Moov Money'}`);
      }
    }
  };

  // Validation en temps réel du numéro pour les retraits
  const handleWithdrawPhoneChange = (value) => {
    setWithdrawForm({...withdrawForm, phoneNumber: value});
    
    if (validatePhone(value)) {
      const operator = getOperatorFromPhone(value);
      if (operator && operator !== withdrawForm.method) {
        setWithdrawForm(prev => ({...prev, method: operator, phoneNumber: value}));
      }
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    
    const amount = parseInt(depositForm.amount);
    if (!amount || !depositForm.phoneNumber) {
      addNotification('error', 'Veuillez remplir tous les champs');
      return;
    }

    if (amount < 500 || amount > 1000000) {
      addNotification('error', 'Montant invalide (500 - 1,000,000 FCFA)');
      return;
    }

    if (!validatePhone(depositForm.phoneNumber)) {
      addNotification('error', 'Format de numéro invalide');
      return;
    }

    const operator = getOperatorFromPhone(depositForm.phoneNumber);
    if (operator !== depositForm.method) {
      addNotification('error', `Le numéro ne correspond pas à ${depositForm.method}`);
      return;
    }

    setDepositInProgress(true);
    setDepositStatus('📱 Initialisation du paiement...');

    try {
      const result = await deposit(
        amount, 
        depositForm.method, 
        depositForm.phoneNumber,
        {
          onStatusUpdate: (status) => {
            setDepositProgress({
              elapsed: status.elapsed_time || 0,
              remaining: status.remaining_time || 60
            });
            setDepositStatus(`🔄 Vérification... ${status.remaining_time || 60}s restantes`);
          },
          onSuccess: (status) => {
            setDepositStatus('✅ Dépôt réussi ! Votre compte a été crédité.');
            setDepositInProgress(false);
            addNotification('success', 'Dépôt réussi !', 'Paiement confirmé');
            setDepositForm({ amount: '', method: 'airtel', phoneNumber: '' });
          },
          onFailure: (status) => {
            setDepositStatus('❌ Paiement échoué. Vous pouvez réessayer.');
            setDepositInProgress(false);
            addNotification('error', status.message || 'Paiement échoué');
          },
          onTimeout: () => {
            setDepositStatus('⏰ Vérification en cours... Cela peut prendre quelques minutes.');
            setDepositInProgress(false);
            addNotification('warning', 'Vérification en cours...', 'Paiement en attente');
          }
        }
      );
      
      if (result.success) {
        setDepositStatus(`📱 ${result.message}`);
        addNotification('info', result.message, 'Instructions reçues');
      } else {
        setDepositStatus(`❌ ${result.error}`);
        setDepositInProgress(false);
        addNotification('error', result.error);
      }
    } catch (error) {
      setDepositStatus(`❌ Erreur: ${error.message}`);
      setDepositInProgress(false);
      addNotification('error', error.message);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    const amount = parseInt(withdrawForm.amount);
    if (!amount || !withdrawForm.phoneNumber) {
      addNotification('error', 'Veuillez remplir tous les champs');
      return;
    }

    if (amount < 1000) {
      addNotification('error', 'Montant minimum: 1,000 FCFA');
      return;
    }

    if (amount > (user?.balance || 0)) {
      addNotification('error', 'Solde insuffisant');
      return;
    }

    if (!validatePhone(withdrawForm.phoneNumber)) {
      addNotification('error', 'Format de numéro invalide');
      return;
    }

    const operator = getOperatorFromPhone(withdrawForm.phoneNumber);
    if (operator !== withdrawForm.method) {
      addNotification('error', `Le numéro ne correspond pas à ${withdrawForm.method}`);
      return;
    }

    const result = await withdraw(amount, withdrawForm.method, withdrawForm.phoneNumber);
    
    if (result.success) {
      addNotification('success', `Retrait de ${formatAmount(amount)} en cours...`, 'Retrait initié');
      setWithdrawForm({ amount: '', method: 'airtel', phoneNumber: '' });
    } else {
      addNotification('error', result.error);
    }
  };

  const handleRetryTransaction = async (transaction) => {
    try {
      addNotification('info', 'Nouvelle tentative en cours...', 'Retry');
      const result = await retryTransaction(transaction);
      
      if (result.success) {
        addNotification('success', 'Transaction relancée avec succès');
      } else {
        addNotification('error', result.error || 'Échec de la nouvelle tentative');
      }
    } catch (error) {
      addNotification('error', error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
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
      case 'withdrawal': return '📉';
      case 'game_win': return '🏆';
      case 'game_bet': return '🎯';
      case 'bonus': return '🎁';
      case 'refund': return '↩️';
      default: return '💰';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'processing': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En attente';
      case 'processing': return 'Traitement';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  const calculateWithdrawFee = (amount) => {
    return Math.max(Math.round(amount * 0.02), 100);
  };

  const stats = getWalletStats();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NotificationToast notifications={notifications} onRemove={removeNotification} />
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center">
            ← <span className="ml-1">Retour</span>
          </Link>
          <h1 className="text-xl font-bold">💰 Portefeuille</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Solde principal */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 mx-4 mt-4 rounded-lg p-6">
        <div className="text-center">
          <div className="text-sm text-blue-100 mb-1">Solde disponible</div>
          <div className="text-3xl font-bold mb-4">{formatAmount(user?.balance || 0)} FCFA</div>
          
          {user?.bonus_balance > 0 && (
            <div className="text-sm text-blue-100">
              + {formatAmount(user.bonus_balance)} FCFA en bonus
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => setActiveTab('deposit')}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors"
            >
              📈 Recharger
            </button>
            <button 
              onClick={() => setActiveTab('withdraw')}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors"
            >
              📉 Retirer
            </button>
          </div>
        </div>
      </div>

      {/* Transactions en cours de polling */}
      {pollingTransactions.length > 0 && (
        <div className="mx-4 mt-4 bg-blue-500/10 border border-blue-500 rounded-lg p-3">
          <div className="flex items-center text-blue-400 text-sm">
            <span className="animate-spin mr-2">🔄</span>
            <span>{pollingTransactions.length} transaction(s) en vérification</span>
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="border-b border-gray-700 mt-6">
        <div className="flex overflow-x-auto">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
            { id: 'deposit', label: 'Recharger', icon: '📈' },
            { id: 'withdraw', label: 'Retirer', icon: '📉' },
            { id: 'history', label: 'Historique', icon: '📜' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="p-4">
        
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl mb-1">📈</div>
                <div className="text-sm text-gray-400">Total rechargé</div>
                <div className="font-semibold">{formatAmount(stats.totalDeposits)}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl mb-1">📉</div>
                <div className="text-sm text-gray-400">Total retiré</div>
                <div className="font-semibold">{formatAmount(stats.totalWithdrawals)}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm text-gray-400">Gains de jeu</div>
                <div className="font-semibold text-green-400">{formatAmount(stats.totalGameWins)}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-sm text-gray-400">Mises totales</div>
                <div className="font-semibold text-red-400">{formatAmount(stats.totalGameBets)}</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Profit net du jeu</div>
                  <div className={`text-xl font-bold ${stats.netGameProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.netGameProfit >= 0 ? '+' : ''}{formatAmount(stats.netGameProfit)} FCFA
                  </div>
                </div>
                <div className="text-2xl">💰</div>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de dépôt */}
        {activeTab === 'deposit' && (
          <div className="space-y-6">
            <form onSubmit={handleDeposit} className="space-y-4">
              
              {/* Méthodes de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Méthode de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {methods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setDepositForm({...depositForm, method: method.id})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        depositForm.method === method.id
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs opacity-75">{method.prefixes.join(', ')}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Montants rapides */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Montants rapides
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 5000, 10000, 25000, 50000].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setDepositForm({...depositForm, amount: amount.toString()})}
                      className={`p-3 rounded-lg border transition-all text-sm ${
                        depositForm.amount === amount.toString()
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {amount.toLocaleString()} F
                    </button>
                  ))}
                </div>
              </div>

              {/* Montant personnalisé */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Montant (FCFA)
                </label>
                <input
                  type="number"
                  min="500"
                  max="1000000"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm({...depositForm, amount: e.target.value})}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Entrez le montant"
                  disabled={loading || depositInProgress}
                />
                <div className="text-xs text-gray-400 mt-1">
                  Minimum: 500 FCFA • Maximum: 1,000,000 FCFA
                </div>
              </div>
              
              {/* Numéro de téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={depositForm.phoneNumber}
                  onChange={(e) => handleDepositPhoneChange(e.target.value)}
                  className={`w-full p-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    depositForm.phoneNumber && !validatePhone(depositForm.phoneNumber)
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-600 focus:border-blue-500'
                  }`}
                  placeholder="074XXXXXX ou 062XXXXXX"
                  disabled={loading || depositInProgress}
                />
                
                {/* Validation feedback */}
                {depositForm.phoneNumber && (
                  <div className="mt-2 text-sm">
                    {validatePhone(depositForm.phoneNumber) ? (
                      <div className="flex items-center text-green-400">
                        <span>✓</span>
                        <span className="ml-1">
                          Opérateur: {getOperatorFromPhone(depositForm.phoneNumber) === 'airtel' ? 'Airtel Money' : 'Moov Money'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-400">
                        <span>⚠️</span>
                        <span className="ml-1">Format invalide</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Barre de progression */}
              {depositInProgress && (
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Vérification du paiement</span>
                    <span className="text-sm text-blue-400">{depositProgress.remaining}s</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((60 - depositProgress.remaining) / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Messages de statut */}
              {depositStatus && (
                <div className={`p-3 rounded-lg border text-sm ${
                  depositStatus.includes('✅') ? 'border-green-500 bg-green-500/10 text-green-400' :
                  depositStatus.includes('❌') ? 'border-red-500 bg-red-500/10 text-red-400' :
                  depositStatus.includes('⏰') ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400' :
                  'border-blue-500 bg-blue-500/10 text-blue-400'
                }`}>
                  {depositStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading || 
                  depositInProgress || 
                  !depositForm.amount || 
                  !depositForm.phoneNumber || 
                  !validatePhone(depositForm.phoneNumber)
                }
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  loading || depositInProgress || !depositForm.amount || !depositForm.phoneNumber || !validatePhone(depositForm.phoneNumber)
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading || depositInProgress ? (
                  <div className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⏳</span>
                    {depositInProgress ? 'Vérification...' : 'Traitement...'}
                  </div>
                ) : (
                  <>
                    💰 Déposer {depositForm.amount && `${parseInt(depositForm.amount).toLocaleString()} FCFA`}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Formulaire de retrait */}
        {activeTab === 'withdraw' && (
          <div className="space-y-6">
            <form onSubmit={handleWithdraw} className="space-y-4">
              
              {/* Méthodes de paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Méthode de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {methods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setWithdrawForm({...withdrawForm, method: method.id})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        withdrawForm.method === method.id
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs opacity-75">{method.prefixes.join(', ')}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Montant */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Montant (FCFA)
                </label>
                <input
                  type="number"
                  min="1000"
                  max={user?.balance || 0}
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({...withdrawForm, amount: e.target.value})}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Montant à retirer"
                  disabled={loading}
                />
                <div className="text-xs text-gray-400 mt-1">
                  Minimum: 1,000 FCFA • Disponible: {formatAmount(user?.balance || 0)} FCFA
                </div>
              </div>

              {/* Numéro de téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={withdrawForm.phoneNumber}
                  onChange={(e) => handleWithdrawPhoneChange(e.target.value)}
                  className={`w-full p-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    withdrawForm.phoneNumber && !validatePhone(withdrawForm.phoneNumber)
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-600 focus:border-blue-500'
                  }`}
                  placeholder="074XXXXXX ou 062XXXXXX"
                  disabled={loading}
                />
              </div>

              {/* Calcul des frais */}
              {withdrawForm.amount && (
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Montant demandé:</span>
                      <span>{formatAmount(parseInt(withdrawForm.amount))} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Frais (2%, min 100 FCFA):</span>
                      <span>{formatAmount(calculateWithdrawFee(parseInt(withdrawForm.amount)))} FCFA</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-gray-600 pt-2">
                      <span>Total à déduire:</span>
                      <span>{formatAmount(parseInt(withdrawForm.amount) + calculateWithdrawFee(parseInt(withdrawForm.amount)))} FCFA</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !withdrawForm.amount || !withdrawForm.phoneNumber || !validatePhone(withdrawForm.phoneNumber)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  loading || !withdrawForm.amount || !withdrawForm.phoneNumber || !validatePhone(withdrawForm.phoneNumber)
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⏳</span>
                    Traitement...
                  </div>
                ) : (
                  <>
                    📉 Retirer {withdrawForm.amount && `${parseInt(withdrawForm.amount).toLocaleString()} FCFA`}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Historique des transactions */}
        {activeTab === 'history' && (
          <div>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📭</div>
                <div className="text-lg font-medium text-gray-300 mb-2">Aucune transaction</div>
                <div className="text-gray-400">Vos transactions apparaîtront ici</div>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-400">
                            {formatDate(transaction.created_at)}
                          </div>
                          {transaction.reference && (
                            <div className="text-xs text-gray-500 font-mono">
                              {transaction.reference}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          transaction.type === 'withdrawal' || transaction.type === 'game_bet' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {transaction.type === 'withdrawal' || transaction.type === 'game_bet' ? '-' : '+'}
                          {formatAmount(Math.abs(transaction.amount))} FCFA
                        </div>
                        <div className={`text-sm ${getStatusColor(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </div>
                        {transaction.fees > 0 && (
                          <div className="text-xs text-gray-400">
                            Frais: {formatAmount(transaction.fees)} FCFA
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions pour les transactions échouées */}
                    {transaction.status === 'failed' && transaction.type === 'deposit' && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <button
                          onClick={() => handleRetryTransaction(transaction)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          🔄 Réessayer
                        </button>
                      </div>
                    )}
                    
                    {/* Indicateur de polling */}
                    {pollingTransactions.includes(transaction.reference) && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <div className="flex items-center text-blue-400 text-sm">
                          <span className="animate-spin mr-2">🔄</span>
                          <span>Vérification en cours...</span>
                        </div>
                      </div>
                    )}
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