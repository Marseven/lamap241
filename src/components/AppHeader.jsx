// src/components/AppHeader.jsx - Version avec dropdown amélioré
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

export default function AppHeader({ 
  user = null, 
  onLogout = () => {}, 
  showBalance = true,
  showNotifications = true 
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const formatBalance = (balance) => {
    if (balance >= 1000000) {
      return (balance / 1000000).toFixed(1) + 'M';
    } else if (balance >= 1000) {
      return (balance / 1000).toFixed(1) + 'K';
    }
    return new Intl.NumberFormat('fr-FR').format(balance);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
  };

  const toggleUserMenu = () => {
    if (showUserMenu) {
      setIsAnimating(true);
      setTimeout(() => {
        setShowUserMenu(false);
        setIsAnimating(false);
      }, 200);
    } else {
      setShowUserMenu(true);
    }
  };

  const handleMenuItemClick = (path) => {
    setShowUserMenu(false);
    if (path) {
      navigate(path);
    }
  };

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showUserMenu &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Fermer le menu lors du changement de route
  useEffect(() => {
    setShowUserMenu(false);
  }, [location.pathname]);

  const getStatusColor = () => {
    // Vous pouvez gérer différents statuts ici
    return 'online'; // online, away, busy, offline
  };

  const getAvatarGradient = (pseudo) => {
    const firstChar = pseudo?.charAt(0).toUpperCase() || 'U';
    const charCode = firstChar.charCodeAt(0);
    const hue = (charCode * 137.508) % 360; // Génère une couleur unique basée sur la première lettre
    return {
      background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 60) % 360}, 70%, 40%))`
    };
  };

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Logo côté gauche */}
        <Link to="/" className="logo-section">
          <div className="logo-container">
            <img src="/logo.png" alt="LaMap241" className="header-logo" />
          </div>
        </Link>
        

        {/* Infos utilisateur côté droit */}
        {user ? (
          <div className="user-section">
            {/* Solde */}
            {showBalance && (
              <div className="balance-display">
                <div className="balance-container">
                  <span className="balance-icon">🪙</span>
                  <div className="balance-info">
                    <span className="balance-amount">{formatBalance(user.balance)}</span>
                    <span className="balance-currency">FCFA</span>
                  </div>
                </div>
                <Link to="/wallet" className="balance-add-btn" title="Recharger">
                  <span>+</span>
                </Link>
              </div>
            )}

            {/* Notifications */}
            {showNotifications && <NotificationBell />}

            {/* Avatar utilisateur avec dropdown amélioré */}
            <div className="user-avatar-section">
              <button 
                ref={buttonRef}
                className={`user-avatar-btn ${showUserMenu ? 'active' : ''}`}
                onClick={toggleUserMenu}
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <div className="avatar-wrapper">
                  <div 
                    className="avatar-circle"
                    style={getAvatarGradient(user.pseudo)}
                  >
                    <span className="avatar-text">
                      {user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <div className={`status-indicator ${getStatusColor()}`}></div>
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.pseudo}</div>
                    <div className="user-level">
                      <span className="level-icon">⭐</span>
                      <span>Niveau {user.level || 1}</span>
                    </div>
                  </div>
                  <div className={`dropdown-arrow ${showUserMenu ? 'rotated' : ''}`}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </button>

              {/* Menu déroulant amélioré */}
              {showUserMenu && (
                <div 
                  ref={dropdownRef}
                  className={`user-dropdown ${isAnimating ? 'closing' : ''}`}
                >
                  {/* Header du dropdown */}
                  <div className="dropdown-header">
                    <div 
                      className="dropdown-avatar"
                      style={getAvatarGradient(user.pseudo)}
                    >
                      <span>{user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U'}</span>
                    </div>
                    <div className="dropdown-user-info">
                      <div className="dropdown-name">{user.pseudo}</div>
                      <div className="dropdown-balance">
                        {formatBalance(user.balance)} FCFA
                      </div>
                    </div>
                  </div>

                  {/* Menu items principaux */}
                  <div className="dropdown-section">
                    <button 
                      onClick={() => handleMenuItemClick('/profile')}
                      className="dropdown-item"
                    >
                      
                      <div className="item-content">
                        <span className="item-label">Mon Profil</span>
                        <span className="item-desc">Informations personnelles</span>
                      </div>
                      
                    </button>

                    <button 
                      onClick={() => handleMenuItemClick('/wallet')}
                      className="dropdown-item"
                    >
                      <div className="item-content">
                        <span className="item-label">Portefeuille</span>
                        <span className="item-desc">Gérer vos finances</span>
                      </div>
                      
                    </button>

                    <button 
                      onClick={() => handleMenuItemClick('/history')}
                      className="dropdown-item"
                    >
                      <div className="item-content">
                        <span className="item-label">Historique</span>
                        <span className="item-desc">Vos parties et transactions</span>
                      </div>
                      
                    </button>

                    <button 
                      onClick={() => handleMenuItemClick('/achievements')}
                      className="dropdown-item"
                    >
                      <div className="item-content">
                        <span className="item-label">Succès</span>
                        <span className="item-desc">Vos réalisations</span>
                      </div>
                      
                    </button>
                  </div>

                  <div className="dropdown-divider"></div>

                  {/* Menu items secondaires */}
                  <div className="dropdown-section">
                    <button 
                      onClick={() => handleMenuItemClick('/rules')}
                      className="dropdown-item"
                    >
                     
                      <div className="item-content">
                        <span className="item-label">Règles du jeu</span>
                        <span className="item-desc">Comment jouer</span>
                      </div>
                      
                    </button>

                    <button 
                      onClick={() => handleMenuItemClick('/support')}
                      className="dropdown-item"
                    >
                     
                      <div className="item-content">
                        <span className="item-label">Aide & Support</span>
                        <span className="item-desc">Besoin d'aide ?</span>
                      </div>
                      
                    </button>

                    <button 
                      onClick={() => handleMenuItemClick('/settings')}
                      className="dropdown-item"
                    >
                      
                      <div className="item-content">
                        <span className="item-label">Paramètres</span>
                        <span className="item-desc">Préférences du compte</span>
                      </div>
                      
                    </button>
                  </div>

                  <div className="dropdown-divider"></div>

                  {/* Déconnexion */}
                  <div className="dropdown-section">
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      
                      <div className="item-content">
                        <span className="item-label">Déconnexion</span>
                        <span className="item-desc">Quitter votre session</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* État non connecté */
          <div className="auth-section">
            <Link to="/auth" className="auth-btn login-btn">
              <span className="btn-icon">👤</span>
              Connexion
            </Link>
            <Link to="/auth" className="auth-btn register-btn">
              <span className="btn-icon">✨</span>
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}