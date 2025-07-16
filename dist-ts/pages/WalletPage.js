import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import NotificationToast from '../components/NotificationToast';
export default function WalletPage() {
    const { user } = useAuth();
    const { transactions, loading, deposit, withdraw, getWalletStats } = useWallet();
    const [activeTab, setActiveTab] = useState('overview');
    const [notifications, setNotifications] = useState([]);
    // États pour les formulaires
    const [depositForm, setDepositForm] = useState({
        amount: '',
        method: 'airtel',
        phoneNumber: ''
    });
    const [withdrawForm, setWithdrawForm] = useState({
        amount: '',
        method: 'airtel',
        phoneNumber: ''
    });
    const addNotification = (type, message, title = '') => {
        const notification = {
            id: Math.random().toString(36),
            type,
            title,
            message,
            timestamp: new Date()
        };
        setNotifications(prev => [...prev, notification]);
    };
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    const methods = [
        { id: 'airtel', name: 'Airtel Money', icon: '', color: 'bg-red-600' },
        { id: 'moov', name: 'Moov Money', icon: '', color: 'bg-orange-600' }
    ];
    const handleDeposit = async (e) => {
        e.preventDefault();
        const amount = parseInt(depositForm.amount);
        if (!amount || !depositForm.phoneNumber) {
            addNotification('error', 'Veuillez remplir tous les champs');
            return;
        }
        const result = await deposit(amount, depositForm.method, depositForm.phoneNumber);
        if (result.success) {
            addNotification('success', `Recharge de ${amount} FCFA en cours...`, 'Dépôt initié');
            setDepositForm({ amount: '', method: 'airtel', phoneNumber: '' });
        }
        else {
            addNotification('error', result.error);
        }
    };
    const handleWithdraw = async (e) => {
        e.preventDefault();
        const amount = parseInt(withdrawForm.amount);
        if (!amount || !withdrawForm.phoneNumber) {
            addNotification('error', 'Veuillez remplir tous les champs');
            return;
        }
        const result = await withdraw(amount, withdrawForm.method, withdrawForm.phoneNumber);
        if (result.success) {
            addNotification('success', `Retrait de ${amount} FCFA en cours...`, 'Retrait initié');
            setWithdrawForm({ amount: '', method: 'airtel', phoneNumber: '' });
        }
        else {
            addNotification('error', result.error);
        }
    };
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('fr-FR').format(amount);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const getTransactionIcon = (type) => {
        switch (type) {
            case 'deposit': return '📈';
            case 'withdraw': return '📉';
            case 'game_win': return '🏆';
            case 'game_bet': return '🎯';
            default: return '💰';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-400';
            case 'pending': return 'text-yellow-400';
            case 'failed': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };
    const stats = getWalletStats();
    return (_jsxs("div", { className: "wallet-page", children: [_jsx(NotificationToast, { notifications: notifications, onRemove: removeNotification }), _jsxs("div", { className: "wallet-header", children: [_jsx(Link, { to: "/", className: "back-btn", children: "\u2190 Retour" }), _jsx("h1", { className: "page-title", children: "\uD83D\uDCB0 Portefeuille" }), _jsx("div", {})] }), _jsxs("div", { className: "balance-card", children: [_jsxs("div", { className: "balance-main", children: [_jsx("div", { className: "balance-label", children: "Solde disponible" }), _jsxs("div", { className: "balance-amount text-center", children: [formatAmount(user?.balance || 0), " FCFA"] })] }), _jsxs("div", { className: "balance-actions", children: [_jsxs("button", { onClick: () => setActiveTab('deposit'), className: "balance-btn deposit", children: [_jsx("span", {}), "Recharger"] }), _jsxs("button", { onClick: () => setActiveTab('withdraw'), className: "balance-btn withdraw", children: [_jsx("span", {}), "Retirer"] })] })] }), _jsx("div", { className: "wallet-tabs", children: [
                    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
                    { id: 'deposit', label: 'Recharger', icon: '📈' },
                    { id: 'withdraw', label: 'Retirer', icon: '📉' },
                    { id: 'history', label: 'Historique', icon: '📜' }
                ].map(tab => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `wallet-tab ${activeTab === tab.id ? 'active' : ''}`, children: [_jsx("span", { className: "tab-icon", children: tab.icon }), _jsx("span", { className: "tab-label", children: tab.label })] }, tab.id))) }), _jsxs("div", { className: "tab-content", children: [activeTab === 'overview' && (_jsxs("div", { className: "overview-content", children: [_jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-icon", children: "\uD83D\uDCC8" }), _jsx("div", { className: "stat-value", children: formatAmount(stats.totalDeposits) }), _jsx("div", { className: "stat-label", children: "Total recharg\u00E9" })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-icon", children: "\uD83D\uDCC9" }), _jsx("div", { className: "stat-value", children: formatAmount(stats.totalWithdrawals) }), _jsx("div", { className: "stat-label", children: "Total retir\u00E9" })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-icon", children: "\uD83C\uDFC6" }), _jsx("div", { className: "stat-value", children: formatAmount(stats.totalGameWins) }), _jsx("div", { className: "stat-label", children: "Gains de jeu" })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-icon", children: "\uD83C\uDFAF" }), _jsx("div", { className: "stat-value", children: formatAmount(stats.totalGameBets) }), _jsx("div", { className: "stat-label", children: "Mises totales" })] })] }), _jsxs("div", { className: "profit-card", children: [_jsxs("div", { className: "profit-header", children: [_jsx("span", { className: "profit-icon", children: "\uD83D\uDCB0" }), _jsx("span", { className: "profit-label", children: "Profit net du jeu" })] }), _jsxs("div", { className: `profit-amount ${stats.netGameProfit >= 0 ? 'positive' : 'negative'}`, children: [stats.netGameProfit >= 0 ? '+' : '', formatAmount(stats.netGameProfit), " FCFA"] })] })] })), activeTab === 'deposit' && (_jsx("div", { className: "form-content", children: _jsx("form", { onSubmit: handleDeposit, className: "transaction-form", children: _jsxs("div", { className: "form-section", children: [_jsxs("h3", { className: "section-title", children: [_jsx("span", { className: "section-icon", children: "\uD83D\uDCC8" }), "Recharger le compte"] }), _jsx("div", { className: "payment-methods", children: methods.map(method => (_jsxs("button", { type: "button", onClick: () => setDepositForm({ ...depositForm, method: method.id }), className: `payment-method ${depositForm.method === method.id ? 'active' : ''}`, children: [_jsx("span", { className: "method-icon", children: method.icon }), _jsx("span", { className: "method-name", children: method.name })] }, method.id))) }), _jsxs("div", { className: "quick-amounts", children: [_jsx("div", { className: "quick-amounts-label", children: "Montants rapides :" }), _jsx("div", { className: "quick-amounts-buttons", children: [500, 1000, 5000, 10000, 25000].map(amount => (_jsx("button", { type: "button", onClick: () => setDepositForm({ ...depositForm, amount: amount.toString() }), className: "quick-amount-btn", children: formatAmount(amount) }, amount))) })] }), _jsxs("div", { className: "form-fields", children: [_jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDCB0" }), "Montant (FCFA)"] }), _jsx("input", { type: "number", value: depositForm.amount, onChange: (e) => setDepositForm({ ...depositForm, amount: e.target.value }), className: "form-input", placeholder: "Montant \u00E0 recharger", min: "500", max: "500000", disabled: loading }), _jsx("div", { className: "form-help", children: "Minimum : 500 FCFA - Maximum : 500,000 FCFA" })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDCF1" }), "Num\u00E9ro de t\u00E9l\u00E9phone"] }), _jsx("input", { type: "tel", value: depositForm.phoneNumber, onChange: (e) => setDepositForm({ ...depositForm, phoneNumber: e.target.value }), className: "form-input", placeholder: "074XXXXXXXX", disabled: loading })] })] }), _jsx("button", { type: "submit", disabled: loading || !depositForm.amount || !depositForm.phoneNumber, className: "submit-btn deposit", children: loading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "loading-spinner" }), "Traitement..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "btn-icon" }), "Recharger ", depositForm.amount && `${formatAmount(parseInt(depositForm.amount))} FCFA`] })) })] }) }) })), activeTab === 'withdraw' && (_jsx("div", { className: "form-content", children: _jsx("form", { onSubmit: handleWithdraw, className: "transaction-form", children: _jsxs("div", { className: "form-section", children: [_jsxs("h3", { className: "section-title", children: [_jsx("span", { className: "section-icon", children: "\uD83D\uDCC9" }), "Retirer des gains"] }), _jsx("div", { className: "payment-methods", children: methods.map(method => (_jsxs("button", { type: "button", onClick: () => setWithdrawForm({ ...withdrawForm, method: method.id }), className: `payment-method ${withdrawForm.method === method.id ? 'active' : ''}`, children: [_jsx("span", { className: "method-icon", children: method.icon }), _jsx("span", { className: "method-name", children: method.name })] }, method.id))) }), _jsxs("div", { className: "form-fields", children: [_jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDCB0" }), "Montant (FCFA)"] }), _jsx("input", { type: "number", value: withdrawForm.amount, onChange: (e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value }), className: "form-input", placeholder: "Montant \u00E0 retirer", min: "1000", max: user?.balance || 0, disabled: loading }), _jsxs("div", { className: "form-help", children: ["Minimum : 1,000 FCFA - Disponible : ", formatAmount(user?.balance || 0), " FCFA"] })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "form-label", children: [_jsx("span", { className: "label-icon", children: "\uD83D\uDCF1" }), "Num\u00E9ro de t\u00E9l\u00E9phone"] }), _jsx("input", { type: "tel", value: withdrawForm.phoneNumber, onChange: (e) => setWithdrawForm({ ...withdrawForm, phoneNumber: e.target.value }), className: "form-input", placeholder: "+241 XX XX XX XX", disabled: loading })] }), withdrawForm.amount && (_jsxs("div", { className: "fees-info", children: [_jsxs("div", { className: "fees-row", children: [_jsx("span", { children: "Montant demand\u00E9 :" }), _jsxs("span", { children: [formatAmount(parseInt(withdrawForm.amount)), " FCFA"] })] }), _jsxs("div", { className: "fees-row", children: [_jsx("span", { children: "Frais (2%, min 100 FCFA) :" }), _jsxs("span", { children: [formatAmount(Math.max(Math.round(parseInt(withdrawForm.amount) * 0.02), 100)), " FCFA"] })] }), _jsxs("div", { className: "fees-row total", children: [_jsx("span", { children: "Total \u00E0 d\u00E9duire :" }), _jsxs("span", { children: [formatAmount(parseInt(withdrawForm.amount) + Math.max(Math.round(parseInt(withdrawForm.amount) * 0.02), 100)), " FCFA"] })] })] }))] }), _jsx("button", { type: "submit", disabled: loading || !withdrawForm.amount || !withdrawForm.phoneNumber, className: "submit-btn withdraw", children: loading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "loading-spinner" }), "Traitement..."] })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "btn-icon", children: "\uD83D\uDCC9" }), "Retirer ", withdrawForm.amount && `${formatAmount(parseInt(withdrawForm.amount))} FCFA`] })) })] }) }) })), activeTab === 'history' && (_jsx("div", { className: "history-content", children: transactions.length === 0 ? (_jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-icon", children: "\uD83D\uDCED" }), _jsx("div", { className: "empty-title", children: "Aucune transaction" }), _jsx("div", { className: "empty-message", children: "Vos transactions appara\u00EEtront ici" })] })) : (_jsx("div", { className: "transactions-list", children: transactions.map(transaction => (_jsxs("div", { className: "transaction-item", children: [_jsx("div", { className: "transaction-icon", children: getTransactionIcon(transaction.type) }), _jsxs("div", { className: "transaction-info", children: [_jsx("div", { className: "transaction-desc", children: transaction.description }), _jsxs("div", { className: "transaction-meta", children: [_jsx("span", { className: "transaction-date", children: formatDate(transaction.timestamp) }), _jsx("span", { className: `transaction-status ${getStatusColor(transaction.status)}`, children: transaction.status === 'completed' ? 'Terminé' :
                                                            transaction.status === 'pending' ? 'En cours' : 'Échec' })] }), transaction.fees > 0 && (_jsxs("div", { className: "transaction-fees", children: ["Frais: ", formatAmount(transaction.fees), " FCFA"] }))] }), _jsxs("div", { className: `transaction-amount ${transaction.type === 'withdraw' || transaction.type === 'game_bet' ? 'negative' : 'positive'}`, children: [transaction.type === 'withdraw' || transaction.type === 'game_bet' ? '-' : '+', formatAmount(Math.abs(transaction.amount)), " FCFA"] })] }, transaction.id))) })) }))] })] }));
}
