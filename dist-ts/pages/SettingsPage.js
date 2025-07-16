import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            }
            else {
                error('Erreur lors de la sauvegarde');
            }
        }
        catch (err) {
            error('Erreur lors de la sauvegarde');
        }
        finally {
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
    const ToggleSwitch = ({ checked, onChange, label, description }) => (_jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-content", children: [_jsx("div", { className: "setting-label", children: label }), description && _jsx("div", { className: "setting-description", children: description })] }), _jsxs("label", { className: "toggle-switch", children: [_jsx("input", { type: "checkbox", checked: checked, onChange: (e) => onChange(e.target.checked) }), _jsx("span", { className: "toggle-slider" })] })] }));
    const SelectSetting = ({ value, onChange, options, label, description }) => (_jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-content", children: [_jsx("div", { className: "setting-label", children: label }), description && _jsx("div", { className: "setting-description", children: description })] }), _jsx("select", { value: value, onChange: (e) => onChange(e.target.value), className: "setting-select", children: options.map(option => (_jsx("option", { value: option.value, children: option.label }, option.value))) })] }));
    return (_jsxs("div", { className: "settings-page", children: [_jsxs("div", { className: "settings-header", children: [_jsx(Link, { to: "/", className: "back-btn", children: "\u2190 Accueil" }), _jsx("h1", { className: "page-title", children: "\u2699\uFE0F Param\u00E8tres" }), _jsx("button", { onClick: handleSaveSettings, disabled: loading, className: "save-btn", children: loading ? 'Sauvegarde...' : '💾 Sauvegarder' })] }), _jsxs("div", { className: "settings-container", children: [_jsxs("div", { className: "settings-sidebar", children: [sections.map(section => (_jsxs("button", { onClick: () => setActiveSection(section.id), className: `sidebar-item ${activeSection === section.id ? 'active' : ''}`, children: [_jsx("span", { className: "sidebar-icon", children: section.icon }), _jsx("span", { className: "sidebar-label", children: section.name })] }, section.id))), _jsx("div", { className: "sidebar-divider" }), _jsxs("button", { onClick: resetToDefaults, className: "sidebar-item reset-btn", children: [_jsx("span", { className: "sidebar-icon", children: "\uD83D\uDD04" }), _jsx("span", { className: "sidebar-label", children: "R\u00E9initialiser" })] })] }), _jsxs("div", { className: "settings-content", children: [activeSection === 'notifications' && (_jsxs("div", { className: "settings-section", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { className: "section-title", children: "\uD83D\uDD14 Notifications" }), _jsx("p", { className: "section-description", children: "G\u00E9rez vos pr\u00E9f\u00E9rences de notifications" })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h3", { className: "group-title", children: "Types de notifications" }), _jsx(ToggleSwitch, { checked: settings.notifications.push, onChange: (value) => handleSettingChange('notifications', 'push', value), label: "Notifications push", description: "Recevoir des notifications en temps r\u00E9el" }), _jsx(ToggleSwitch, { checked: settings.notifications.email, onChange: (value) => handleSettingChange('notifications', 'email', value), label: "Notifications par email", description: "Recevoir des emails pour les \u00E9v\u00E9nements importants" }), _jsx(ToggleSwitch, { checked: settings.notifications.sms, onChange: (value) => handleSettingChange('notifications', 'sms', value), label: "Notifications SMS", description: "Recevoir des SMS pour les transactions" })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h3", { className: "group-title", children: "Contenu des notifications" }), _jsx(ToggleSwitch, { checked: settings.notifications.gameUpdates, onChange: (value) => handleSettingChange('notifications', 'gameUpdates', value), label: "Mises \u00E0 jour de jeu", description: "Invitations, r\u00E9sultats de parties, etc." }), _jsx(ToggleSwitch, { checked: settings.notifications.promotions, onChange: (value) => handleSettingChange('notifications', 'promotions', value), label: "Promotions et offres", description: "Bonus, tournois, \u00E9v\u00E9nements sp\u00E9ciaux" }), _jsx(ToggleSwitch, { checked: settings.notifications.security, onChange: (value) => handleSettingChange('notifications', 'security', value), label: "S\u00E9curit\u00E9", description: "Connexions, changements de mot de passe" })] })] })), activeSection === 'game' && (_jsxs("div", { className: "settings-section", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { className: "section-title", children: "\uD83C\uDFAE Param\u00E8tres de jeu" }), _jsx("p", { className: "section-description", children: "Personnalisez votre exp\u00E9rience de jeu" })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h3", { className: "group-title", children: "Audio" }), _jsx(ToggleSwitch, { checked: settings.game.sound, onChange: (value) => handleSettingChange('game', 'sound', value), label: "Effets sonores", description: "Sons des cartes, victoires, d\u00E9faites" }), _jsx(ToggleSwitch, { checked: settings.game.music, onChange: (value) => handleSettingChange('game', 'music', value), label: "Musique de fond", description: "Ambiance musicale pendant les parties" })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h3", { className: "group-title", children: "Gameplay" }), _jsx(ToggleSwitch, { checked: settings.game.animations, onChange: (value) => handleSettingChange('game', 'animations', value), label: "Animations", description: "Animations des cartes et effets visuels" }), _jsx(ToggleSwitch, { checked: settings.game.autoPlay, onChange: (value) => handleSettingChange('game', 'autoPlay', value), label: "Jeu automatique", description: "Jouer automatiquement quand possible" }), _jsx(ToggleSwitch, { checked: settings.game.quickPlay, onChange: (value) => handleSettingChange('game', 'quickPlay', value), label: "Jeu rapide", description: "R\u00E9duire les temps d'attente" }), _jsx(ToggleSwitch, { checked: settings.game.showHints, onChange: (value) => handleSettingChange('game', 'showHints', value), label: "Afficher les indices", description: "Suggestions de coups pendant le jeu" })] })] })), activeSection === 'interface' && (_jsxs("div", { className: "settings-section", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { className: "section-title", children: "\uD83C\uDFA8 Interface" }), _jsx("p", { className: "section-description", children: "Personnalisez l'apparence de l'application" })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h3", { className: "group-title", children: "Apparence" }), _jsx(SelectSetting, { value: settings.interface.theme, onChange: (value) => handleSettingChange('interface', 'theme', value), label: "Th\u00E8me", description: "Choisir le th\u00E8me de couleur", options: [
                                                    { value: 'dark', label: '🌙 Sombre' },
                                                    { value: 'light', label: '☀️ Clair' },
                                                    { value: 'auto', label: '🔄 Automatique' }
                                                ] }), _jsx(SelectSetting, { value: settings.interface.cardStyle, onChange: (value) => handleSettingChange('interface', 'cardStyle', value), label: "Style des cartes", description: "Apparence des cartes de jeu", options: [
                                                    { value: 'classic', label: '🃏 Classique' },
                                                    { value: 'modern', label: '✨ Moderne' },
                                                    { value: 'minimal', label: '⚪ Minimaliste' }
                                                ] }), _jsx(SelectSetting, { value: settings.interface.fontSize, onChange: (value) => handleSettingChange('interface', 'fontSize', value), label: "Taille du texte", description: "Taille de la police", options: [
                                                    { value: 'small', label: 'Petit' },
                                                    { value: 'medium', label: 'Moyen' },
                                                    { value: 'large', label: 'Grand' }
                                                ] })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h3", { className: "group-title", children: "Accessibilit\u00E9" }), _jsx(ToggleSwitch, { checked: settings.interface.reducedMotion, onChange: (value) => handleSettingChange('interface', 'reducedMotion', value), label: "R\u00E9duire les animations", description: "Minimiser les mouvements pour plus de confort" })] })] })), activeSection === 'privacy' && (_jsxs("div", { className: "settings-section", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { className: "section-title", children: "\uD83D\uDD12 Confidentialit\u00E9" }), _jsx("p", { className: "section-description", children: "Contr\u00F4lez la visibilit\u00E9 de vos informations" })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h3", { className: "group-title", children: "Profil public" }), _jsx(ToggleSwitch, { checked: settings.privacy.profileVisible, onChange: (value) => handleSettingChange('privacy', 'profileVisible', value), label: "Profil visible", description: "Permettre aux autres de voir votre profil" }), _jsx(ToggleSwitch, { checked: settings.privacy.statsVisible, onChange: (value) => handleSettingChange('privacy', 'statsVisible', value), label: "Statistiques visibles", description: "Afficher vos stats de jeu publiquement" }), _jsx(ToggleSwitch, { checked: settings.privacy.onlineStatus, onChange: (value) => handleSettingChange('privacy', 'onlineStatus', value), label: "Statut en ligne", description: "Montrer quand vous \u00EAtes connect\u00E9" })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h3", { className: "group-title", children: "Parties" }), _jsx(ToggleSwitch, { checked: settings.privacy.allowSpectators, onChange: (value) => handleSettingChange('privacy', 'allowSpectators', value), label: "Autoriser les spectateurs", description: "Permettre \u00E0 d'autres de regarder vos parties" })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h3", { className: "group-title", children: "Donn\u00E9es" }), _jsx(ToggleSwitch, { checked: settings.privacy.dataCollection, onChange: (value) => handleSettingChange('privacy', 'dataCollection', value), label: "Collecte de donn\u00E9es", description: "Aider \u00E0 am\u00E9liorer l'app via l'analyse anonyme" })] })] })), activeSection === 'security' && (_jsxs("div", { className: "settings-section", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { className: "section-title", children: "\uD83D\uDEE1\uFE0F S\u00E9curit\u00E9" }), _jsx("p", { className: "section-description", children: "Prot\u00E9gez votre compte et vos donn\u00E9es" })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h3", { className: "group-title", children: "Authentification" }), _jsx(ToggleSwitch, { checked: settings.security.twoFactorAuth, onChange: (value) => handleSettingChange('security', 'twoFactorAuth', value), label: "Authentification \u00E0 deux facteurs", description: "S\u00E9curit\u00E9 renforc\u00E9e avec SMS" }), _jsx(ToggleSwitch, { checked: settings.security.loginNotifications, onChange: (value) => handleSettingChange('security', 'loginNotifications', value), label: "Notifications de connexion", description: "\u00CAtre alert\u00E9 des nouvelles connexions" })] }), _jsxs("div", { className: "settings-group", children: [_jsx("h3", { className: "group-title", children: "Session" }), _jsx(SelectSetting, { value: settings.security.sessionTimeout, onChange: (value) => handleSettingChange('security', 'sessionTimeout', parseInt(value)), label: "Timeout de session", description: "Dur\u00E9e avant d\u00E9connexion automatique", options: [
                                                    { value: '15', label: '15 minutes' },
                                                    { value: '30', label: '30 minutes' },
                                                    { value: '60', label: '1 heure' },
                                                    { value: '120', label: '2 heures' },
                                                    { value: '0', label: 'Jamais' }
                                                ] }), _jsx(ToggleSwitch, { checked: settings.security.autoLogout, onChange: (value) => handleSettingChange('security', 'autoLogout', value), label: "D\u00E9connexion automatique", description: "Se d\u00E9connecter apr\u00E8s inactivit\u00E9" })] })] }))] })] })] }));
}
