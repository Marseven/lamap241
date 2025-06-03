import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AppHeader({ 
  user = null, 
  onLogout = () => {}, 
  showBalance = true 
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const formatBalance = (balance) => {
    if (balance >= 1000000) {
      return (balance / 1000000).toFixed(1) + 'M';
    } else if (balance >= 1000) {
      return (balance / 1000).toFixed(1) + 'K';
    }
    return balance.toString();
  };

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Logo côté gauche */}
        <Link to="/" className="logo-section">
          <img src="/logo.png" alt="LaMap241" className="header-logo" />
        </Link>

        {/* Infos utilisateur côté droit */}
        {user ? (
          <div className="user-section">
            {/* Solde */}
            {showBalance && (
              <div className="balance-display">
                <span className="balance-icon">🪙</span>
                <span className="balance-amount">{formatBalance(user.balance)}</span>
              </div>
            )}

            {/* Notifications */}
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>

            {/* Avatar utilisateur */}
            <div className="user-avatar-section">
              <button 
                className="user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="avatar-circle">
                  <span className="avatar-text">
                    {user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="user-info">
                  <div className="user-name">{user.pseudo}</div>
                  <div className="user-status">En ligne</div>
                </div>
                <span className="dropdown-arrow">⌄</span>
              </button>

              {/* Menu déroulant */}
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <span className="dropdown-icon">👤</span>
                    Profil
                  </Link>
                  <Link to="/wallet" className="dropdown-item">
                    <span className="dropdown-icon">💰</span>
                    Portefeuille
                  </Link>
                  <Link to="/history" className="dropdown-item">
                    <span className="dropdown-icon">📊</span>
                    Historique
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link to="/settings" className="dropdown-item">
                    <span className="dropdown-icon">⚙️</span>
                    Paramètres
                  </Link>
                  <button onClick={onLogout} className="dropdown-item logout">
                    <span className="dropdown-icon">🚪</span>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* État non connecté */
          <div className="auth-section">
            <Link to="/login" className="auth-btn login-btn">
              Connexion
            </Link>
            <Link to="/register" className="auth-btn register-btn">
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}