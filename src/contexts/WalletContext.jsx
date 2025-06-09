import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('useWallet must be used within a WalletProvider');
    }
    return {};
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const { user, updateUser, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [walletStats, setWalletStats] = useState(null);
  const [pollingTransactions, setPollingTransactions] = useState(new Set());
  
  // Référence pour les callbacks de polling actifs
  const pollingCallbacks = useRef(new Map());

  // Charger les transactions depuis l'API
  useEffect(() => {
    if (user) {
      loadTransactions();
      loadWalletStats();
    } else {
      setTransactions([]);
      setWalletStats(null);
      // Nettoyer le polling lors de la déconnexion
      clearAllPolling();
    }
  }, [user]);

  // Nettoyer le polling lors du démontage
  useEffect(() => {
    return () => clearAllPolling();
  }, []);

  // Charger les transactions
  const loadTransactions = async () => {
    try {
      const response = await api.getTransactions({ limit: 50 });
      setTransactions(response.transactions || []);
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
    }
  };

  // Charger les statistiques du portefeuille
  const loadWalletStats = async () => {
    try {
      const response = await api.getBalance();
      setWalletStats(response);
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    }
  };

  // Nettoyer tout le polling
  const clearAllPolling = () => {
    pollingCallbacks.current.forEach(stopFunction => {
      if (typeof stopFunction === 'function') {
        stopFunction();
      }
    });
    pollingCallbacks.current.clear();
    setPollingTransactions(new Set());
  };

  // Démarrer le polling d'une transaction avec callbacks
  const startTransactionPolling = (reference, callbacks = {}) => {
    const {
      onStatusUpdate,
      onSuccess,
      onFailure,
      onTimeout
    } = callbacks;

    // Ajouter à la liste des transactions en polling
    setPollingTransactions(prev => new Set([...prev, reference]));

    // Démarrer le polling via l'API service
    const stopPolling = api.startTransactionPolling(reference, {
      onStatusUpdate: (status) => {
        console.log(`📊 Status update pour ${reference}:`, status);
        
        // Mettre à jour la transaction dans la liste locale
        updateTransactionInList(reference, {
          status: status.status,
          processed_at: status.status === 'completed' ? new Date().toISOString() : null
        });

        if (onStatusUpdate) onStatusUpdate(status);
      },
      
      onSuccess: (status) => {
        console.log(`✅ Transaction réussie: ${reference}`);
        
        // Retirer du polling
        setPollingTransactions(prev => {
          const newSet = new Set(prev);
          newSet.delete(reference);
          return newSet;
        });
        pollingCallbacks.current.delete(reference);

        // Mettre à jour la transaction et rafraîchir le solde
        updateTransactionInList(reference, {
          status: 'completed',
          processed_at: new Date().toISOString()
        });

        // Rafraîchir les données utilisateur
        refreshUser();
        loadWalletStats();

        if (onSuccess) onSuccess(status);
      },

      onFailure: (status) => {
        console.log(`❌ Transaction échouée: ${reference}`);
        
        // Retirer du polling
        setPollingTransactions(prev => {
          const newSet = new Set(prev);
          newSet.delete(reference);
          return newSet;
        });
        pollingCallbacks.current.delete(reference);

        // Mettre à jour la transaction
        updateTransactionInList(reference, {
          status: 'failed',
          processed_at: new Date().toISOString()
        });

        if (onFailure) onFailure(status);
      },

      onTimeout: (data) => {
        console.log(`⏰ Timeout pour ${reference}`);
        
        // Retirer du polling mais garder la transaction comme pending
        setPollingTransactions(prev => {
          const newSet = new Set(prev);
          newSet.delete(reference);
          return newSet;
        });
        pollingCallbacks.current.delete(reference);

        if (onTimeout) onTimeout(data);
      }
    });

    // Stocker la fonction d'arrêt
    pollingCallbacks.current.set(reference, stopPolling);

    return stopPolling;
  };

  // Mettre à jour une transaction dans la liste
  const updateTransactionInList = (reference, updates) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.reference === reference 
          ? { ...transaction, ...updates }
          : transaction
      )
    );
  };

  // Effectuer un dépôt avec la nouvelle logique E-Billing
  const deposit = async (amount, method, phoneNumber, callbacks = {}) => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    // Valider le numéro de téléphone
    if (!api.validateGabonPhone(phoneNumber)) {
      throw new Error('Numéro de téléphone invalide. Utilisez le format 074XXXXXX ou 062XXXXXX');
    }

    // Vérifier que l'opérateur correspond
    const detectedOperator = api.getOperatorFromPhone(phoneNumber);
    if (detectedOperator !== method) {
      throw new Error(`Le numéro ${phoneNumber} ne correspond pas à l'opérateur ${method}`);
    }
    
    setLoading(true);
    
    try {
      const response = await api.deposit({
        amount,
        method,
        phoneNumber
      });

      if (response.success) {
        // Ajouter la transaction à la liste locale
        const newTransaction = {
          id: response.transaction.id,
          reference: response.transaction.reference,
          type: 'deposit',
          amount: amount,
          status: 'pending',
          payment_method: method,
          phone_number: phoneNumber,
          description: `Dépôt ${method}`,
          created_at: new Date().toISOString(),
          fees: 0
        };

        setTransactions(prev => [newTransaction, ...prev]);

        // Démarrer le polling pour cette transaction
        const stopPolling = startTransactionPolling(
          response.transaction.reference,
          {
            onStatusUpdate: (status) => {
              console.log('Mise à jour du statut:', status);
              if (callbacks.onStatusUpdate) {
                callbacks.onStatusUpdate(status);
              }
            },
            onSuccess: (status) => {
              console.log('✅ Dépôt réussi!');
              if (callbacks.onSuccess) {
                callbacks.onSuccess(status);
              }
            },
            onFailure: (status) => {
              console.log('❌ Dépôt échoué');
              if (callbacks.onFailure) {
                callbacks.onFailure(status);
              }
            },
            onTimeout: () => {
              console.log('⏰ Timeout du dépôt');
              if (callbacks.onTimeout) {
                callbacks.onTimeout();
              }
            }
          }
        );

        return { 
          success: true, 
          transaction: newTransaction,
          message: response.message,
          stopPolling
        };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Erreur de dépôt:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Effectuer un retrait (logique inchangée mais améliorée)
  const withdraw = async (amount, method, phoneNumber) => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    // Valider le numéro de téléphone
    if (!api.validateGabonPhone(phoneNumber)) {
      throw new Error('Numéro de téléphone invalide');
    }

    // Vérifier que l'opérateur correspond
    const detectedOperator = api.getOperatorFromPhone(phoneNumber);
    if (detectedOperator !== method) {
      throw new Error(`Le numéro ne correspond pas à l'opérateur ${method}`);
    }

    // Vérifier le solde disponible
    if (user.balance < amount) {
      throw new Error('Solde insuffisant');
    }
    
    setLoading(true);
    
    try {
      const response = await api.withdraw({
        amount,
        method,
        phoneNumber
      });

      if (response.success) {
        // Mettre à jour le solde local immédiatement
        const fee = response.fee || response.transaction?.fee || 0;
        const totalDeduction = amount + fee;
        
        updateUser({
          balance: user.balance - totalDeduction
        });

        // Ajouter la transaction à la liste locale
        const newTransaction = {
          id: response.transaction.id,
          reference: response.transaction.reference,
          type: 'withdrawal',
          amount: -amount,
          status: 'processing',
          payment_method: method,
          phone_number: phoneNumber,
          description: `Retrait ${method}`,
          created_at: new Date().toISOString(),
          fees: fee
        };

        setTransactions(prev => [newTransaction, ...prev]);

        return { success: true, transaction: newTransaction };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Erreur de retrait:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Vérifier manuellement le statut d'une transaction
  const checkTransactionStatus = async (reference) => {
    try {
      const status = await api.getTransactionStatus(reference);
      
      // Mettre à jour la transaction dans la liste locale
      updateTransactionInList(reference, {
        status: status.status,
        processed_at: status.processed_at
      });

      // Si la transaction est complétée, rafraîchir les données
      if (status.status === 'completed') {
        refreshUser();
        loadWalletStats();
      }

      return status;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      return null;
    }
  };

  // Réessayer une transaction échouée
  const retryTransaction = async (originalTransaction) => {
    if (originalTransaction.type === 'deposit') {
      return await deposit(
        originalTransaction.amount,
        originalTransaction.payment_method,
        originalTransaction.phone_number
      );
    }
    throw new Error('Type de transaction non supporté pour retry');
  };

  // Ajouter des gains de jeu (pour compatibilité avec l'ancien code)
  const addGameWinnings = (amount, gameType = 'game') => {
    if (!user) return;

    // Mettre à jour le solde local
    updateUser({
      balance: user.balance + amount
    });

    // Ajouter une transaction locale (elle sera synchronisée lors du prochain chargement)
    const transaction = {
      id: 'local_' + Date.now(),
      reference: 'WIN-' + Date.now(),
      type: 'game_win',
      amount: amount,
      method: 'game',
      description: `Gains de partie ${gameType}`,
      fees: 0,
      status: 'completed',
      created_at: new Date().toISOString()
    };

    setTransactions(prev => [transaction, ...prev]);

    return transaction;
  };

  // Déduire une mise de jeu (pour compatibilité avec l'ancien code)
  const deductGameBet = (amount, gameType = 'game') => {
    if (!user || user.balance < amount) return false;

    // Mettre à jour le solde local
    updateUser({
      balance: user.balance - amount
    });

    // Ajouter une transaction locale
    const transaction = {
      id: 'local_' + Date.now(),
      reference: 'BET-' + Date.now(),
      type: 'game_bet',
      amount: -amount,
      method: 'game',
      description: `Mise de partie ${gameType}`,
      fees: 0,
      status: 'completed',
      created_at: new Date().toISOString()
    };

    setTransactions(prev => [transaction, ...prev]);

    return transaction;
  };

  // Obtenir les statistiques du portefeuille
  const getWalletStats = () => {
    if (walletStats) {
      return {
        totalDeposits: walletStats.total_deposited || 0,
        totalWithdrawals: walletStats.total_withdrawn || 0,
        totalGameWins: walletStats.total_won || 0,
        totalGameBets: walletStats.total_lost || 0,
        totalFees: 0, // Calculé côté frontend si nécessaire
        netGameProfit: (walletStats.total_won || 0) - (walletStats.total_lost || 0),
        transactionCount: transactions.length,
        balance: walletStats.balance || 0,
        bonusBalance: walletStats.bonus_balance || 0,
        availableBalance: walletStats.available_balance || 0
      };
    }

    // Calcul local en cas d'absence des stats serveur
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    
    const totalDeposits = completedTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = completedTransactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalGameWins = completedTransactions
      .filter(t => t.type === 'game_win')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalGameBets = completedTransactions
      .filter(t => t.type === 'game_bet')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalFees = completedTransactions
      .reduce((sum, t) => sum + (t.fees || 0), 0);

    return {
      totalDeposits,
      totalWithdrawals,
      totalGameWins,
      totalGameBets,
      totalFees,
      netGameProfit: totalGameWins - totalGameBets,
      transactionCount: completedTransactions.length,
      balance: user?.balance || 0,
      bonusBalance: user?.bonus_balance || 0,
      availableBalance: user?.balance || 0
    };
  };

  // Rafraîchir les données
  const refreshWallet = async () => {
    await Promise.all([
      loadTransactions(),
      loadWalletStats(),
      refreshUser()
    ]);
  };

  // Obtenir les transactions en cours de polling
  const getPollingTransactions = () => {
    return transactions.filter(t => pollingTransactions.has(t.reference));
  };

  // Arrêter le polling d'une transaction spécifique
  const stopTransactionPolling = (reference) => {
    const stopFunction = pollingCallbacks.current.get(reference);
    if (stopFunction) {
      stopFunction();
      pollingCallbacks.current.delete(reference);
      setPollingTransactions(prev => {
        const newSet = new Set(prev);
        newSet.delete(reference);
        return newSet;
      });
    }
  };

  const value = {
    // États
    transactions,
    loading,
    walletStats,
    pollingTransactions: Array.from(pollingTransactions),
    
    // Actions principales
    deposit,
    withdraw,
    checkTransactionStatus,
    retryTransaction,
    
    // Gestion du polling
    startTransactionPolling,
    stopTransactionPolling,
    getPollingTransactions,
    
    // Compatibilité jeux
    addGameWinnings,
    deductGameBet,
    
    // Utilitaires
    getWalletStats,
    refreshWallet,
    
    // Validation
    validatePhone: api.validateGabonPhone,
    getOperatorFromPhone: api.getOperatorFromPhone,
    formatAmount: api.formatAmount
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};