import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
export default function AppHeader({ user = null, onLogout = () => { }, showBalance = true }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const formatBalance = (balance) => {
        if (balance >= 1000000) {
            return (balance / 1000000).toFixed(1) + 'M';
        }
        else if (balance >= 1000) {
            return (balance / 1000).toFixed(1) + 'K';
        }
        return balance.toString();
    };
    return (_jsx("header", { className: "app-header", children: _jsxs("div", { className: "header-content", children: [_jsx(Link, { to: "/", className: "logo-section", children: _jsx("img", { src: "/logo.png", alt: "LaMap241", className: "header-logo" }) }), user ? (_jsxs("div", { className: "user-section", children: [showBalance && (_jsxs("div", { className: "balance-display", children: [_jsx("span", { className: "balance-icon", children: "\uD83E\uDE99" }), _jsx("span", { className: "balance-amount", children: formatBalance(user.balance) })] })), _jsxs("button", { className: "notification-btn", children: [_jsx("span", { className: "notification-icon", children: "\uD83D\uDD14" }), _jsx("span", { className: "notification-badge", children: "3" })] }), _jsxs("div", { className: "user-avatar-section", children: [_jsxs("button", { className: "user-avatar", onClick: () => setShowUserMenu(!showUserMenu), children: [_jsx("div", { className: "avatar-circle", children: _jsx("span", { className: "avatar-text", children: user.pseudo ? user.pseudo.charAt(0).toUpperCase() : 'U' }) }), _jsxs("div", { className: "user-info", children: [_jsx("div", { className: "user-name", children: user.pseudo }), _jsx("div", { className: "user-status", children: "En ligne" })] }), _jsx("span", { className: "dropdown-arrow", children: "\u2304" })] }), showUserMenu && (_jsxs("div", { className: "user-dropdown", children: [_jsxs(Link, { to: "/profile", className: "dropdown-item", children: [_jsx("span", { className: "dropdown-icon", children: "\uD83D\uDC64" }), "Profil"] }), _jsxs(Link, { to: "/wallet", className: "dropdown-item", children: [_jsx("span", { className: "dropdown-icon", children: "\uD83D\uDCB0" }), "Portefeuille"] }), _jsxs(Link, { to: "/history", className: "dropdown-item", children: [_jsx("span", { className: "dropdown-icon", children: "\uD83D\uDCCA" }), "Historique"] }), _jsx("div", { className: "dropdown-divider" }), _jsxs(Link, { to: "/settings", className: "dropdown-item", children: [_jsx("span", { className: "dropdown-icon", children: "\u2699\uFE0F" }), "Param\u00E8tres"] }), _jsxs("button", { onClick: onLogout, className: "dropdown-item logout", children: [_jsx("span", { className: "dropdown-icon", children: "\uD83D\uDEAA" }), "D\u00E9connexion"] })] }))] })] })) : (
                /* État non connecté */
                _jsxs("div", { className: "auth-section", children: [_jsx(Link, { to: "/login", className: "auth-btn login-btn", children: "Connexion" }), _jsx(Link, { to: "/register", className: "auth-btn register-btn", children: "S'inscrire" })] }))] }) }));
}
