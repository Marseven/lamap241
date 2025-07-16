import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/AchievementsPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export default function AchievementsPage() {
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState('all');
    // Données des succès (à remplacer par vraies données)
    const achievements = [
        // Succès de début
        {
            id: 'first_game',
            title: 'Premier pas',
            description: 'Jouer votre première partie',
            icon: '🎮',
            category: 'beginner',
            unlocked: true,
            unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            xp: 50,
            rarity: 'common'
        },
        {
            id: 'first_win',
            title: 'Première victoire',
            description: 'Remporter votre première partie',
            icon: '🏆',
            category: 'beginner',
            unlocked: true,
            unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            xp: 100,
            rarity: 'common'
        },
        {
            id: 'register_account',
            title: 'Bienvenue !',
            description: 'Créer un compte LaMap241',
            icon: '👋',
            category: 'beginner',
            unlocked: true,
            unlockedAt: new Date(user?.createdAt || Date.now()),
            xp: 25,
            rarity: 'common'
        },
        // Succès de victoires
        {
            id: 'win_streak_3',
            title: 'En forme !',
            description: 'Gagner 3 parties d\'affilée',
            icon: '🔥',
            category: 'victories',
            unlocked: false,
            progress: { current: 1, total: 3 },
            xp: 200,
            rarity: 'uncommon'
        },
        {
            id: 'win_streak_10',
            title: 'Inarrêtable',
            description: 'Gagner 10 parties d\'affilée',
            icon: '⚡',
            category: 'victories',
            unlocked: false,
            progress: { current: 1, total: 10 },
            xp: 500,
            rarity: 'rare'
        },
        {
            id: 'total_wins_10',
            title: 'Vainqueur confirmé',
            description: 'Remporter 10 parties au total',
            icon: '🎯',
            category: 'victories',
            unlocked: false,
            progress: { current: 2, total: 10 },
            xp: 300,
            rarity: 'uncommon'
        },
        {
            id: 'total_wins_50',
            title: 'Champion',
            description: 'Remporter 50 parties au total',
            icon: '👑',
            category: 'victories',
            unlocked: false,
            progress: { current: 2, total: 50 },
            xp: 1000,
            rarity: 'epic'
        },
        // Succès financiers
        {
            id: 'first_deposit',
            title: 'Premier dépôt',
            description: 'Effectuer votre premier dépôt',
            icon: '💳',
            category: 'money',
            unlocked: true,
            unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            xp: 75,
            rarity: 'common'
        },
        {
            id: 'big_win',
            title: 'Gros lot',
            description: 'Gagner plus de 10,000 FCFA en une partie',
            icon: '💰',
            category: 'money',
            unlocked: false,
            progress: { current: 1800, total: 10000 },
            xp: 400,
            rarity: 'rare'
        },
        {
            id: 'millionaire',
            title: 'Millionnaire',
            description: 'Atteindre 1,000,000 FCFA de gains totaux',
            icon: '💎',
            category: 'money',
            unlocked: false,
            progress: { current: 15000, total: 1000000 },
            xp: 2000,
            rarity: 'legendary'
        },
        // Succès spéciaux
        {
            id: 'speed_demon',
            title: 'Éclair',
            description: 'Finir une partie en moins de 2 minutes',
            icon: '⚡',
            category: 'special',
            unlocked: false,
            xp: 150,
            rarity: 'uncommon'
        },
        {
            id: 'comeback_king',
            title: 'Retour gagnant',
            description: 'Gagner une partie après avoir été mené 0-2',
            icon: '🔄',
            category: 'special',
            unlocked: false,
            xp: 250,
            rarity: 'rare'
        },
        {
            id: 'perfect_game',
            title: 'Partie parfaite',
            description: 'Gagner sans perdre une seule manche',
            icon: '✨',
            category: 'special',
            unlocked: false,
            xp: 300,
            rarity: 'epic'
        },
        // Succès sociaux
        {
            id: 'social_player',
            title: 'Sociable',
            description: 'Jouer contre 10 joueurs différents',
            icon: '👥',
            category: 'social',
            unlocked: false,
            progress: { current: 3, total: 10 },
            xp: 200,
            rarity: 'uncommon'
        },
        {
            id: 'friend_referral',
            title: 'Ambassadeur',
            description: 'Inviter 5 amis à rejoindre LaMap241',
            icon: '🎪',
            category: 'social',
            unlocked: false,
            progress: { current: 0, total: 5 },
            xp: 500,
            rarity: 'rare'
        }
    ];
    const categories = [
        { id: 'all', name: 'Tous', icon: '🏆' },
        { id: 'beginner', name: 'Débutant', icon: '🌱' },
        { id: 'victories', name: 'Victoires', icon: '👑' },
        { id: 'money', name: 'Financier', icon: '💰' },
        { id: 'special', name: 'Spécial', icon: '✨' },
        { id: 'social', name: 'Social', icon: '👥' }
    ];
    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return '#9ca3af';
            case 'uncommon': return '#10b981';
            case 'rare': return '#3b82f6';
            case 'epic': return '#8b5cf6';
            case 'legendary': return '#f59e0b';
            default: return '#6b7280';
        }
    };
    const getRarityLabel = (rarity) => {
        switch (rarity) {
            case 'common': return 'Commun';
            case 'uncommon': return 'Peu commun';
            case 'rare': return 'Rare';
            case 'epic': return 'Épique';
            case 'legendary': return 'Légendaire';
            default: return '';
        }
    };
    const filteredAchievements = activeCategory === 'all'
        ? achievements
        : achievements.filter(a => a.category === activeCategory);
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };
    return (_jsxs("div", { className: "achievements-page", children: [_jsxs("div", { className: "achievements-header", children: [_jsx(Link, { to: "/", className: "back-btn", children: "\u2190 Accueil" }), _jsx("h1", { className: "page-title", children: "\uD83C\uDFC6 Succ\u00E8s" }), _jsx("div", { className: "achievements-stats", children: _jsxs("span", { className: "stat-item", children: [unlockedCount, "/", achievements.length] }) })] }), _jsxs("div", { className: "achievements-overview", children: [_jsxs("div", { className: "overview-card", children: [_jsxs("div", { className: "overview-stat", children: [_jsx("div", { className: "stat-icon", children: "\uD83C\uDFC6" }), _jsxs("div", { className: "stat-content", children: [_jsx("div", { className: "stat-value", children: unlockedCount }), _jsx("div", { className: "stat-label", children: "Succ\u00E8s d\u00E9bloqu\u00E9s" })] })] }), _jsxs("div", { className: "overview-stat", children: [_jsx("div", { className: "stat-icon", children: "\uD83D\uDCCA" }), _jsxs("div", { className: "stat-content", children: [_jsxs("div", { className: "stat-value", children: [Math.round((unlockedCount / achievements.length) * 100), "%"] }), _jsx("div", { className: "stat-label", children: "Progression" })] })] }), _jsxs("div", { className: "overview-stat", children: [_jsx("div", { className: "stat-icon", children: "\u2B50" }), _jsxs("div", { className: "stat-content", children: [_jsx("div", { className: "stat-value", children: totalXP }), _jsx("div", { className: "stat-label", children: "XP Total" })] })] })] }), _jsxs("div", { className: "global-progress", children: [_jsxs("div", { className: "progress-header", children: [_jsx("span", { className: "progress-label", children: "Progression globale" }), _jsxs("span", { className: "progress-text", children: [unlockedCount, "/", achievements.length] })] }), _jsx("div", { className: "progress-bar", children: _jsx("div", { className: "progress-fill", style: { width: `${(unlockedCount / achievements.length) * 100}%` } }) })] })] }), _jsx("div", { className: "achievements-categories", children: categories.map(category => {
                    const categoryAchievements = category.id === 'all'
                        ? achievements
                        : achievements.filter(a => a.category === category.id);
                    const categoryUnlocked = categoryAchievements.filter(a => a.unlocked).length;
                    return (_jsxs("button", { onClick: () => setActiveCategory(category.id), className: `category-btn ${activeCategory === category.id ? 'active' : ''}`, children: [_jsx("span", { className: "category-icon", children: category.icon }), _jsxs("div", { className: "category-content", children: [_jsx("span", { className: "category-name", children: category.name }), _jsxs("span", { className: "category-count", children: [categoryUnlocked, "/", categoryAchievements.length] })] })] }, category.id));
                }) }), _jsx("div", { className: "achievements-list", children: filteredAchievements.map(achievement => (_jsxs("div", { className: `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`, children: [_jsxs("div", { className: "achievement-icon-wrapper", children: [_jsx("div", { className: "achievement-icon", style: {
                                        filter: achievement.unlocked ? 'none' : 'grayscale(100%)',
                                        borderColor: getRarityColor(achievement.rarity)
                                    }, children: _jsx("span", { children: achievement.icon }) }), achievement.unlocked && (_jsx("div", { className: "unlock-badge", children: "\u2713" }))] }), _jsxs("div", { className: "achievement-content", children: [_jsxs("div", { className: "achievement-header", children: [_jsx("h3", { className: "achievement-title", children: achievement.title }), _jsxs("div", { className: "achievement-meta", children: [_jsx("span", { className: "achievement-rarity", style: { color: getRarityColor(achievement.rarity) }, children: getRarityLabel(achievement.rarity) }), _jsxs("span", { className: "achievement-xp", children: ["+", achievement.xp, " XP"] })] })] }), _jsx("p", { className: "achievement-description", children: achievement.description }), achievement.unlocked ? (_jsxs("div", { className: "achievement-unlocked", children: [_jsx("span", { className: "unlock-icon", children: "\uD83C\uDF89" }), _jsxs("span", { className: "unlock-text", children: ["D\u00E9bloqu\u00E9 le ", formatDate(achievement.unlockedAt)] })] })) : achievement.progress ? (_jsxs("div", { className: "achievement-progress", children: [_jsxs("div", { className: "progress-header", children: [_jsx("span", { className: "progress-label", children: "Progression" }), _jsxs("span", { className: "progress-text", children: [achievement.progress.current.toLocaleString(), "/", achievement.progress.total.toLocaleString()] })] }), _jsx("div", { className: "progress-bar", children: _jsx("div", { className: "progress-fill", style: {
                                                    width: `${Math.min((achievement.progress.current / achievement.progress.total) * 100, 100)}%`,
                                                    backgroundColor: getRarityColor(achievement.rarity)
                                                } }) })] })) : (_jsxs("div", { className: "achievement-locked", children: [_jsx("span", { className: "lock-icon", children: "\uD83D\uDD12" }), _jsx("span", { className: "lock-text", children: "\u00C0 d\u00E9bloquer" })] }))] })] }, achievement.id))) }), _jsxs("div", { className: "achievements-tips", children: [_jsx("h3", { className: "tips-title", children: "\uD83D\uDCA1 Conseils pour d\u00E9bloquer plus de succ\u00E8s" }), _jsxs("div", { className: "tips-list", children: [_jsxs("div", { className: "tip-item", children: [_jsx("span", { className: "tip-icon", children: "\uD83C\uDFAE" }), _jsxs("div", { className: "tip-content", children: [_jsx("div", { className: "tip-title", children: "Jouez r\u00E9guli\u00E8rement" }), _jsx("div", { className: "tip-desc", children: "Plus vous jouez, plus vous d\u00E9bloquez de succ\u00E8s" })] })] }), _jsxs("div", { className: "tip-item", children: [_jsx("span", { className: "tip-icon", children: "\uD83D\uDC65" }), _jsxs("div", { className: "tip-content", children: [_jsx("div", { className: "tip-title", children: "D\u00E9fiez diff\u00E9rents joueurs" }), _jsx("div", { className: "tip-desc", children: "Variez vos adversaires pour d\u00E9bloquer les succ\u00E8s sociaux" })] })] }), _jsxs("div", { className: "tip-item", children: [_jsx("span", { className: "tip-icon", children: "\uD83D\uDCB0" }), _jsxs("div", { className: "tip-content", children: [_jsx("div", { className: "tip-title", children: "Participez aux gros enjeux" }), _jsx("div", { className: "tip-desc", children: "Les parties avec de grosses mises offrent plus de r\u00E9compenses" })] })] }), _jsxs("div", { className: "tip-item", children: [_jsx("span", { className: "tip-icon", children: "\u26A1" }), _jsxs("div", { className: "tip-content", children: [_jsx("div", { className: "tip-title", children: "Ma\u00EEtrisez votre jeu" }), _jsx("div", { className: "tip-desc", children: "Les succ\u00E8s sp\u00E9ciaux r\u00E9compensent les techniques avanc\u00E9es" })] })] })] })] })] }));
}
