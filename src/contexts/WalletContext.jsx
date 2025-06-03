import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  const { user, updateUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les transactions depuis localStorage
  useEffect(() => {
    if (user) {
      const savedTransactions = localStorage.getItem(`lamap_transactions_${user.id}`);
      if (savedTransactions) {
        try {
          setTransactions(JSON.parse(savedTransactions));
        } catch (error) {
          console.error('Erreur lors du chargement des transactions:', error);
        }
      }
    }
  }, [user]);

  // Sauvegarder les transactions dans localStorage
  useEffect(() => {
    if (user && transactions.length > 0) {
      localStorage.setItem(`lamap_transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  // Ajouter une transaction
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Math.random().toString(36).substring(2, 9),
      userId: user?.id,
      timestamp: new Date().toISOString(),
      status: 'pending',
      ...transaction
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  // Mettre à jour le statut d'une transaction
  const updateTransactionStatus = (transactionId, status, details = {}) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === transactionId 
          ? { ...t, status, ...details, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  // Simuler un dépôt Mobile Money
  const deposit = async (amount, method, phoneNumber) => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    setLoading(true);
    
    try {
      // Validation
      if (amount < 500) throw new Error('Montant minimum : 500 FCFA');
      if (amount > 500000) throw new Error('Montant maximum : 500,000 FCFA');
      if (!phoneNumber) throw new Error('Numéro de téléphone requis');

      // Créer la transaction
      const transaction = addTransaction({
        type: 'deposit',
        amount,
        method,
        phoneNumber,
        description: `Recharge ${method}`,
        fees: 0 // Pas de frais pour les dépôts
      });

      // Simuler le traitement (2-5 secondes)
      const processingTime = Math.random() * 3000 + 2000;
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Simuler succès/échec (95% de succès)
      const success = Math.random() > 0.05;

      if (success) {
        // Mettre à jour la transaction
        updateTransactionStatus(transaction.id, 'completed', {
          completedAt: new Date().toISOString(),
          transactionRef: `TXN${Date.now()}`
        });

        // Mettre à jour le solde utilisateur
        updateUser({
          balance: user.balance + amount
        });

        return { success: true, transaction };
      } else {
        // Échec de la transaction
        updateTransactionStatus(transaction.id, 'failed', {
          failedAt: new Date().toISOString(),
          errorMessage: 'Échec du paiement Mobile Money'
        });

        return { success: false, error: 'Échec du paiement' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Simuler un retrait
  const withdraw = async (amount, method, phoneNumber) => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    setLoading(true);
    
    try {
      // Validation
      if (amount < 1000) throw new Error('Montant minimum : 1,000 FCFA');
      if (amount > user.balance) throw new Error('Solde insuffisant');
      if (!phoneNumber) throw new Error('Numéro de téléphone requis');

      // Calculer les frais (2% du montant, minimum 100 FCFA)
      const fees = Math.max(Math.round(amount * 0.02), 100);
      const totalDeduction = amount + fees;

      if (totalDeduction > user.balance) {
        throw new Error(`Solde insuffisant (${totalDeduction} FCFA requis avec les frais)`);
      }

      // Créer la transaction
      const transaction = addTransaction({
        type: 'withdraw',
        amount,
        method,
        phoneNumber,
        description: `Retrait ${method}`,
        fees,
        totalDeduction
      });

      // Déduire immédiatement le montant (retrait instantané côté utilisateur)
      updateUser({
        balance: user.balance - totalDeduction
      });

      // Simuler le traitement (plus long pour les retraits: 5-10 secondes)
      const processingTime = Math.random() * 5000 + 5000;
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Simuler succès/échec (90% de succès pour les retraits)
      const success = Math.random() > 0.1;

      if (success) {
        updateTransactionStatus(transaction.id, 'completed', {
          completedAt: new Date().toISOString(),
          transactionRef: `WTH${Date.now()}`
        });

        return { success: true, transaction };
      } else {
        // En cas d'échec, rembourser l'utilisateur
        updateTransactionStatus(transaction.id, 'failed', {
          failedAt: new Date().toISOString(),
          errorMessage: 'Échec du transfert'
        });

        updateUser({
          balance: user.balance + totalDeduction
        });

        return { success: false, error: 'Échec du retrait, montant remboursé' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Ajouter des gains de jeu
  const addGameWinnings = (amount, gameType = 'game') => {
    if (!user) return;

    const transaction = addTransaction({
      type: 'game_win',
      amount,
      method: 'game',
      description: `Gains de partie ${gameType}`,
      fees: 0,
      status: 'completed',
      completedAt: new Date().toISOString()
    });

    updateUser({
      balance: user.balance + amount,
      stats: {
        ...user.stats,
        totalEarnings: (user.stats?.totalEarnings || 0) + amount
      }
    });

    return transaction;
  };

  // Déduire une mise de jeu
  const deductGameBet = (amount, gameType = 'game') => {
    if (!user || user.balance < amount) return false;

    const transaction = addTransaction({
      type: 'game_bet',
      amount: -amount,
      method: 'game',
      description: `Mise de partie ${gameType}`,
      fees: 0,
      status: 'completed',
      completedAt: new Date().toISOString()
    });

    updateUser({
      balance: user.balance - amount
    });

    return transaction;
  };

  // Obtenir les statistiques du portefeuille
  const getWalletStats = () => {
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    
    const totalDeposits = completedTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = completedTransactions
      .filter(t => t.type === 'withdraw')
      .reduce((sum, t) => sum + t.amount, 0);
    
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

  const value = {
    transactions,
    loading,
    deposit,
    withdraw,
    addGameWinnings,
    deductGameBet,
    getWalletStats,
    addTransaction,
    updateTransactionStatus
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};