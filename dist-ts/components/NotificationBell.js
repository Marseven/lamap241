import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/NotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
export default function NotificationBell() {
    const { notifications, clearAllNotifications, markAsRead } = useNotifications();
    const [showPanel, setShowPanel] = useState(false);
    const panelRef = useRef(null);
    const buttonRef = useRef(null);
    const unreadCount = notifications.filter(n => !n.read).length;
    const recentNotifications = notifications.slice(0, 10);
    const togglePanel = () => {
        setShowPanel(!showPanel);
    };
    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        if (notification.action && notification.action.callback) {
            notification.action.callback();
            setShowPanel(false);
        }
    };
    const handleClearAll = () => {
        clearAllNotifications();
        setShowPanel(false);
    };
    // Fermer le panel en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showPanel &&
                panelRef.current &&
                buttonRef.current &&
                !panelRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)) {
                setShowPanel(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPanel]);
    // Marquer toutes les notifications comme lues quand le panel s'ouvre
    useEffect(() => {
        if (showPanel) {
            const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
            unreadIds.forEach(id => markAsRead(id));
        }
    }, [showPanel, notifications, markAsRead]);
    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60)
            return 'À l\'instant';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60)
            return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24)
            return `${hours}h`;
        return `${Math.floor(hours / 24)}j`;
    };
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            case 'game': return '🎮';
            case 'wallet': return '💰';
            default: return '📢';
        }
    };
    return (_jsxs("div", { className: "notification-bell", children: [_jsxs("button", { ref: buttonRef, className: "notification-btn", onClick: togglePanel, "aria-label": `${unreadCount} notifications non lues`, children: [_jsx("span", { className: "notification-icon", children: "\uD83D\uDD14" }), unreadCount > 0 && (_jsx("span", { className: "notification-badge", children: unreadCount > 99 ? '99+' : unreadCount }))] }), showPanel && (_jsx(_Fragment, { children: _jsxs("div", { className: "notification-panel", ref: panelRef, children: [_jsxs("div", { className: "panel-header", children: [_jsx("h3", { children: "Notifications" }), notifications.length > 0 && (_jsx("button", { onClick: handleClearAll, className: "clear-all-btn", children: "Tout effacer" }))] }), _jsx("div", { className: "panel-body", children: recentNotifications.length === 0 ? (_jsxs("div", { className: "empty-notifications", children: [_jsx("span", { className: "empty-icon", children: "\uD83D\uDCED" }), _jsx("p", { children: "Aucune notification" })] })) : (_jsx("div", { className: "notifications-list", children: recentNotifications.map(notification => (_jsxs("div", { className: `notification-item ${!notification.read ? 'unread' : ''}`, onClick: () => handleNotificationClick(notification), children: [_jsx("span", { className: "item-icon", children: getNotificationIcon(notification.type) }), _jsxs("div", { className: "item-content", children: [_jsx("div", { className: "item-title", children: notification.title }), _jsx("div", { className: "item-message", children: notification.message }), _jsx("div", { className: "item-time", children: formatTime(notification.timestamp) })] })] }, notification.id))) })) }), notifications.length > 10 && (_jsx("div", { className: "panel-footer", children: _jsxs("button", { className: "view-all-btn", onClick: () => {
                                    // Ici vous pourriez naviguer vers une page complète des notifications
                                    console.log('Voir toutes les notifications');
                                    setShowPanel(false);
                                }, children: ["Voir toutes les notifications (", notifications.length, ")"] }) }))] }) }))] }));
}
