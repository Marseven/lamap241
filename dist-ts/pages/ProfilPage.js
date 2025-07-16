import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            }
            else {
                error(result.error);
            }
        }
        catch (err) {
            error('Erreur lors de la mise à jour');
        }
        finally {
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
            }
            else {
                error(result.error);
            }
        }
        catch (err) {
            error('Erreur lors de la mise à jour');
        }
        finally {
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
        if (!dateString)
            return 'Non renseigné';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };
    const calculateAge = (dateString) => {
        if (!dateString)
            return null;
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
    return (_jsxs("div", { className: "profile-page", children: [_jsxs("div", { className: "profile-header", children: [_jsx(Link, { to: "/", className: "back-btn", children: "\u2190 Accueil" }), _jsx("h1", { className: "page-title", children: "\uD83D\uDC64 Mon Profil" }), _jsx("button", { onClick: () => setIsEditing(!isEditing), className: "edit-btn", children: isEditing ? '✕ Annuler' : '✏️ Modifier' })] }), _jsxs("div", { className: "profile-tabs", children: [_jsxs("button", { onClick: () => setActiveTab('profile'), className: `profile-tab ${activeTab === 'profile' ? 'active' : ''}`, children: [_jsx("span", { className: "tab-icon", children: "\uD83D\uDC64" }), "Profil"] }), _jsxs("button", { onClick: () => setActiveTab('stats'), className: `profile-tab ${activeTab === 'stats' ? 'active' : ''}`, children: [_jsx("span", { className: "tab-icon", children: "\uD83D\uDCCA" }), "Statistiques"] }), _jsxs("button", { onClick: () => setActiveTab('security'), className: `profile-tab ${activeTab === 'security' ? 'active' : ''}`, children: [_jsx("span", { className: "tab-icon", children: "\uD83D\uDD12" }), "S\u00E9curit\u00E9"] })] }), _jsxs("div", { className: "profile-content", children: [activeTab === 'profile' && (_jsxs("div", { className: "profile-tab-content", children: [_jsxs("div", { className: "profile-card", children: [_jsxs("div", { className: "profile-avatar-section", children: [_jsxs("div", { className: "profile-avatar", style: getAvatarGradient(user?.pseudo), children: [_jsx("span", { className: "avatar-text", children: user?.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U' }), _jsx("div", { className: "avatar-level", children: _jsxs("span", { children: ["Niv. ", user?.level || 1] }) })] }), _jsx("button", { className: "change-avatar-btn", disabled: true, children: "\uD83D\uDCF7 Changer" })] }), _jsxs("div", { className: "profile-main-info", children: [_jsx("h2", { className: "profile-name", children: user?.pseudo }), _jsxs("div", { className: "profile-badges", children: [_jsx("span", { className: "badge verified", children: "\u2713 V\u00E9rifi\u00E9" }), _jsxs("span", { className: "badge member", children: ["\uD83D\uDC51 Membre depuis ", formatDate(stats.joinDate)] })] })] })] }), isEditing ? (_jsxs("form", { onSubmit: handleSaveProfile, className: "profile-form", children: [_jsxs("div", { className: "form-section", children: [_jsx("h3", { className: "section-title", children: "Informations personnelles" }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Pseudo" }), _jsx("input", { type: "text", name: "pseudo", value: formData.pseudo, onChange: handleInputChange, className: "form-input", placeholder: "Votre pseudo", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleInputChange, className: "form-input", placeholder: "votre@email.com", required: true })] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", name: "telephone", value: formData.telephone, onChange: handleInputChange, className: "form-input", placeholder: "+241 XX XX XX XX" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Date de naissance" }), _jsx("input", { type: "date", name: "dateNaissance", value: formData.dateNaissance, onChange: handleInputChange, className: "form-input" })] })] }), _jsx("div", { className: "form-row", children: _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Ville" }), _jsx("input", { type: "text", name: "ville", value: formData.ville, onChange: handleInputChange, className: "form-input", placeholder: "Libreville, Port-Gentil..." })] }) }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Bio" }), _jsx("textarea", { name: "bio", value: formData.bio, onChange: handleInputChange, className: "form-textarea", placeholder: "Parlez-nous de vous...", rows: "3", maxLength: "200" }), _jsxs("div", { className: "char-count", children: [formData.bio.length, "/200"] })] })] }), _jsxs("div", { className: "form-actions", children: [_jsx("button", { type: "button", onClick: () => setIsEditing(false), className: "btn-secondary", children: "Annuler" }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary", children: loading ? 'Sauvegarde...' : 'Sauvegarder' })] })] })) : (
                            /* Affichage en lecture seule */
                            _jsx("div", { className: "profile-display", children: _jsxs("div", { className: "info-section", children: [_jsx("h3", { className: "section-title", children: "Informations personnelles" }), _jsxs("div", { className: "info-grid", children: [_jsxs("div", { className: "info-item", children: [_jsx("span", { className: "info-label", children: "\uD83D\uDCE7 Email" }), _jsx("span", { className: "info-value", children: user?.email || 'Non renseigné' })] }), _jsxs("div", { className: "info-item", children: [_jsx("span", { className: "info-label", children: "\uD83D\uDCF1 T\u00E9l\u00E9phone" }), _jsx("span", { className: "info-value", children: user?.telephone || 'Non renseigné' })] }), _jsxs("div", { className: "info-item", children: [_jsx("span", { className: "info-label", children: "\uD83C\uDF82 \u00C2ge" }), _jsxs("span", { className: "info-value", children: [calculateAge(user?.dateNaissance) || 'Non renseigné', " ans"] })] }), _jsxs("div", { className: "info-item", children: [_jsx("span", { className: "info-label", children: "\uD83C\uDFD9\uFE0F Ville" }), _jsx("span", { className: "info-value", children: user?.ville || 'Non renseigné' })] })] }), user?.bio && (_jsxs("div", { className: "bio-section", children: [_jsx("span", { className: "info-label", children: "\uD83D\uDCAC Bio" }), _jsx("p", { className: "bio-text", children: user.bio })] }))] }) }))] })), activeTab === 'stats' && (_jsxs("div", { className: "stats-tab-content", children: [_jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-icon", children: "\uD83C\uDFAE" }), _jsxs("div", { className: "stat-content", children: [_jsx("div", { className: "stat-value", children: stats.totalGames }), _jsx("div", { className: "stat-label", children: "Parties jou\u00E9es" })] })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-icon", children: "\uD83C\uDFC6" }), _jsxs("div", { className: "stat-content", children: [_jsx("div", { className: "stat-value", children: stats.gamesWon }), _jsx("div", { className: "stat-label", children: "Victoires" })] })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-icon", children: "\uD83D\uDCCA" }), _jsxs("div", { className: "stat-content", children: [_jsxs("div", { className: "stat-value", children: [stats.winRate, "%"] }), _jsx("div", { className: "stat-label", children: "Taux de victoire" })] })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-icon", children: "\uD83D\uDCB0" }), _jsxs("div", { className: "stat-content", children: [_jsx("div", { className: "stat-value", children: new Intl.NumberFormat('fr-FR').format(stats.totalWinnings) }), _jsx("div", { className: "stat-label", children: "Gains totaux (FCFA)" })] })] })] }), _jsxs("div", { className: "achievements-section", children: [_jsx("h3", { className: "section-title", children: "\uD83C\uDFC6 Succ\u00E8s r\u00E9cents" }), _jsxs("div", { className: "achievements-list", children: [_jsxs("div", { className: "achievement-item", children: [_jsx("span", { className: "achievement-icon", children: "\uD83C\uDFAF" }), _jsxs("div", { className: "achievement-content", children: [_jsx("div", { className: "achievement-name", children: "Premi\u00E8re victoire" }), _jsx("div", { className: "achievement-desc", children: "Gagner votre premi\u00E8re partie" })] }), _jsx("span", { className: "achievement-status completed", children: "\u2713" })] }), _jsxs("div", { className: "achievement-item", children: [_jsx("span", { className: "achievement-icon", children: "\uD83D\uDCB8" }), _jsxs("div", { className: "achievement-content", children: [_jsx("div", { className: "achievement-name", children: "Gros gains" }), _jsx("div", { className: "achievement-desc", children: "Gagner plus de 10,000 FCFA en une partie" })] }), _jsx("span", { className: "achievement-status pending", children: "\uD83D\uDD12" })] })] })] })] })), activeTab === 'security' && (_jsxs("div", { className: "security-tab-content", children: [_jsx("form", { onSubmit: handlePasswordUpdate, className: "security-form", children: _jsxs("div", { className: "form-section", children: [_jsx("h3", { className: "section-title", children: "\uD83D\uDD12 Changer le mot de passe" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Mot de passe actuel" }), _jsx("input", { type: "password", name: "currentPassword", value: passwordData.currentPassword, onChange: handlePasswordChange, className: "form-input", placeholder: "Votre mot de passe actuel", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Nouveau mot de passe" }), _jsx("input", { type: "password", name: "newPassword", value: passwordData.newPassword, onChange: handlePasswordChange, className: "form-input", placeholder: "Nouveau mot de passe (6+ caract\u00E8res)", minLength: "6", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Confirmer le nouveau mot de passe" }), _jsx("input", { type: "password", name: "confirmPassword", value: passwordData.confirmPassword, onChange: handlePasswordChange, className: "form-input", placeholder: "Confirmer le nouveau mot de passe", required: true })] }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary", children: loading ? 'Mise à jour...' : 'Changer le mot de passe' })] }) }), _jsxs("div", { className: "security-info", children: [_jsx("h3", { className: "section-title", children: "\uD83D\uDEE1\uFE0F S\u00E9curit\u00E9 du compte" }), _jsxs("div", { className: "security-items", children: [_jsxs("div", { className: "security-item", children: [_jsx("span", { className: "security-icon", children: "\u2705" }), _jsxs("div", { className: "security-content", children: [_jsx("div", { className: "security-label", children: "Email v\u00E9rifi\u00E9" }), _jsx("div", { className: "security-desc", children: "Votre adresse email a \u00E9t\u00E9 v\u00E9rifi\u00E9e" })] })] }), _jsxs("div", { className: "security-item", children: [_jsx("span", { className: "security-icon", children: "\uD83D\uDCF1" }), _jsxs("div", { className: "security-content", children: [_jsx("div", { className: "security-label", children: "T\u00E9l\u00E9phone li\u00E9" }), _jsx("div", { className: "security-desc", children: "Num\u00E9ro utilis\u00E9 pour les transactions" })] })] }), _jsxs("div", { className: "security-item", children: [_jsx("span", { className: "security-icon", children: "\uD83D\uDD10" }), _jsxs("div", { className: "security-content", children: [_jsx("div", { className: "security-label", children: "Connexions s\u00E9curis\u00E9es" }), _jsx("div", { className: "security-desc", children: "Toutes vos connexions sont chiffr\u00E9es" })] })] })] })] })] }))] })] }));
}
