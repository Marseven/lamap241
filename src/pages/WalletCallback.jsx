import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function WalletCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const payment = searchParams.get('payment');
    const invoice = searchParams.get('invoice');
    
    if (payment === 'success') {
      // Afficher un message de succès
      alert('Paiement réussi ! Votre compte sera crédité dans quelques instants.');
    } else {
      // Afficher un message d'erreur
      alert('Le paiement a échoué ou a été annulé.');
    }
    
    // Rediriger vers le portefeuille après 3 secondes
    setTimeout(() => {
      navigate('/wallet');
    }, 3000);
  }, [searchParams, navigate]);
  
  return (
    <div className="text-center p-8">
      <h2>Traitement du paiement...</h2>
      <p>Vous allez être redirigé vers votre portefeuille.</p>
    </div>
  );
}