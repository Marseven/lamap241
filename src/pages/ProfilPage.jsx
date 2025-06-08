// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { success, error } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    pseudo: user?.pseudo || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    dateNaissance: user?.dateNaissance || '',
    ville: user?.ville || '',
    bio: user?.bio || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        success('Profil mis à jour avec succès !');
        setIsEditing(false);
      } else {
        error(result.error);
      }
    } catch (err) {
      error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile({ password: passwordData });
      if (result.success) {
        success('Mot de passe mis à jour !');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        error(result.error);
      }
    } catch (err) {
      error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const getAvatarGradient = (pseudo) => {
    const firstChar = pseudo?.charAt(0).toUpperCase() || 'U';
    const charCode = firstChar.charCodeAt(0);
    const hue = (charCode * 137.508) % 360;
    return {
      background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 60) % 360}, 70%, 40%))`
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateAge = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getUserStats = () => {
    return {
      totalGames: user?.stats?.totalGames || 0,
      gamesWon: user?.stats?.gamesWon || 0,
      totalWinnings: user?.stats?.totalWinnings || 0,
      winRate: user?.stats?.totalGames > 0 ? 
        Math.round((user?.stats?.gamesWon / user?.stats?.totalGames) * 100) : 0,
      level: user?.level || 1,
      joinDate: user?.createdAt || new Date().toISOString()
    };
  };

  const stats = getUserStats();

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <Link to="/" className="back-btn">
          ← Accueil
        </Link>
        <h1 className="page-title">👤 Mon Profil</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="edit-btn"
        >
          {isEditing ? '✕ Annuler' : '✏️ Modifier'}
        </button>
      </div>

      {/* Onglets */}
      <div className="profile-tabs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
        >
          <span className="tab-icon">👤</span>
          Profil
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`profile-tab ${activeTab === 'stats' ? 'active' : ''}`}
        >
          <span className="tab-icon">📊</span>
          Statistiques
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
        >
          <span className="tab-icon">🔒</span>
          Sécurité
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="profile-content">
        
        {/* Onglet Profil */}
        {activeTab === 'profile' && (
          <div className="profile-tab-content">
            {/* Card Avatar et infos principales */}
            <div className="profile-card">
              <div className="profile-avatar-section">
                <div 
                  className="profile-avatar"
                  style={getAvatarGradient(user?.pseudo)}
                >
                  <span className="avatar-text">
                    {user?.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <div className="avatar-level">
                    <span>Niv. {user?.level || 1}</span>
                  </div>
                </div>
                <button className="change-avatar-btn" disabled>
                  📷 Changer
                </button>
              </div>

              <div className="profile-main-info">
                <h2 className="profile-name">{user?.pseudo}</h2>
                <div className="profile-badges">
                  <span className="badge verified">✓ Vérifié</span>
                  <span className="badge member">
                    👑 Membre depuis {formatDate(stats.joinDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Formulaire d'édition */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-section">
                  <h3 className="section-title">Informations personnelles</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Pseudo</label>
                      <input
                        type="text"
                        name="pseudo"
                        value={formData.pseudo}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Votre pseudo"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Téléphone</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="+241 XX XX XX XX"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date de naissance</label>
                      <input
                        type="date"
                        name="dateNaissance"
                        value={formData.dateNaissance}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Ville</label>
                      <input
                        type="text"
                        name="ville"
                        value={formData.ville}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Libreville, Port-Gentil..."
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Parlez-nous de vous..."
                      rows="3"
                      maxLength="200"
                    />
                    <div className="char-count">{formData.bio.length}/200</div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              </form>
            ) : (
              /* Affichage en lecture seule */
              <div className="profile-display">
                <div className="info-section">
                  <h3 className="section-title">Informations personnelles</h3>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">📧 Email</span>
                      <span className="info-value">{user?.email || 'Non renseigné'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📱 Téléphone</span>
                      <span className="info-value">{user?.telephone || 'Non renseigné'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">🎂 Âge</span>
                      <span className="info-value">
                        {calculateAge(user?.dateNaissance) || 'Non renseigné'} ans
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">🏙️ Ville</span>
                      <span className="info-value">{user?.ville || 'Non renseigné'}</span>
                    </div>
                  </div>

                  {user?.bio && (
                    <div className="bio-section">
                      <span className="info-label">💬 Bio</span>
                      <p className="bio-text">{user.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Onglet Statistiques */}
        {activeTab === 'stats' && (
          <div className="stats-tab-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalGames}</div>
                  <div className="stat-label">Parties jouées</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.gamesWon}</div>
                  <div className="stat-label">Victoires</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.winRate}%</div>
                  <div className="stat-label">Taux de victoire</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <div className="stat-value">
                    {new Intl.NumberFormat('fr-FR').format(stats.totalWinnings)}
                  </div>
                  <div className="stat-label">Gains totaux (FCFA)</div>
                </div>
              </div>
            </div>

            <div className="achievements-section">
              <h3 className="section-title">🏆 Succès récents</h3>
              <div className="achievements-list">
                <div className="achievement-item">
                  <span className="achievement-icon">🎯</span>
                  <div className="achievement-content">
                    <div className="achievement-name">Première victoire</div>
                    <div className="achievement-desc">Gagner votre première partie</div>
                  </div>
                  <span className="achievement-status completed">✓</span>
                </div>
                
                <div className="achievement-item">
                  <span className="achievement-icon">💸</span>
                  <div className="achievement-content">
                    <div className="achievement-name">Gros gains</div>
                    <div className="achievement-desc">Gagner plus de 10,000 FCFA en une partie</div>
                  </div>
                  <span className="achievement-status pending">🔒</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Sécurité */}
        {activeTab === 'security' && (
          <div className="security-tab-content">
            <form onSubmit={handlePasswordUpdate} className="security-form">
              <div className="form-section">
                <h3 className="section-title">🔒 Changer le mot de passe</h3>
                
                <div className="form-group">
                  <label className="form-label">Mot de passe actuel</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Votre mot de passe actuel"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Nouveau mot de passe (6+ caractères)"
                    minLength="6"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Confirmer le nouveau mot de passe"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
                </button>
              </div>
            </form>

            <div className="security-info">
              <h3 className="section-title">🛡️ Sécurité du compte</h3>
              <div className="security-items">
                <div className="security-item">
                  <span className="security-icon">✅</span>
                  <div className="security-content">
                    <div className="security-label">Email vérifié</div>
                    <div className="security-desc">Votre adresse email a été vérifiée</div>
                  </div>
                </div>
                <div className="security-item">
                  <span className="security-icon">📱</span>
                  <div className="security-content">
                    <div className="security-label">Téléphone lié</div>
                    <div className="security-desc">Numéro utilisé pour les transactions</div>
                  </div>
                </div>
                <div className="security-item">
                  <span className="security-icon">🔐</span>
                  <div className="security-content">
                    <div className="security-label">Connexions sécurisées</div>
                    <div className="security-desc">Toutes vos connexions sont chiffrées</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}