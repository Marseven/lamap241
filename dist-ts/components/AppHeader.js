import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/AppHeader.jsx - Version avec dropdown amélioré
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
export default function AppHeader({ user = null, onLogout = () => { }, showBalance = true, showNotifications = true }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const formatBalance = (balance) => {
        if (balance >= 1000000) {
            return (balance / 1000000).toFixed(1) + 'M';
        }
        else if (balance >= 1000) {
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
        }
        else {
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
            if (showUserMenu &&
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)) {
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
    return (_jsx("header", { className: "app-header", children: _jsxs("div", { className: "header-content", children: [_jsx(Link, { to: "/", className: "logo-section", children: _jsx("div", { className: "logo-container", children: _jsx("img", { src: "/logo.png", alt: "LaMap241", className: "header-logo" }) }) }), user ? (_jsxs("div", { className: "user-section", children: [showBalance && (_jsxs("div", { className: "balance-display", children: [_jsxs("div", { className: "balance-container", children: [_jsx("span", { className: "balance-icon", children: "\uD83E\uDE99" }), _jsxs("div", { className: "balance-info", children: [_jsx("span", { className: "balance-amount", children: formatBalance(user.balance) }), _jsx("span", { className: "balance-currency", children: "FCFA" })] })] }), _jsx(Link, { to: "/wallet", className: "balance-add-btn", title: "Recharger", children: _jsx("span", { children: "+" }) })] })), showNotifications && _jsx(NotificationBell, {}), _jsxs("div", { className: "user-avatar-section", children: [_jsx("button", { ref: buttonRef, className: `user-avatar-btn ${showUserMenu ? 'active' : ''}`, onClick: toggleUserMenu, "aria-expanded": showUserMenu, "aria-haspopup": "true", children: _jsxs("div", { className: "avatar-wrapper", children: [_jsxs("div", { className: "avatar-circle", style: getAvatarGradient(user.pseudo), children: [_jsx("span", { className: "avatar-text", children: user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U' }), _jsx("div", { className: `status-indicator ${getStatusColor()}` })] }), _jsxs("div", { className: "user-info", children: [_jsx("div", { className: "user-name", children: user.pseudo }), _jsx("div", { className: "user-level", children: _jsxs("span", { children: ["Niveau ", user.level || 1] }) })] }), _jsx("div", { className: `dropdown-arrow ${showUserMenu ? 'rotated' : ''}`, children: _jsx("svg", { width: "12", height: "8", viewBox: "0 0 12 8", fill: "none", children: _jsx("path", { d: "M1 1.5L6 6.5L11 1.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) })] }) }), showUserMenu && (_jsxs("div", { ref: dropdownRef, className: `user-dropdown ${isAnimating ? 'closing' : ''}`, children: [_jsxs("div", { className: "dropdown-header", children: [_jsx("div", { className: "dropdown-avatar", style: getAvatarGradient(user.pseudo), children: _jsx("span", { children: user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U' }) }), _jsxs("div", { className: "dropdown-user-info", children: [_jsx("div", { className: "dropdown-name", children: user.pseudo }), _jsxs("div", { className: "dropdown-balance", children: [formatBalance(user.balance), " FCFA"] })] })] }), _jsxs("div", { className: "dropdown-section", children: [_jsx("button", { onClick: () => handleMenuItemClick('/profile'), className: "dropdown-item", children: _jsxs("div", { className: "item-content", children: [_jsx("span", { className: "item-label", children: "Mon Profil" }), _jsx("span", { className: "item-desc", children: "Informations personnelles" })] }) }), _jsx("button", { onClick: () => handleMenuItemClick('/wallet'), className: "dropdown-item", children: _jsxs("div", { className: "item-content", children: [_jsx("span", { className: "item-label", children: "Portefeuille" }), _jsx("span", { className: "item-desc", children: "G\u00E9rer vos finances" })] }) }), _jsx("button", { onClick: () => handleMenuItemClick('/history'), className: "dropdown-item", children: _jsxs("div", { className: "item-content", children: [_jsx("span", { className: "item-label", children: "Historique" }), _jsx("span", { className: "item-desc", children: "Vos parties et transactions" })] }) }), _jsx("button", { onClick: () => handleMenuItemClick('/achievements'), className: "dropdown-item", children: _jsxs("div", { className: "item-content", children: [_jsx("span", { className: "item-label", children: "Succ\u00E8s" }), _jsx("span", { className: "item-desc", children: "Vos r\u00E9alisations" })] }) }), _jsx("button", { onClick: () => handleMenuItemClick('/stats'), className: "dropdown-item", children: _jsxs("div", { className: "item-content", children: [_jsx("span", { className: "item-label", children: "Statistiques" }), _jsx("span", { className: "item-desc", children: "Dashboard et classements" })] }) }), _jsx("button", { onClick: () => handleMenuItemClick('/bots'), className: "dropdown-item", children: _jsxs("div", { className: "item-content", children: [_jsx("span", { className: "item-label", children: "Bots IA" }), _jsx("span", { className: "item-desc", children: "G\u00E9rer vos adversaires IA" })] }) })] }), _jsx("div", { className: "dropdown-divider" }), _jsxs("div", { className: "dropdown-section", children: [_jsx("button", { onClick: () => handleMenuItemClick('/rules'), className: "dropdown-item", children: _jsxs("div", { className: "item-content", children: [_jsx("span", { className: "item-label", children: "R\u00E8gles du jeu" }), _jsx("span", { className: "item-desc", children: "Comment jouer" })] }) }), _jsx("button", { onClick: () => handleMenuItemClick('/support'), className: "dropdown-item", children: _jsxs("div", { className: "item-content", children: [_jsx("span", { className: "item-label", children: "Aide & Support" }), _jsx("span", { className: "item-desc", children: "Besoin d'aide ?" })] }) }), _jsx("button", { onClick: () => handleMenuItemClick('/settings'), className: "dropdown-item", children: _jsxs("div", { className: "item-content", children: [_jsx("span", { className: "item-label", children: "Param\u00E8tres" }), _jsx("span", { className: "item-desc", children: "Pr\u00E9f\u00E9rences du compte" })] }) })] }), _jsx("div", { className: "dropdown-divider" }), _jsx("div", { className: "dropdown-section", children: _jsx("button", { onClick: handleLogout, className: "dropdown-item logout-item", children: _jsxs("div", { className: "item-content", children: [_jsx("span", { className: "item-label", children: "D\u00E9connexion" }), _jsx("span", { className: "item-desc", children: "Quitter votre session" })] }) }) })] }))] })] })) : (
                /* État non connecté */
                _jsxs("div", { className: "auth-section", children: [_jsxs(Link, { to: "/auth", className: "auth-btn login-btn", children: [_jsx("span", { className: "btn-icon", children: "\uD83D\uDC64" }), "Connexion"] }), _jsxs(Link, { to: "/auth", className: "auth-btn register-btn", children: [_jsx("span", { className: "btn-icon", children: "\u2728" }), "S'inscrire"] })] }))] }) }));
}
