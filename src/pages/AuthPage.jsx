import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pseudo.trim()) {
      newErrors.pseudo = 'Le pseudo est requis';
    } else if (formData.pseudo.length < 3) {
      newErrors.pseudo = 'Le pseudo doit contenir au moins 3 caractères';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (activeTab === 'register') {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
      
      if (formData.phone && !/^(\+241|241)?[0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Numéro de téléphone invalide (format: +241 XX XX XX XX)';
      }
      
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Adresse email invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      let result;
      if (activeTab === 'login') {
        result = await login({
          pseudo: formData.pseudo,
          password: formData.password
        });
      } else {
        result = await register(formData);
      }

      if (result.success) {
        navigate('/');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setFormData({
      pseudo: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header avec logo */}
        <div className="auth-header">
          <img src="/logo.png" alt="LaMap241" className="auth-logo" />
          <h1 className="auth-title">La Map</h1>
          <p className="auth-subtitle">🇬🇦 Jeu de cartes</p>
        </div>

        {/* Onglets */}
        <div className="auth-tabs">
          <button
            onClick={() => switchTab('login')}
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
          >
            <span className="tab-icon"></span>
            Connexion
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
          >
            <span className="tab-icon"></span>
            Inscription
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general">
              ⚠️ {errors.general}
            </div>
          )}

          {/* Pseudo */}
          <div className="form-group">
            <label htmlFor="pseudo" className="form-label">
              <span className="label-icon">👤</span>
              Pseudo
            </label>
            <input
              type="text"
              id="pseudo"
              name="pseudo"
              value={formData.pseudo}
              onChange={handleInputChange}
              className={`form-input ${errors.pseudo ? 'error' : ''}`}
              placeholder="Ton pseudo de joueur"
              disabled={loading}
            />
            {errors.pseudo && (
              <div className="error-message">{errors.pseudo}</div>
            )}
          </div>

          {/* Email (inscription seulement) */}
          {activeTab === 'register' && (
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Email (optionnel)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="ton.email@exemple.com"
                disabled={loading}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>
          )}

          {/* Téléphone (inscription seulement) */}
          {activeTab === 'register' && (
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <span className="label-icon">📱</span>
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+241 XX XX XX XX"
                disabled={loading}
              />
              {errors.phone && (
                <div className="error-message">{errors.phone}</div>
              )}
            </div>
          )}

          {/* Mot de passe */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <span className="label-icon">🔒</span>
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
              disabled={loading}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          {/* Confirmation mot de passe (inscription seulement) */}
          {activeTab === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <span className="label-icon">🔒</span>
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                {activeTab === 'login' ? 'Connexion...' : 'Inscription...'}
              </>
            ) : (
              <>
                <span className="btn-icon">
                  {activeTab === 'login' ? '' : ''}
                </span>
                {activeTab === 'login' ? 'Se connecter' : 'S\'inscrire'}
              </>
            )}
          </button>
        </form>

        {/* Info bonus */}
        {activeTab === 'register' && (
          <div className="bonus-info">
            <div className="bonus-card">
              <span className="bonus-icon">🎁</span>
              <div className="bonus-text">
                <div className="bonus-title">Bonus de bienvenue</div>
                <div className="bonus-amount">1000 FCFA offerts !</div>
              </div>
            </div>
          </div>
        )}

        {/* Démo pour les tests */}
        <div className="demo-info">
          <div className="demo-card">
            <span className="demo-icon">💡</span>
            <div className="demo-text">
              <strong>Mode démo :</strong> Utilise n'importe quel pseudo/mot de passe pour tester l'app
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}