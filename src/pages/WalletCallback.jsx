import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';

export default function WalletCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { refreshWallet, checkTransactionStatus } = useWallet();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Traitement du paiement en cours...');
  const [details, setDetails] = useState(null);
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const handleCallback = async () => {
      // Récupérer les paramètres selon la nouvelle logique E-Billing
      const paymentStatus = searchParams.get('payment_status') || searchParams.get('payment') || searchParams.get('status');
      const reference = searchParams.get('reference') || searchParams.get('invoice') || searchParams.get('bill_id');
      const timestamp = searchParams.get('timestamp');
      
      try {
        console.log('Callback reçu:', { paymentStatus, reference, timestamp });

        if (paymentStatus === 'success' || paymentStatus === 'completed' || paymentStatus === 'paid') {
          setStatus('success');
          setMessage('🎉 Paiement réussi ! Votre compte a été crédité.');
          
          // Si on a une référence, vérifier le statut de la transaction
          if (reference) {
            try {
              const transactionStatus = await checkTransactionStatus(reference);
              if (transactionStatus) {
                setDetails({
                  reference: transactionStatus.reference,
                  amount: transactionStatus.amount,
                  status: transactionStatus.status,
                  processed_at: transactionStatus.processed_at
                });
              }
            } catch (error) {
              console.warn('Impossible de récupérer les détails de la transaction:', error);
            }
          }
          
          // Rafraîchir les données utilisateur
          await Promise.all([
            refreshUser(),
            refreshWallet()
          ]);
          
        } else if (paymentStatus === 'failed' || paymentStatus === 'error' || paymentStatus === 'cancelled') {
          setStatus('error');
          setMessage('❌ Le paiement a échoué ou a été annulé.');
          
          if (reference) {
            setDetails({
              reference,
              canRetry: true
            });
          }
          
        } else if (paymentStatus === 'pending' || paymentStatus === 'processing') {
          setStatus('warning');
          setMessage('⏳ Paiement en cours de traitement. Veuillez patienter...');
          
          // Si on a une référence, démarrer une vérification périodique
          if (reference) {
            startPeriodicCheck(reference);
          }
          
        } else {
          setStatus('warning');
          setMessage('⚠️ Statut de paiement inconnu. Vérifiez votre historique de transactions.');
          
          if (reference) {
            setDetails({ reference });
          }
        }
      } catch (error) {
        console.error('Erreur lors du traitement du callback:', error);
        setStatus('error');
        setMessage('🚨 Une erreur est survenue lors du traitement du paiement.');
      }
    };

    // Démarrer le countdown de redirection
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/wallet');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    handleCallback();

    // Cleanup
    return () => {
      clearInterval(countdownInterval);
    };
  }, [searchParams, navigate, refreshUser, refreshWallet, checkTransactionStatus]);

  // Vérification périodique pour les paiements en cours
  const startPeriodicCheck = (reference) => {
    let attempts = 0;
    const maxAttempts = 12; // 12 × 5s = 60s

    const checkInterval = setInterval(async () => {
      attempts++;
      
      try {
        const transactionStatus = await checkTransactionStatus(reference);
        
        if (transactionStatus) {
          if (transactionStatus.status === 'completed') {
            clearInterval(checkInterval);
            setStatus('success');
            setMessage('✅ Paiement confirmé ! Votre compte a été crédité.');
            setDetails(transactionStatus);
            
            // Rafraîchir les données
            await Promise.all([refreshUser(), refreshWallet()]);
            
          } else if (transactionStatus.status === 'failed') {
            clearInterval(checkInterval);
            setStatus('error');
            setMessage('❌ Le paiement a échoué.');
            setDetails(transactionStatus);
          }
        }
      } catch (error) {
        console.warn('Erreur lors de la vérification:', error);
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        if (status === 'warning') {
          setMessage('⏰ Vérification terminée. Consultez votre historique de transactions.');
        }
      }
    }, 5000); // Vérifier toutes les 5 secondes
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '⏳';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const handleRetry = () => {
    navigate('/wallet?tab=deposit');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
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

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">{getStatusIcon()}</div>
          <h1 className="text-2xl font-bold mb-4">Résultat du paiement</h1>
          <p className={`text-lg mb-6 ${getStatusColor()}`}>
            {message}
          </p>
        </div>

        {/* Détails de la transaction */}
        {details && (
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-300 mb-3">Détails de la transaction</h3>
            <div className="space-y-2 text-sm">
              {details.reference && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Référence:</span>
                  <span className="text-white font-mono">{details.reference}</span>
                </div>
              )}
              {details.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Montant:</span>
                  <span className="text-white">{formatAmount(details.amount)} FCFA</span>
                </div>
              )}
              {details.status && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Statut:</span>
                  <span className={`font-medium ${
                    details.status === 'completed' ? 'text-green-400' :
                    details.status === 'failed' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {details.status === 'completed' ? 'Terminé' :
                     details.status === 'failed' ? 'Échoué' :
                     'En cours'}
                  </span>
                </div>
              )}
              {details.processed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Traité le:</span>
                  <span className="text-white">{formatDate(details.processed_at)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spinner pour les paiements en cours */}
        {status === 'processing' && (
          <div className="text-center mb-6">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-400">Vérification en cours...</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/wallet')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            💰 Aller au portefeuille
          </button>
          
          {details?.canRetry && (
            <button
              onClick={handleRetry}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              🔄 Réessayer le paiement
            </button>
          )}
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            🏠 Retour à l'accueil
          </button>
        </div>

        {/* Countdown */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Redirection automatique dans {countdown} seconde{countdown !== 1 ? 's' : ''}...
          <br />
          <button 
            onClick={() => setCountdown(0)}
            className="text-blue-400 hover:text-blue-300 mt-1"
          >
            Aller maintenant
          </button>
        </div>

        {/* Debug info en développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-900 border border-gray-700 rounded text-xs">
            <div className="font-mono text-gray-400">
              Debug - Paramètres reçus:
              <pre className="mt-1 text-gray-500">
                {JSON.stringify(Object.fromEntries(searchParams), null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}