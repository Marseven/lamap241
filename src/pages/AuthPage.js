import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
        }
        else if (formData.pseudo.length < 3) {
            newErrors.pseudo = 'Le pseudo doit contenir au moins 3 caractères';
        }
        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        }
        else if (formData.password.length < 6) {
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
        if (!validateForm())
            return;
        setLoading(true);
        try {
            let result;
            if (activeTab === 'login') {
                result = await login({
                    pseudo: formData.pseudo,
                    password: formData.password
                });
            }
            else {
                result = await register(formData);
            }
            if (result.success) {
                navigate('/');
            }
            else {
                setErrors({ general: result.error });
            }
        }
        catch (error) {
            setErrors({ general: 'Une erreur est survenue' });
        }
        finally {
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
    return (_jsx("div", { className: "auth-page", children: _jsxs("div", { className: "auth-container", children: [_jsxs("div", { className: "auth-header", children: [_jsx("img", { src: "/logo.png", alt: "LaMap241", className: "auth-logo" }), _jsx("p", { className: "auth-subtitle", children: "\uD83C\uDDEC\uD83C\uDDE6 Jeu de cartes" })] }), _jsxs("div", { className: "auth-tabs", children: [_jsxs("button", { onClick: () => switchTab('login'), className: `auth-tab ${activeTab === 'login' ? 'active' : ''}`, children: [_jsx("span", { className: "tab-icon" }), "Connexion"] }), _jsxs("button", { onClick: () => switchTab('register'), className: `auth-tab ${activeTab === 'register' ? 'active' : ''}`, children: [_jsx("span", { className: "tab-icon" }), "Inscription"] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "auth-form", children: [errors.general && (_jsxs("div", { className: "error-message general", children: ["\u26A0\uFE0F ", errors.general] })), _jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "pseudo", className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDC64" }), "Pseudo"] }), _jsx("input", { type: "text", id: "pseudo", name: "pseudo", value: formData.pseudo, onChange: handleInputChange, className: `form-input ${errors.pseudo ? 'error' : ''}`, placeholder: "Ton pseudo de joueur", disabled: loading }), errors.pseudo && (_jsx("div", { className: "error-message", children: errors.pseudo }))] }), activeTab === 'register' && (_jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "email", className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDCE7" }), "Email (optionnel)"] }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleInputChange, className: `form-input ${errors.email ? 'error' : ''}`, placeholder: "ton.email@exemple.com", disabled: loading }), errors.email && (_jsx("div", { className: "error-message", children: errors.email }))] })), activeTab === 'register' && (_jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "phone", className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDCF1" }), "T\u00E9l\u00E9phone"] }), _jsx("input", { type: "tel", id: "phone", name: "phone", value: formData.phone, onChange: handleInputChange, className: `form-input ${errors.phone ? 'error' : ''}`, placeholder: "+241 XX XX XX XX", disabled: loading }), errors.phone && (_jsx("div", { className: "error-message", children: errors.phone }))] })), _jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "password", className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDD12" }), "Mot de passe"] }), _jsx("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleInputChange, className: `form-input ${errors.password ? 'error' : ''}`, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", disabled: loading }), errors.password && (_jsx("div", { className: "error-message", children: errors.password }))] }), activeTab === 'register' && (_jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "confirmPassword", className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDD12" }), "Confirmer le mot de passe"] }), _jsx("input", { type: "password", id: "confirmPassword", name: "confirmPassword", value: formData.confirmPassword, onChange: handleInputChange, className: `form-input ${errors.confirmPassword ? 'error' : ''}`, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", disabled: loading }), errors.confirmPassword && (_jsx("div", { className: "error-message", children: errors.confirmPassword }))] })), _jsx("button", { type: "submit", disabled: loading, className: "auth-submit-btn", children: loading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "loading-spinner" }), activeTab === 'login' ? 'Connexion...' : 'Inscription...'] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "btn-icon", children: activeTab === 'login' ? '' : '' }), activeTab === 'login' ? 'Se connecter' : 'S\'inscrire'] })) })] }), activeTab === 'register' && (_jsx("div", { className: "bonus-info", children: _jsxs("div", { className: "bonus-card", children: [_jsx("span", { className: "bonus-icon", children: "\uD83C\uDF81" }), _jsxs("div", { className: "bonus-text", children: [_jsx("div", { className: "bonus-title", children: "Bonus de bienvenue" }), _jsx("div", { className: "bonus-amount", children: "1000 FCFA offerts !" })] })] }) })), _jsx("div", { className: "demo-info", children: _jsxs("div", { className: "demo-card", children: [_jsx("span", { className: "demo-icon", children: "\uD83D\uDCA1" }), _jsxs("div", { className: "demo-text", children: [_jsx("strong", { children: "Mode d\u00E9mo :" }), " Utilise n'importe quel pseudo/mot de passe pour tester l'app"] })] }) })] }) }));
}
