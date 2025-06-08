// src/components/NotificationManager.jsx
import React, { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import NotificationToast from './NotificationToast';

export default function NotificationManager() {
  const { notifications, removeNotification, walletNotification, success, error, warning, info } = useNotifications();
  const { user } = useAuth();
  const { transactions } = useWallet();

  // Surveiller les changements de solde
  useEffect(() => {
    if (user && user.balance !== undefined) {
      const previousBalance = localStorage.getItem('previous_balance');
      const currentBalance = user.balance;
      
      if (previousBalance !== null && parseFloat(previousBalance) !== currentBalance) {
        const difference = currentBalance - parseFloat(previousBalance);
        
        if (difference > 0) {
          walletNotification(`Votre solde a augmenté de ${new Intl.NumberFormat('fr-FR').format(difference)} FCFA`, {
            duration: 6000
          });
        } else if (difference < 0) {
          walletNotification(`Votre solde a diminué de ${new Intl.NumberFormat('fr-FR').format(Math.abs(difference))} FCFA`, {
            duration: 5000
          });
        }
      }
      
      localStorage.setItem('previous_balance', currentBalance.toString());
    }
  }, [user?.balance, walletNotification]);

  // Surveiller les nouvelles transactions
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const lastTransaction = transactions[0];
      const lastNotifiedTransaction = localStorage.getItem('last_notified_transaction');
      
      if (lastTransaction.id !== lastNotifiedTransaction) {
        switch (lastTransaction.status) {
          case 'completed':
            if (lastTransaction.type === 'deposit') {
              success(`Dépôt de ${new Intl.NumberFormat('fr-FR').format(lastTransaction.amount)} FCFA confirmé !`, {
                title: 'Recharge réussie',
                duration: 8000
              });
            } else if (lastTransaction.type === 'withdraw') {
              success(`Retrait de ${new Intl.NumberFormat('fr-FR').format(lastTransaction.amount)} FCFA effectué !`, {
                title: 'Retrait réussi',
                duration: 8000
              });
            } else if (lastTransaction.type === 'game_win') {
              success(`🎉 Vous avez gagné ${new Intl.NumberFormat('fr-FR').format(lastTransaction.amount)} FCFA !`, {
                title: 'Gains de partie',
                duration: 10000,
                persistent: true
              });
            }
            break;
            
          case 'failed':
            if (lastTransaction.type === 'deposit') {
              error(`Échec du dépôt de ${new Intl.NumberFormat('fr-FR').format(lastTransaction.amount)} FCFA`, {
                title: 'Dépôt échoué',
                duration: 8000,
                action: {
                  text: 'Réessayer',
                  callback: () => {
                    window.location.href = '/wallet';
                  }
                }
              });
            } else if (lastTransaction.type === 'withdraw') {
              error(`Échec du retrait de ${new Intl.NumberFormat('fr-FR').format(lastTransaction.amount)} FCFA`, {
                title: 'Retrait échoué',
                duration: 8000
              });
            }
            break;
            
          case 'pending':
            if (lastTransaction.type === 'deposit') {
              info(`Dépôt de ${new Intl.NumberFormat('fr-FR').format(lastTransaction.amount)} FCFA en cours...`, {
                title: 'Traitement en cours',
                duration: 6000
              });
            } else if (lastTransaction.type === 'withdraw') {
              info(`Retrait de ${new Intl.NumberFormat('fr-FR').format(lastTransaction.amount)} FCFA en cours...`, {
                title: 'Traitement en cours',
                duration: 6000
              });
            }
            break;
        }
        
        localStorage.setItem('last_notified_transaction', lastTransaction.id);
      }
    }
  }, [transactions, success, error, info]);

  // Notifications de bienvenue pour nouveaux utilisateurs
  useEffect(() => {
    if (user && !localStorage.getItem('welcome_shown')) {
      setTimeout(() => {
        success(`Bienvenue ${user.pseudo} ! 🎉`, {
          title: 'Compte créé',
          duration: 8000,
          action: {
            text: 'Découvrir',
            callback: () => {
              window.location.href = '/rules';
            }
          }
        });
        
        if (user.balance >= 1000) {
          walletNotification('Vous avez reçu votre bonus de bienvenue de 1000 FCFA !', {
            duration: 10000
          });
        }
        
        localStorage.setItem('welcome_shown', 'true');
      }, 2000);
    }
  }, [user, success, walletNotification]);

  // Notification pour solde faible
  useEffect(() => {
    if (user && user.balance < 500 && user.balance > 0) {
      const lastLowBalanceWarning = localStorage.getItem('last_low_balance_warning');
      const now = Date.now();
      
      // Ne montrer qu'une fois par heure
      if (!lastLowBalanceWarning || now - parseInt(lastLowBalanceWarning) > 3600000) {
        warning('Votre solde est faible. Pensez à recharger pour continuer à jouer !', {
          title: 'Solde faible',
          duration: 8000,
          action: {
            text: 'Recharger',
            callback: () => {
              window.location.href = '/wallet';
            }
          }
        });
        
        localStorage.setItem('last_low_balance_warning', now.toString());
      }
    }
  }, [user?.balance, warning]);

  // Notifications de connexion/déconnexion
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // L'utilisateur a quitté l'onglet
        localStorage.setItem('last_active', Date.now().toString());
      } else {
        // L'utilisateur est revenu
        const lastActive = localStorage.getItem('last_active');
        if (lastActive) {
          const timeDiff = Date.now() - parseInt(lastActive);
          
          // Si absent plus de 30 minutes
          if (timeDiff > 1800000) {
            info('Bon retour ! Vos parties vous attendent.', {
              title: 'De retour',
              duration: 5000
            });
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [info]);

  // Notifications de maintenance (simulées)
  useEffect(() => {
    const checkMaintenanceStatus = () => {
      // Ici vous pourriez vérifier le statut de maintenance via une API
      const isMaintenanceScheduled = false; // Remplacer par un appel API
      
      if (isMaintenanceScheduled) {
        warning('Maintenance programmée dans 30 minutes. Finissez vos parties en cours.', {
          title: 'Maintenance',
          persistent: true,
          duration: 0
        });
      }
    };

    // Vérifier toutes les 10 minutes
    const interval = setInterval(checkMaintenanceStatus, 600000);
    return () => clearInterval(interval);
  }, [warning]);

  // Notifications de mise à jour de l'app
  useEffect(() => {
    const checkAppVersion = () => {
      const currentVersion = '1.0.0'; // Version actuelle
      const latestVersion = localStorage.getItem('latest_app_version') || '1.0.0';
      
      if (currentVersion !== latestVersion) {
        info('Une nouvelle version de l\'application est disponible !', {
          title: 'Mise à jour',
          persistent: true,
          action: {
            text: 'Actualiser',
            callback: () => {
              window.location.reload();
            }
          }
        });
      }
    };

    // Vérifier au démarrage et toutes les heures
    checkAppVersion();
    const interval = setInterval(checkAppVersion, 3600000);
    return () => clearInterval(interval);
  }, [info]);

  // Notifications d'encouragement pour les joueurs inactifs
  useEffect(() => {
    if (user) {
      const lastGameTime = localStorage.getItem('last_game_time');
      const now = Date.now();
      
      if (lastGameTime) {
        const timeSinceLastGame = now - parseInt(lastGameTime);
        
        // Si pas joué depuis 24h
        if (timeSinceLastGame > 86400000) {
          setTimeout(() => {
            info('Cela fait un moment ! Que diriez-vous d\'une petite partie ?', {
              title: 'Envie de jouer ?',
              duration: 8000,
              action: {
                text: 'Jouer maintenant',
                callback: () => {
                  window.location.href = '/rooms';
                }
              }
            });
          }, 5000);
        }
      }
    }
  }, [user, info]);

  return (
    <NotificationToast 
      notifications={notifications} 
      onRemove={removeNotification} 
    />
  );
}