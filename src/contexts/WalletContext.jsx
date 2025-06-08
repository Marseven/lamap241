import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Charger les transactions depuis l'API
  useEffect(() => {
    if (user) {
      loadTransactions();
      loadWalletStats();
    } else {
      setTransactions([]);
      setWalletStats(null);
    }
  }, [user]);

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

  // Effectuer un dépôt
  const deposit = async (amount, method, phoneNumber) => {
    if (!user) throw new Error('Utilisateur non connecté');
    
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
          description: `Recharge ${method}`,
          created_at: new Date().toISOString(),
          fees: 0
        };

        setTransactions(prev => [newTransaction, ...prev]);

        // Si on a une URL de paiement, rediriger
        if (response.payment_url && response.invoice_number) {
          redirectToPayment(response.payment_url, response.invoice_number);
        }

        return { success: true, transaction: newTransaction };
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

  // Rediriger vers la page de paiement E-Billing
  const redirectToPayment = (paymentUrl, invoiceNumber) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl;

    const invoiceInput = document.createElement('input');
    invoiceInput.type = 'hidden';
    invoiceInput.name = 'invoice_number';
    invoiceInput.value = invoiceNumber;

    const callbackInput = document.createElement('input');
    callbackInput.type = 'hidden';
    callbackInput.name = 'eb_callbackurl';
    callbackInput.value = `${window.location.origin}/wallet/callback`;

    form.appendChild(invoiceInput);
    form.appendChild(callbackInput);
    document.body.appendChild(form);
    form.submit();
  };

  // Effectuer un retrait
  const withdraw = async (amount, method, phoneNumber) => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    setLoading(true);
    
    try {
      const response = await api.withdraw({
        amount,
        method,
        phoneNumber
      });

      if (response.success) {
        // Mettre à jour le solde local immédiatement
        const fee = response.transaction.fee || 0;
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
        transactionCount: transactions.length
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
      transactionCount: completedTransactions.length
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

  // Obtenir le statut d'une transaction
  const getTransactionStatus = async (reference) => {
    try {
      const response = await api.getTransactions({ reference });
      if (response.transactions && response.transactions.length > 0) {
        const transaction = response.transactions[0];
        
        // Mettre à jour la transaction dans la liste locale
        setTransactions(prev => 
          prev.map(t => 
            t.reference === reference 
              ? { ...t, status: transaction.status }
              : t
          )
        );
        
        return transaction.status;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
    }
    return null;
  };

  const value = {
    transactions,
    loading,
    walletStats,
    deposit,
    withdraw,
    addGameWinnings,
    deductGameBet,
    getWalletStats,
    refreshWallet,
    getTransactionStatus
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};