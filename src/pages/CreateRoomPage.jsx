// src/pages/CreateRoomPage.jsx - Version mise à jour avec notifications
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameRoom } from '../contexts/GameRoomContext';
import { useGameNotifications } from '../hooks/useGameNotifications';

export default function CreateRoomPage() {
  const { user } = useAuth();
  const { createRoom, loading } = useGameRoom();
  const { 
    notifyGameStart, 
    notifyInsufficientFunds, 
    notifyGameError 
  } = useGameNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    bet: '1000',
    timeLimit: '300',
    allowSpectators: false,
    roundsToWin: '3'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la salle est requis';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    } else if (formData.name.trim().length > 30) {
      newErrors.name = 'Le nom ne peut pas dépasser 30 caractères';
    }

    const bet = parseInt(formData.bet);
    if (!bet || bet < 500) {
      newErrors.bet = 'Mise minimum : 500 FCFA';
    } else if (bet > 100000) {
      newErrors.bet = 'Mise maximum : 100,000 FCFA';
    } else if (bet > (user?.balance || 0)) {
      newErrors.bet = 'Solde insuffisant';
    }

    const timeLimit = parseInt(formData.timeLimit);
    if (timeLimit && (timeLimit < 60 || timeLimit > 1800)) {
      newErrors.timeLimit = 'Temps de jeu entre 1 et 30 minutes';
    }

    const rounds = parseInt(formData.roundsToWin);
    if (!rounds || rounds < 1 || rounds > 10) {
      newErrors.roundsToWin = 'Nombre de manches entre 1 et 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const bet = parseInt(formData.bet);
    
    // Vérifications supplémentaires avec notifications
    if (bet > (user?.balance || 0)) {
      notifyInsufficientFunds(bet, user?.balance || 0);
      return;
    }

    try {
      const roomData = {
        name: formData.name.trim(),
        bet: bet,
        timeLimit: parseInt(formData.timeLimit),
        allowSpectators: formData.allowSpectators,
        roundsToWin: parseInt(formData.roundsToWin)
      };

      const result = await createRoom(roomData);

      if (result.success) {
        notifyGameStart(result.room.name);
        navigate(`/game/${result.room.id}`);
      } else {
        notifyGameError(result.error);
      }
    } catch (error) {
      notifyGameError('Erreur lors de la création de la salle');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const quickBets = [500, 1000, 2000, 5000, 10000];
  const timeOptions = [
    { value: '180', label: '3 minutes' },
    { value: '300', label: '5 minutes' },
    { value: '600', label: '10 minutes' },
    { value: '900', label: '15 minutes' },
    { value: '1800', label: '30 minutes' },
    { value: '0', label: 'Pas de limite' }
  ];

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  return (
    <div className="create-room-page">
      {/* Header */}
      <div className="create-header">
        <Link to="/rooms" className="back-btn">
          ← Retour
        </Link>
        <h1 className="page-title">🎮 Créer une salle</h1>
        <div className="balance-display">
          {formatAmount(user?.balance || 0)} FCFA
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="create-form">
        
        {/* Nom de la salle */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">🏷️</span>
            Informations de base
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📝</span>
              Nom de la salle
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Ex: Bataille épique 🔥"
              maxLength="30"
              disabled={loading}
            />
            {errors.name && (
              <div className="error-message">{errors.name}</div>
            )}
            <div className="form-help">
              {formData.name.length}/30 caractères
            </div>
          </div>
        </div>

        {/* Mise */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">💰</span>
            Mise et enjeux
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">💵</span>
              Mise par joueur
            </label>
            
            {/* Boutons de mise rapide */}
            <div className="quick-bets">
              {quickBets.map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setFormData({...formData, bet: amount.toString()})}
                  className={`quick-bet-btn ${formData.bet === amount.toString() ? 'active' : ''}`}
                  disabled={loading || amount > (user?.balance || 0)}
                >
                  {formatAmount(amount)}
                </button>
              ))}
            </div>
            
            <input
              type="number"
              name="bet"
              value={formData.bet}
              onChange={handleInputChange}
              className={`form-input ${errors.bet ? 'error' : ''}`}
              placeholder="Montant personnalisé"
              min="500"
              max="100000"
              disabled={loading}
            />
            {errors.bet && (
              <div className="error-message">{errors.bet}</div>
            )}
            
            {/* Calcul du pot */}
            {formData.bet && !isNaN(parseInt(formData.bet)) && (
              <div className="pot-calculation">
                <div className="pot-row">
                  <span>Mise totale (2 joueurs) :</span>
                  <span>{formatAmount(parseInt(formData.bet) * 2)} FCFA</span>
                </div>
                <div className="pot-row">
                  <span>Commission La Map (10%) :</span>
                  <span>-{formatAmount(Math.round(parseInt(formData.bet) * 2 * 0.1))} FCFA</span>
                </div>
                <div className="pot-row total">
                  <span>Gains du gagnant :</span>
                  <span>{formatAmount(Math.round(parseInt(formData.bet) * 2 * 0.9))} FCFA</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Paramètres de jeu */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">⚙️</span>
            Paramètres de jeu
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏆</span>
              Manches à gagner
            </label>
            <select
              name="roundsToWin"
              value={formData.roundsToWin}
              onChange={handleInputChange}
              className="form-select"
              disabled={loading}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num.toString()}>
                  Premier à {num} manche{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            {errors.roundsToWin && (
              <div className="error-message">{errors.roundsToWin}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">⏱️</span>
              Temps limite par partie
            </label>
            <select
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleInputChange}
              className="form-select"
              disabled={loading}
            >
              {timeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.timeLimit && (
              <div className="error-message">{errors.timeLimit}</div>
            )}
            <div className="form-help">
              Si le temps est écoulé, la partie se termine par égalité
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="allowSpectators"
                checked={formData.allowSpectators}
                onChange={handleInputChange}
                className="checkbox-input"
                disabled={loading}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                <span className="label-icon">👥</span>
                Autoriser les spectateurs
              </span>
            </label>
            <div className="form-help">
              Les autres joueurs pourront regarder votre partie
            </div>
          </div>
        </div>

        {/* Règles et avertissements */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">⚠️</span>
            Règles importantes
          </h3>
          
          <div className="rules-card">
            <div className="rule-item">
              <span className="rule-icon">🚫</span>
              <span className="rule-text">
                <strong>Pas d'abandon autorisé</strong> - Quitter en cours de partie = perte de la mise
              </span>
            </div>
            <div className="rule-item">
              <span className="rule-icon">💰</span>
              <span className="rule-text">
                <strong>Mise immédiate</strong> - Votre mise sera débitée dès la création
              </span>
            </div>
            <div className="rule-item">
              <span className="rule-icon">⏰</span>
              <span className="rule-text">
                <strong>Salle temporaire</strong> - Suppression automatique après 1h sans activité
              </span>
            </div>
            <div className="rule-item">
              <span className="rule-icon">🏆</span>
              <span className="rule-text">
                <strong>Gains instantanés</strong> - Le gagnant reçoit 90% du pot immédiatement
              </span>
            </div>
          </div>
        </div>

        {/* Bouton de création */}
        <button
          type="submit"
          disabled={loading || !formData.name.trim() || !formData.bet}
          className="create-submit-btn"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Création en cours...
            </>
          ) : (
            <>
              <span className="btn-icon">🚀</span>
              Créer la salle ({formData.bet && `${formatAmount(parseInt(formData.bet))} FCFA`})
            </>
          )}
        </button>
      </form>
    </div>
  );
}