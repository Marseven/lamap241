// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

export default function SettingsPage() {
  const { user, updateSettings } = useAuth();
  const { success, error } = useNotifications();
  
  const [settings, setSettings] = useState({
    // Notifications
    notifications: {
      push: user?.settings?.notifications?.push ?? true,
      email: user?.settings?.notifications?.email ?? true,
      sms: user?.settings?.notifications?.sms ?? false,
      gameUpdates: user?.settings?.notifications?.gameUpdates ?? true,
      promotions: user?.settings?.notifications?.promotions ?? true,
      security: user?.settings?.notifications?.security ?? true,
    },
    
    // Jeu
    game: {
      sound: user?.settings?.game?.sound ?? true,
      music: user?.settings?.game?.music ?? true,
      animations: user?.settings?.game?.animations ?? true,
      autoPlay: user?.settings?.game?.autoPlay ?? false,
      quickPlay: user?.settings?.game?.quickPlay ?? true,
      showHints: user?.settings?.game?.showHints ?? true,
    },
    
    // Interface
    interface: {
      theme: user?.settings?.interface?.theme ?? 'dark',
      language: user?.settings?.interface?.language ?? 'fr',
      cardStyle: user?.settings?.interface?.cardStyle ?? 'classic',
      fontSize: user?.settings?.interface?.fontSize ?? 'medium',
      reducedMotion: user?.settings?.interface?.reducedMotion ?? false,
    },
    
    // Confidentialité
    privacy: {
      profileVisible: user?.settings?.privacy?.profileVisible ?? true,
      statsVisible: user?.settings?.privacy?.statsVisible ?? true,
      onlineStatus: user?.settings?.privacy?.onlineStatus ?? true,
      allowSpectators: user?.settings?.privacy?.allowSpectators ?? true,
      dataCollection: user?.settings?.privacy?.dataCollection ?? true,
    },
    
    // Sécurité
    security: {
      twoFactorAuth: user?.settings?.security?.twoFactorAuth ?? false,
      loginNotifications: user?.settings?.security?.loginNotifications ?? true,
      sessionTimeout: user?.settings?.security?.sessionTimeout ?? 30,
      autoLogout: user?.settings?.security?.autoLogout ?? true,
    }
  });

  const [activeSection, setActiveSection] = useState('notifications');
  const [loading, setLoading] = useState(false);

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const result = await updateSettings(settings);
      if (result.success) {
        success('Paramètres sauvegardés !');
      } else {
        error('Erreur lors de la sauvegarde');
      }
    } catch (err) {
      error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Réinitialiser tous les paramètres par défaut ?')) {
      setSettings({
        notifications: {
          push: true,
          email: true,
          sms: false,
          gameUpdates: true,
          promotions: true,
          security: true,
        },
        game: {
          sound: true,
          music: true,
          animations: true,
          autoPlay: false,
          quickPlay: true,
          showHints: true,
        },
        interface: {
          theme: 'dark',
          language: 'fr',
          cardStyle: 'classic',
          fontSize: 'medium',
          reducedMotion: false,
        },
        privacy: {
          profileVisible: true,
          statsVisible: true,
          onlineStatus: true,
          allowSpectators: true,
          dataCollection: true,
        },
        security: {
          twoFactorAuth: false,
          loginNotifications: true,
          sessionTimeout: 30,
          autoLogout: true,
        }
      });
      success('Paramètres réinitialisés');
    }
  };

  const sections = [
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'game', name: 'Jeu', icon: '🎮' },
    { id: 'interface', name: 'Interface', icon: '🎨' },
    { id: 'privacy', name: 'Confidentialité', icon: '🔒' },
    { id: 'security', name: 'Sécurité', icon: '🛡️' }
  ];

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="setting-item">
      <div className="setting-content">
        <div className="setting-label">{label}</div>
        {description && <div className="setting-description">{description}</div>}
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );

  const SelectSetting = ({ value, onChange, options, label, description }) => (
    <div className="setting-item">
      <div className="setting-content">
        <div className="setting-label">{label}</div>
        {description && <div className="setting-description">{description}</div>}
      </div>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="setting-select"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <Link to="/" className="back-btn">
          ← Accueil
        </Link>
        <h1 className="page-title">⚙️ Paramètres</h1>
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="save-btn"
        >
          {loading ? 'Sauvegarde...' : '💾 Sauvegarder'}
        </button>
      </div>

      <div className="settings-container">
        {/* Menu latéral */}
        <div className="settings-sidebar">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{section.icon}</span>
              <span className="sidebar-label">{section.name}</span>
            </button>
          ))}
          
          <div className="sidebar-divider"></div>
          
          <button 
            onClick={resetToDefaults}
            className="sidebar-item reset-btn"
          >
            <span className="sidebar-icon">🔄</span>
            <span className="sidebar-label">Réinitialiser</span>
          </button>
        </div>

        {/* Contenu principal */}
        <div className="settings-content">
          
          {/* Section Notifications */}
          {activeSection === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2 className="section-title">🔔 Notifications</h2>
                <p className="section-description">
                  Gérez vos préférences de notifications
                </p>
              </div>

              <div className="settings-group">
                <h3 className="group-title">Types de notifications</h3>
                
                <ToggleSwitch
                  checked={settings.notifications.push}
                  onChange={(value) => handleSettingChange('notifications', 'push', value)}
                  label="Notifications push"
                  description="Recevoir des notifications en temps réel"
                />
                
                <ToggleSwitch
                  checked={settings.notifications.email}
                  onChange={(value) => handleSettingChange('notifications', 'email', value)}
                  label="Notifications par email"
                  description="Recevoir des emails pour les événements importants"
                />
                
                <ToggleSwitch
                  checked={settings.notifications.sms}
                  onChange={(value) => handleSettingChange('notifications', 'sms', value)}
                  label="Notifications SMS"
                  description="Recevoir des SMS pour les transactions"
                />
              </div>

              <div className="settings-group">
                <h3 className="group-title">Contenu des notifications</h3>
                
                <ToggleSwitch
                  checked={settings.notifications.gameUpdates}
                  onChange={(value) => handleSettingChange('notifications', 'gameUpdates', value)}
                  label="Mises à jour de jeu"
                  description="Invitations, résultats de parties, etc."
                />
                
                <ToggleSwitch
                  checked={settings.notifications.promotions}
                  onChange={(value) => handleSettingChange('notifications', 'promotions', value)}
                  label="Promotions et offres"
                  description="Bonus, tournois, événements spéciaux"
                />
                
                <ToggleSwitch
                  checked={settings.notifications.security}
                  onChange={(value) => handleSettingChange('notifications', 'security', value)}
                  label="Sécurité"
                  description="Connexions, changements de mot de passe"
                />
              </div>
            </div>
          )}

          {/* Section Jeu */}
          {activeSection === 'game' && (
            <div className="settings-section">
              <div className="section-header">
                <h2 className="section-title">🎮 Paramètres de jeu</h2>
                <p className="section-description">
                  Personnalisez votre expérience de jeu
                </p>
              </div>

              <div className="settings-group">
                <h3 className="group-title">Audio</h3>
                
                <ToggleSwitch
                  checked={settings.game.sound}
                  onChange={(value) => handleSettingChange('game', 'sound', value)}
                  label="Effets sonores"
                  description="Sons des cartes, victoires, défaites"
                />
                
                <ToggleSwitch
                  checked={settings.game.music}
                  onChange={(value) => handleSettingChange('game', 'music', value)}
                  label="Musique de fond"
                  description="Ambiance musicale pendant les parties"
                />
              </div>

              <div className="settings-group">
                <h3 className="group-title">Gameplay</h3>
                
                <ToggleSwitch
                  checked={settings.game.animations}
                  onChange={(value) => handleSettingChange('game', 'animations', value)}
                  label="Animations"
                  description="Animations des cartes et effets visuels"
                />
                
                <ToggleSwitch
                  checked={settings.game.autoPlay}
                  onChange={(value) => handleSettingChange('game', 'autoPlay', value)}
                  label="Jeu automatique"
                  description="Jouer automatiquement quand possible"
                />
                
                <ToggleSwitch
                  checked={settings.game.quickPlay}
                  onChange={(value) => handleSettingChange('game', 'quickPlay', value)}
                  label="Jeu rapide"
                  description="Réduire les temps d'attente"
                />
                
                <ToggleSwitch
                  checked={settings.game.showHints}
                  onChange={(value) => handleSettingChange('game', 'showHints', value)}
                  label="Afficher les indices"
                  description="Suggestions de coups pendant le jeu"
                />
              </div>
            </div>
          )}

          {/* Section Interface */}
          {activeSection === 'interface' && (
            <div className="settings-section">
              <div className="section-header">
                <h2 className="section-title">🎨 Interface</h2>
                <p className="section-description">
                  Personnalisez l'apparence de l'application
                </p>
              </div>

              <div className="settings-group">
                <h3 className="group-title">Apparence</h3>
                
                <SelectSetting
                  value={settings.interface.theme}
                  onChange={(value) => handleSettingChange('interface', 'theme', value)}
                  label="Thème"
                  description="Choisir le thème de couleur"
                  options={[
                    { value: 'dark', label: '🌙 Sombre' },
                    { value: 'light', label: '☀️ Clair' },
                    { value: 'auto', label: '🔄 Automatique' }
                  ]}
                />
                
                <SelectSetting
                  value={settings.interface.cardStyle}
                  onChange={(value) => handleSettingChange('interface', 'cardStyle', value)}
                  label="Style des cartes"
                  description="Apparence des cartes de jeu"
                  options={[
                    { value: 'classic', label: '🃏 Classique' },
                    { value: 'modern', label: '✨ Moderne' },
                    { value: 'minimal', label: '⚪ Minimaliste' }
                  ]}
                />
                
                <SelectSetting
                  value={settings.interface.fontSize}
                  onChange={(value) => handleSettingChange('interface', 'fontSize', value)}
                  label="Taille du texte"
                  description="Taille de la police"
                  options={[
                    { value: 'small', label: 'Petit' },
                    { value: 'medium', label: 'Moyen' },
                    { value: 'large', label: 'Grand' }
                  ]}
                />
              </div>

              <div className="settings-group">
                <h3 className="group-title">Accessibilité</h3>
                
                <ToggleSwitch
                  checked={settings.interface.reducedMotion}
                  onChange={(value) => handleSettingChange('interface', 'reducedMotion', value)}
                  label="Réduire les animations"
                  description="Minimiser les mouvements pour plus de confort"
                />
              </div>
            </div>
          )}

          {/* Section Confidentialité */}
          {activeSection === 'privacy' && (
            <div className="settings-section">
              <div className="section-header">
                <h2 className="section-title">🔒 Confidentialité</h2>
                <p className="section-description">
                  Contrôlez la visibilité de vos informations
                </p>
              </div>

              <div className="settings-group">
                <h3 className="group-title">Profil public</h3>
                
                <ToggleSwitch
                  checked={settings.privacy.profileVisible}
                  onChange={(value) => handleSettingChange('privacy', 'profileVisible', value)}
                  label="Profil visible"
                  description="Permettre aux autres de voir votre profil"
                />
                
                <ToggleSwitch
                  checked={settings.privacy.statsVisible}
                  onChange={(value) => handleSettingChange('privacy', 'statsVisible', value)}
                  label="Statistiques visibles"
                  description="Afficher vos stats de jeu publiquement"
                />
                
                <ToggleSwitch
                  checked={settings.privacy.onlineStatus}
                  onChange={(value) => handleSettingChange('privacy', 'onlineStatus', value)}
                  label="Statut en ligne"
                  description="Montrer quand vous êtes connecté"
                />
              </div>

              <div className="settings-group">
                <h3 className="group-title">Parties</h3>
                
                <ToggleSwitch
                  checked={settings.privacy.allowSpectators}
                  onChange={(value) => handleSettingChange('privacy', 'allowSpectators', value)}
                  label="Autoriser les spectateurs"
                  description="Permettre à d'autres de regarder vos parties"
                />
              </div>

              <div className="settings-group">
                <h3 className="group-title">Données</h3>
                
                <ToggleSwitch
                  checked={settings.privacy.dataCollection}
                  onChange={(value) => handleSettingChange('privacy', 'dataCollection', value)}
                  label="Collecte de données"
                  description="Aider à améliorer l'app via l'analyse anonyme"
                />
              </div>
            </div>
          )}

          {/* Section Sécurité */}
          {activeSection === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <h2 className="section-title">🛡️ Sécurité</h2>
                <p className="section-description">
                  Protégez votre compte et vos données
                </p>
              </div>

              <div className="settings-group">
                <h3 className="group-title">Authentification</h3>
                
                <ToggleSwitch
                  checked={settings.security.twoFactorAuth}
                  onChange={(value) => handleSettingChange('security', 'twoFactorAuth', value)}
                  label="Authentification à deux facteurs"
                  description="Sécurité renforcée avec SMS"
                />
                
                <ToggleSwitch
                  checked={settings.security.loginNotifications}
                  onChange={(value) => handleSettingChange('security', 'loginNotifications', value)}
                  label="Notifications de connexion"
                  description="Être alerté des nouvelles connexions"
                />
              </div>

              <div className="settings-group">
                <h3 className="group-title">Session</h3>
                
                <SelectSetting
                  value={settings.security.sessionTimeout}
                  onChange={(value) => handleSettingChange('security', 'sessionTimeout', parseInt(value))}
                  label="Timeout de session"
                  description="Durée avant déconnexion automatique"
                  options={[
                    { value: '15', label: '15 minutes' },
                    { value: '30', label: '30 minutes' },
                    { value: '60', label: '1 heure' },
                    { value: '120', label: '2 heures' },
                    { value: '0', label: 'Jamais' }
                  ]}
                />
                
                <ToggleSwitch
                  checked={settings.security.autoLogout}
                  onChange={(value) => handleSettingChange('security', 'autoLogout', value)}
                  label="Déconnexion automatique"
                  description="Se déconnecter après inactivité"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}