import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

export default function DepositForm({ onSuccess, onError }) {
  const { 
    deposit, 
    loading, 
    validatePhone, 
    getOperatorFromPhone,
    pollingTransactions 
  } = useWallet();
  
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'airtel',
    phone_number: ''
  });
  
  const [status, setStatus] = useState('');
  const [detectedOperator, setDetectedOperator] = useState('');
  const [depositInProgress, setDepositInProgress] = useState(false);
  const [progress, setProgress] = useState({ elapsed: 0, remaining: 60 });

  // Validation en temps réel du numéro
  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone_number: value });
    
    if (validatePhone(value)) {
      const operator = getOperatorFromPhone(value);
      setDetectedOperator(operator);
      
      // Auto-sélectionner l'opérateur si différent
      if (operator && operator !== formData.payment_method) {
        setFormData(prev => ({ ...prev, payment_method: operator }));
      }
    } else {
      setDetectedOperator('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!formData.amount || !formData.phone_number) {
      setStatus('❌ Veuillez remplir tous les champs');
      if (onError) onError('Veuillez remplir tous les champs');
      return;
    }

    const amount = parseInt(formData.amount);
    if (amount < 500 || amount > 1000000) {
      setStatus('❌ Montant invalide (500 - 1,000,000 FCFA)');
      if (onError) onError('Montant invalide');
      return;
    }

    if (!validatePhone(formData.phone_number)) {
      setStatus('❌ Numéro de téléphone invalide');
      if (onError) onError('Numéro de téléphone invalide');
      return;
    }

    const operator = getOperatorFromPhone(formData.phone_number);
    if (operator !== formData.payment_method) {
      setStatus(`❌ Le numéro ne correspond pas à ${formData.payment_method}`);
      if (onError) onError('Opérateur ne correspond pas au numéro');
      return;
    }

    setDepositInProgress(true);
    setStatus('📱 Initialisation du paiement...');
    
    try {
      const result = await deposit(
        amount,
        formData.payment_method,
        formData.phone_number,
        {
          onStatusUpdate: (statusData) => {
            setProgress({
              elapsed: statusData.elapsed_time || 0,
              remaining: statusData.remaining_time || 60
            });
            setStatus(`🔄 Vérification du paiement... ${statusData.remaining_time || 60}s restantes`);
          },
          onSuccess: (statusData) => {
            setStatus('✅ Dépôt réussi ! Votre compte a été crédité.');
            setDepositInProgress(false);
            setFormData({ amount: '', payment_method: 'airtel', phone_number: '' });
            setDetectedOperator('');
            if (onSuccess) onSuccess(statusData);
          },
          onFailure: (statusData) => {
            setStatus('❌ Paiement échoué. Vous pouvez réessayer.');
            setDepositInProgress(false);
            if (onError) onError(statusData.message || 'Paiement échoué');
          },
          onTimeout: () => {
            setStatus('⏰ Vérification en cours... Cela peut prendre quelques minutes.');
            setDepositInProgress(false);
          }
        }
      );

      if (result.success) {
        setStatus(`📱 ${result.message}`);
      } else {
        setStatus(`❌ ${result.error}`);
        setDepositInProgress(false);
        if (onError) onError(result.error);
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setStatus(`❌ Erreur: ${error.message}`);
      setDepositInProgress(false);
      if (onError) onError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({ amount: '', payment_method: 'airtel', phone_number: '' });
    setStatus('');
    setDetectedOperator('');
    setDepositInProgress(false);
    setProgress({ elapsed: 0, remaining: 60 });
  };

  const quickAmounts = [500, 1000, 5000, 10000, 25000, 50000];

  return (
    <div className="deposit-form">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Méthodes de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Méthode de paiement
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({...formData, payment_method: 'airtel'})}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.payment_method === 'airtel'
                  ? 'border-red-500 bg-red-500/10 text-red-400'
                  : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">📱</div>
                <div className="font-medium">Airtel Money</div>
                <div className="text-xs opacity-75">074, 077, 076</div>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setFormData({...formData, payment_method: 'moov'})}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.payment_method === 'moov'
                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                  : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">💳</div>
                <div className="font-medium">Moov Money</div>
                <div className="text-xs opacity-75">062, 065, 066, 060</div>
              </div>
            </button>
          </div>
        </div>

        {/* Montants rapides */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Montants rapides
          </label>
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map(amount => (
              <button
                key={amount}
                type="button"
                onClick={() => setFormData({...formData, amount: amount.toString()})}
                className={`p-3 rounded-lg border transition-all text-sm ${
                  formData.amount === amount.toString()
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
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
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
            value={formData.phone_number}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={`w-full p-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
              formData.phone_number && !validatePhone(formData.phone_number)
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="074XXXXXX ou 062XXXXXX"
            disabled={loading || depositInProgress}
          />
          
          {/* Indicateur d'opérateur détecté */}
          {detectedOperator && (
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-gray-300 ml-1">
                Opérateur détecté: {detectedOperator === 'airtel' ? 'Airtel Money' : 'Moov Money'}
              </span>
            </div>
          )}
          
          {/* Message d'erreur de validation */}
          {formData.phone_number && !validatePhone(formData.phone_number) && (
            <div className="flex items-center mt-2 text-sm text-red-400">
              <span>⚠️</span>
              <span className="ml-1">Format invalide. Utilisez 074XXXXXX, 077XXXXXX, 076XXXXXX, 062XXXXXX, 065XXXXXX, 066XXXXXX ou 060XXXXXX</span>
            </div>
          )}
        </div>

        {/* Barre de progression pendant le polling */}
        {depositInProgress && (
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Vérification du paiement</span>
              <span className="text-sm text-blue-400">{progress.remaining}s</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((60 - progress.remaining) / 60) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Suivez les instructions sur votre téléphone pour finaliser le paiement
            </div>
          </div>
        )}

        {/* Messages de statut */}
        {status && (
          <div className={`p-3 rounded-lg border text-sm ${
            status.includes('✅') ? 'border-green-500 bg-green-500/10 text-green-400' :
            status.includes('❌') ? 'border-red-500 bg-red-500/10 text-red-400' :
            status.includes('⏰') ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400' :
            'border-blue-500 bg-blue-500/10 text-blue-400'
          }`}>
            {status}
          </div>
        )}

        {/* Transactions en cours */}
        {pollingTransactions.length > 0 && (
          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3">
            <div className="flex items-center text-blue-400 text-sm">
              <span className="animate-spin mr-2">🔄</span>
              <span>{pollingTransactions.length} transaction(s) en vérification</span>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={
              loading || 
              depositInProgress || 
              !formData.amount || 
              !formData.phone_number || 
              !validatePhone(formData.phone_number)
            }
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              loading || depositInProgress || !formData.amount || !formData.phone_number || !validatePhone(formData.phone_number)
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
                💰 Déposer {formData.amount && `${parseInt(formData.amount).toLocaleString()} FCFA`}
              </>
            )}
          </button>

          {(status || depositInProgress) && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              ↻ Reset
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-400 space-y-1">
          <div>• Vous recevrez une notification sur votre téléphone</div>
          <div>• Suivez les instructions pour finaliser le paiement</div>
          <div>• Le crédit sera automatiquement ajouté à votre compte</div>
        </div>
      </form>
    </div>
  );
}