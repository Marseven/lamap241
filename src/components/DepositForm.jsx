import React, { useState } from 'react';
import api from '../services/api';

export default function DepositForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'airtel',
    phone_number: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.initiateDeposit(formData);
      // La redirection vers E-Billing se fait automatiquement
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Erreur lors de l\'initialisation du dépôt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Montant (FCFA)</label>
        <input
          type="number"
          min="500"
          max="1000000"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          required
        />
      </div>
      
      <div>
        <label>Méthode de paiement</label>
        <select
          value={formData.payment_method}
          onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
        >
          <option value="airtel">Airtel Money</option>
          <option value="moov">Moov Money</option>
        </select>
      </div>
      
      <div>
        <label>Numéro de téléphone</label>
        <input
          type="tel"
          placeholder="074XXXXXXX"
          value={formData.phone_number}
          onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Redirection...' : 'Déposer'}
      </button>
    </form>
  );
}