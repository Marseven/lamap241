import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
export default function HistoryPage() {
    const { user } = useAuth();
    const { transactions } = useWallet();
    const [activeTab, setActiveTab] = useState('all');
    const [filteredData, setFilteredData] = useState([]);
    const [dateFilter, setDateFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    // Données simulées pour les parties (à remplacer par vraies données)
    const gameHistory = [
        {
            id: 'game1',
            type: 'game',
            opponent: 'Alpha_241',
            result: 'win',
            amount: 1800,
            bet: 1000,
            duration: '5:32',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000),
            roomName: 'Bataille Royale'
        },
        {
            id: 'game2',
            type: 'game',
            opponent: 'Beta_GBN',
            result: 'loss',
            amount: -1000,
            bet: 1000,
            duration: '3:45',
            date: new Date(Date.now() - 5 * 60 * 60 * 1000),
            roomName: 'Défi Express'
        },
        {
            id: 'game3',
            type: 'game',
            opponent: 'IA',
            result: 'win',
            amount: 0,
            bet: 0,
            duration: '7:12',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000),
            roomName: 'Entraînement IA'
        }
    ];
    // Combiner et filtrer les données
    useEffect(() => {
        let allData = [];
        if (activeTab === 'all' || activeTab === 'games') {
            allData = [...allData, ...gameHistory];
        }
        if (activeTab === 'all' || activeTab === 'transactions') {
            const formattedTransactions = transactions.map(t => ({
                ...t,
                type: 'transaction',
                date: new Date(t.timestamp)
            }));
            allData = [...allData, ...formattedTransactions];
        }
        // Filtrer par date
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();
            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
            }
            allData = allData.filter(item => item.date >= filterDate);
        }
        // Filtrer par recherche
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            allData = allData.filter(item => {
                if (item.type === 'game') {
                    return item.opponent?.toLowerCase().includes(query) ||
                        item.roomName?.toLowerCase().includes(query);
                }
                else {
                    return item.description?.toLowerCase().includes(query) ||
                        item.method?.toLowerCase().includes(query);
                }
            });
        }
        // Trier par date (plus récent en premier)
        allData.sort((a, b) => b.date - a.date);
        setFilteredData(allData);
    }, [activeTab, dateFilter, searchQuery, transactions]);
    const formatDate = (date) => {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 60)
            return `Il y a ${diffMins} min`;
        if (diffHours < 24)
            return `Il y a ${diffHours}h`;
        if (diffDays < 7)
            return `Il y a ${diffDays}j`;
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('fr-FR').format(Math.abs(amount));
    };
    const getResultIcon = (result) => {
        switch (result) {
            case 'win': return '🏆';
            case 'loss': return '😔';
            case 'draw': return '🤝';
            default: return '🎮';
        }
    };
    const getTransactionIcon = (type) => {
        switch (type) {
            case 'deposit': return '📈';
            case 'withdraw': return '📉';
            case 'game_win': return '🏆';
            case 'game_bet': return '🎯';
            case 'bonus': return '🎁';
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
    return (_jsxs("div", { className: "history-page", children: [_jsxs("div", { className: "history-header", children: [_jsx(Link, { to: "/", className: "back-btn", children: "\u2190 Accueil" }), _jsx("h1", { className: "page-title", children: "\uD83D\uDCCA Historique" }), _jsx("div", { className: "header-stats", children: _jsxs("span", { className: "stat-item", children: [filteredData.length, " \u00E9l\u00E9ments"] }) })] }), _jsxs("div", { className: "history-filters", children: [_jsx("div", { className: "search-container", children: _jsxs("div", { className: "search-input-wrapper", children: [_jsx("span", { className: "search-icon", children: "\uD83D\uDD0D" }), _jsx("input", { type: "text", placeholder: "Rechercher...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "search-input" }), searchQuery && (_jsx("button", { onClick: () => setSearchQuery(''), className: "clear-search", children: "\u00D7" }))] }) }), _jsx("div", { className: "date-filters", children: [
                            { value: 'all', label: 'Tout' },
                            { value: 'today', label: 'Aujourd\'hui' },
                            { value: 'week', label: '7 jours' },
                            { value: 'month', label: '30 jours' }
                        ].map(filter => (_jsx("button", { onClick: () => setDateFilter(filter.value), className: `date-filter ${dateFilter === filter.value ? 'active' : ''}`, children: filter.label }, filter.value))) })] }), _jsxs("div", { className: "history-tabs", children: [_jsxs("button", { onClick: () => setActiveTab('all'), className: `history-tab ${activeTab === 'all' ? 'active' : ''}`, children: [_jsx("span", { className: "tab-icon", children: "\uD83D\uDCCB" }), _jsx("span", { className: "tab-label", children: "Tout" }), _jsx("span", { className: "tab-count", children: filteredData.length })] }), _jsxs("button", { onClick: () => setActiveTab('games'), className: `history-tab ${activeTab === 'games' ? 'active' : ''}`, children: [_jsx("span", { className: "tab-icon", children: "\uD83C\uDFAE" }), _jsx("span", { className: "tab-label", children: "Parties" }), _jsx("span", { className: "tab-count", children: filteredData.filter(item => item.type === 'game').length })] }), _jsxs("button", { onClick: () => setActiveTab('transactions'), className: `history-tab ${activeTab === 'transactions' ? 'active' : ''}`, children: [_jsx("span", { className: "tab-icon", children: "\uD83D\uDCB0" }), _jsx("span", { className: "tab-label", children: "Transactions" }), _jsx("span", { className: "tab-count", children: filteredData.filter(item => item.type === 'transaction').length })] })] }), _jsx("div", { className: "history-content", children: filteredData.length === 0 ? (_jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-icon", children: searchQuery ? '🔍' : '📭' }), _jsx("div", { className: "empty-title", children: searchQuery ? 'Aucun résultat' : 'Aucun élément' }), _jsx("div", { className: "empty-message", children: searchQuery
                                ? 'Essayez avec d\'autres mots-clés'
                                : 'Votre historique apparaîtra ici au fur et à mesure' })] })) : (_jsx("div", { className: "history-list", children: filteredData.map(item => (_jsx("div", { className: "history-item", children: item.type === 'game' ? (
                        /* Élément de partie */
                        _jsxs("div", { className: "game-item", children: [_jsx("div", { className: "item-icon", children: _jsx("span", { className: "game-result-icon", children: getResultIcon(item.result) }) }), _jsxs("div", { className: "item-content", children: [_jsxs("div", { className: "item-header", children: [_jsxs("div", { className: "item-title", children: ["vs ", item.opponent, item.opponent === 'IA' && (_jsx("span", { className: "ai-badge", children: "Entra\u00EEnement" }))] }), _jsxs("div", { className: "item-subtitle", children: [item.roomName, " \u2022 Dur\u00E9e: ", item.duration] })] }), _jsxs("div", { className: "item-details", children: [_jsx("span", { className: "game-status", children: item.result === 'win' ? 'Victoire' :
                                                        item.result === 'loss' ? 'Défaite' : 'Égalité' }), item.bet > 0 && (_jsxs("span", { className: "game-bet", children: ["Mise: ", formatAmount(item.bet), " FCFA"] }))] })] }), _jsxs("div", { className: "item-meta", children: [_jsxs("div", { className: `item-amount ${item.amount > 0 ? 'positive' :
                                                item.amount < 0 ? 'negative' : 'neutral'}`, children: [item.amount > 0 && '+', item.amount !== 0 ? `${formatAmount(item.amount)} FCFA` : 'Gratuit'] }), _jsx("div", { className: "item-date", children: formatDate(item.date) })] })] })) : (
                        /* Élément de transaction */
                        _jsxs("div", { className: "transaction-item", children: [_jsx("div", { className: "item-icon", children: _jsx("span", { className: "transaction-icon", children: getTransactionIcon(item.type) }) }), _jsxs("div", { className: "item-content", children: [_jsxs("div", { className: "item-header", children: [_jsx("div", { className: "item-title", children: item.description }), _jsxs("div", { className: "item-subtitle", children: [item.method && `via ${item.method}`, item.phoneNumber && ` • ${item.phoneNumber}`] })] }), _jsxs("div", { className: "item-details", children: [_jsx("span", { className: `transaction-status ${getStatusColor(item.status)}`, children: item.status === 'completed' ? 'Terminé' :
                                                        item.status === 'pending' ? 'En cours' :
                                                            item.status === 'failed' ? 'Échec' : item.status }), item.fees > 0 && (_jsxs("span", { className: "transaction-fees", children: ["Frais: ", formatAmount(item.fees), " FCFA"] }))] })] }), _jsxs("div", { className: "item-meta", children: [_jsxs("div", { className: `item-amount ${item.type === 'withdraw' || item.type === 'game_bet' ? 'negative' : 'positive'}`, children: [item.type === 'withdraw' || item.type === 'game_bet' ? '-' : '+', formatAmount(item.amount), " FCFA"] }), _jsx("div", { className: "item-date", children: formatDate(item.date) })] })] })) }, item.id))) })) }), filteredData.length > 0 && (_jsx("div", { className: "history-summary", children: _jsxs("div", { className: "summary-card", children: [_jsxs("div", { className: "summary-stat", children: [_jsx("span", { className: "summary-icon", children: "\uD83C\uDFAE" }), _jsxs("div", { className: "summary-content", children: [_jsx("div", { className: "summary-value", children: filteredData.filter(item => item.type === 'game').length }), _jsx("div", { className: "summary-label", children: "Parties" })] })] }), _jsxs("div", { className: "summary-stat", children: [_jsx("span", { className: "summary-icon", children: "\uD83C\uDFC6" }), _jsxs("div", { className: "summary-content", children: [_jsx("div", { className: "summary-value", children: filteredData.filter(item => item.type === 'game' && item.result === 'win').length }), _jsx("div", { className: "summary-label", children: "Victoires" })] })] }), _jsxs("div", { className: "summary-stat", children: [_jsx("span", { className: "summary-icon", children: "\uD83D\uDCB0" }), _jsxs("div", { className: "summary-content", children: [_jsx("div", { className: "summary-value", children: formatAmount(filteredData
                                                .filter(item => item.type === 'game')
                                                .reduce((sum, item) => sum + (item.amount || 0), 0)) }), _jsx("div", { className: "summary-label", children: "Gains nets (FCFA)" })] })] })] }) }))] }));
}
