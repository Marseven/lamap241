import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';

export default function WalletCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { refreshWallet } = useWallet();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Traitement du paiement en cours...');
  
  useEffect(() => {
    const handleCallback = async () => {
      const payment = searchParams.get('payment');
      const invoice = searchParams.get('invoice');
      
      try {
        if (payment === 'success') {
          setStatus('success');
          setMessage('Paiement réussi ! Votre compte va être crédité dans quelques instants.');
          
          // Rafraîchir les données utilisateur
          await Promise.all([
            refreshUser(),
            refreshWallet()
          ]);
          
        } else if (payment === 'failed') {
          setStatus('error');
          setMessage('Le paiement a échoué ou a été annulé. Veuillez réessayer.');
        } else {
          setStatus('warning');
          setMessage('Statut de paiement inconnu. Vérifiez votre historique de transactions.');
        }
      } catch (error) {
        console.error('Erreur lors du traitement du callback:', error);
        setStatus('error');
        setMessage('Une erreur est survenue lors du traitement.');
      }
      
      // Rediriger vers le portefeuille après 5 secondes
      setTimeout(() => {
        navigate('/wallet');
      }, 5000);
    };

    handleCallback();
  }, [searchParams, navigate, refreshUser, refreshWallet]);
  
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

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">{getStatusIcon()}</div>
          <h1 className="text-2xl font-bold mb-4">Traitement du paiement</h1>
          <p className={`text-lg mb-6 ${getStatusColor()}`}>
            {message}
          </p>
        </div>

        {status === 'processing' && (
          <div className="mb-6">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-400">Veuillez patienter...</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/wallet')}
            className="w-full btn-primary"
          >
            🏠 Aller au portefeuille
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full btn-primary bg-gray-700"
          >
            🎮 Retour à l'accueil
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          Redirection automatique dans 5 secondes...
        </div>
      </div>
    </div>
  );
}