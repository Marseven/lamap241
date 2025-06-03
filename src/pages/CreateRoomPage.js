import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameRoom } from '../contexts/GameRoomContext';
import { useNotifications } from '../hooks/useNotifications';
import NotificationToast from '../components/NotificationToast';
export default function CreateRoomPage() {
    const { user } = useAuth();
    const { createRoom, loading } = useGameRoom();
    const { notifications, addNotification, removeNotification } = useNotifications();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        bet: '1000',
        timeLimit: '300',
        allowSpectators: false,
        roundsToWin: '3'
    });
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Le nom de la salle est requis';
        }
        else if (formData.name.trim().length < 3) {
            newErrors.name = 'Le nom doit contenir au moins 3 caractères';
        }
        else if (formData.name.trim().length > 30) {
            newErrors.name = 'Le nom ne peut pas dépasser 30 caractères';
        }
        const bet = parseInt(formData.bet);
        if (!bet || bet < 500) {
            newErrors.bet = 'Mise minimum : 500 FCFA';
        }
        else if (bet > 100000) {
            newErrors.bet = 'Mise maximum : 100,000 FCFA';
        }
        else if (bet > (user?.balance || 0)) {
            newErrors.bet = 'Solde insuffisant';
        }
        const timeLimit = parseInt(formData.timeLimit);
        if (timeLimit && (timeLimit < 60 || timeLimit > 1800)) {
            newErrors.timeLimit = 'Temps de jeu entre 1 et 30 minutes';
        }
        const rounds = parseInt(formData.roundsToWin);
        if (!rounds || rounds < 1 || rounds > 10) {
            newErrors.roundsToWin = 'Nombre de manches entre 1 et 10';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        try {
            const roomData = {
                name: formData.name.trim(),
                bet: parseInt(formData.bet),
                timeLimit: parseInt(formData.timeLimit),
                allowSpectators: formData.allowSpectators,
                roundsToWin: parseInt(formData.roundsToWin)
            };
            const result = await createRoom(roomData);
            if (result.success) {
                addNotification('success', 'Salle créée avec succès !');
                navigate(`/game/${result.room.id}`);
            }
            else {
                addNotification('error', result.error);
            }
        }
        catch (error) {
            addNotification('error', 'Erreur lors de la création de la salle');
        }
    };
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    const quickBets = [500, 1000, 2000, 5000, 10000];
    const timeOptions = [
        { value: '180', label: '3 minutes' },
        { value: '300', label: '5 minutes' },
        { value: '600', label: '10 minutes' },
        { value: '900', label: '15 minutes' },
        { value: '1800', label: '30 minutes' },
        { value: '0', label: 'Pas de limite' }
    ];
    return (_jsxs("div", { className: "create-room-page", children: [_jsx(NotificationToast, { notifications: notifications, onRemove: removeNotification }), _jsxs("div", { className: "create-header", children: [_jsx(Link, { to: "/rooms", className: "back-btn", children: "\u2190 Retour" }), _jsx("h1", { className: "page-title", children: "\uD83C\uDFAE Cr\u00E9er une salle" }), _jsxs("div", { className: "balance-display", children: [new Intl.NumberFormat('fr-FR').format(user?.balance || 0), " FCFA"] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "create-form", children: [_jsxs("div", { className: "form-section", children: [_jsxs("h3", { className: "section-title", children: [_jsx("span", { className: "section-icon", children: "\uD83C\uDFF7\uFE0F" }), "Informations de base"] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDCDD" }), "Nom de la salle"] }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, className: `form-input ${errors.name ? 'error' : ''}`, placeholder: "Ex: Bataille \u00E9pique \uD83D\uDD25", maxLength: "30", disabled: loading }), errors.name && (_jsx("div", { className: "error-message", children: errors.name })), _jsxs("div", { className: "form-help", children: [formData.name.length, "/30 caract\u00E8res"] })] }), _jsx("div", { className: "form-group" })] }), _jsxs("div", { className: "form-section", children: [_jsxs("h3", { className: "section-title", children: [_jsx("span", { className: "section-icon", children: "\uD83D\uDCB0" }), "Mise et enjeux"] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDCB5" }), "Mise par joueur"] }), _jsx("div", { className: "quick-bets", children: quickBets.map(amount => (_jsx("button", { type: "button", onClick: () => setFormData({ ...formData, bet: amount.toString() }), className: `quick-bet-btn ${formData.bet === amount.toString() ? 'active' : ''}`, disabled: loading || amount > (user?.balance || 0), children: new Intl.NumberFormat('fr-FR').format(amount) }, amount))) }), _jsx("input", { type: "number", name: "bet", value: formData.bet, onChange: handleInputChange, className: `form-input ${errors.bet ? 'error' : ''}`, placeholder: "Montant personnalis\u00E9", min: "500", max: "100000", disabled: loading }), errors.bet && (_jsx("div", { className: "error-message", children: errors.bet })), formData.bet && !isNaN(parseInt(formData.bet)) && (_jsxs("div", { className: "pot-calculation", children: [_jsxs("div", { className: "pot-row", children: [_jsx("span", { children: "Mise totale (2 joueurs) :" }), _jsxs("span", { children: [new Intl.NumberFormat('fr-FR').format(parseInt(formData.bet) * 2), " FCFA"] })] }), _jsxs("div", { className: "pot-row", children: [_jsx("span", { children: "Commission La Map (10%) :" }), _jsxs("span", { children: ["-", new Intl.NumberFormat('fr-FR').format(Math.round(parseInt(formData.bet) * 2 * 0.1)), " FCFA"] })] }), _jsxs("div", { className: "pot-row total", children: [_jsx("span", { children: "Gains du gagnant :" }), _jsxs("span", { children: [new Intl.NumberFormat('fr-FR').format(Math.round(parseInt(formData.bet) * 2 * 0.9)), " FCFA"] })] })] }))] })] }), _jsxs("div", { className: "form-section", children: [_jsxs("h3", { className: "section-title", children: [_jsx("span", { className: "section-icon", children: "\u2699\uFE0F" }), "Param\u00E8tres de jeu"] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83C\uDFC6" }), "Manches \u00E0 gagner"] }), _jsx("select", { name: "roundsToWin", value: formData.roundsToWin, onChange: handleInputChange, className: "form-select", disabled: loading, children: [1, 2, 3, 4, 5].map(num => (_jsxs("option", { value: num.toString(), children: ["Premier \u00E0 ", num, " manche", num > 1 ? 's' : ''] }, num))) }), errors.roundsToWin && (_jsx("div", { className: "error-message", children: errors.roundsToWin }))] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\u23F1\uFE0F" }), "Temps limite par partie"] }), _jsx("select", { name: "timeLimit", value: formData.timeLimit, onChange: handleInputChange, className: "form-select", disabled: loading, children: timeOptions.map(option => (_jsx("option", { value: option.value, children: option.label }, option.value))) }), errors.timeLimit && (_jsx("div", { className: "error-message", children: errors.timeLimit })), _jsx("div", { className: "form-help", children: "Si le temps est \u00E9coul\u00E9, la partie se termine par \u00E9galit\u00E9" })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", name: "allowSpectators", checked: formData.allowSpectators, onChange: handleInputChange, className: "checkbox-input", disabled: loading }), _jsx("span", { className: "checkbox-custom" }), _jsxs("span", { className: "checkbox-text", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDC65" }), "Autoriser les spectateurs"] })] }), _jsx("div", { className: "form-help", children: "Les autres joueurs pourront regarder votre partie" })] })] }), _jsxs("div", { className: "form-section", children: [_jsxs("h3", { className: "section-title", children: [_jsx("span", { className: "section-icon", children: "\u26A0\uFE0F" }), "R\u00E8gles importantes"] }), _jsxs("div", { className: "rules-card", children: [_jsxs("div", { className: "rule-item", children: [_jsx("span", { className: "rule-icon", children: "\uD83D\uDEAB" }), _jsxs("span", { className: "rule-text", children: [_jsx("strong", { children: "Pas d'abandon autoris\u00E9" }), " - Quitter en cours de partie = perte de la mise"] })] }), _jsxs("div", { className: "rule-item", children: [_jsx("span", { className: "rule-icon", children: "\uD83D\uDCB0" }), _jsxs("span", { className: "rule-text", children: [_jsx("strong", { children: "Mise imm\u00E9diate" }), " - Votre mise sera d\u00E9bit\u00E9e d\u00E8s la cr\u00E9ation"] })] }), _jsxs("div", { className: "rule-item", children: [_jsx("span", { className: "rule-icon", children: "\u23F0" }), _jsxs("span", { className: "rule-text", children: [_jsx("strong", { children: "Salle temporaire" }), " - Suppression automatique apr\u00E8s 1h sans activit\u00E9"] })] }), _jsxs("div", { className: "rule-item", children: [_jsx("span", { className: "rule-icon", children: "\uD83C\uDFC6" }), _jsxs("span", { className: "rule-text", children: [_jsx("strong", { children: "Gains instantan\u00E9s" }), " - Le gagnant re\u00E7oit 90% du pot imm\u00E9diatement"] })] })] })] }), _jsx("button", { type: "submit", disabled: loading || !formData.name.trim() || !formData.bet, className: "create-submit-btn", children: loading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "loading-spinner" }), "Cr\u00E9ation en cours..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "btn-icon", children: "\uD83D\uDE80" }), "Cr\u00E9er la salle (", formData.bet && `${new Intl.NumberFormat('fr-FR').format(parseInt(formData.bet))} FCFA`, ")"] })) })] })] }));
}
