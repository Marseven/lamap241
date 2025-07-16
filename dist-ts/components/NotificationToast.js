import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/NotificationToast.jsx - Version améliorée
import React, { useEffect, useState } from 'react';
export default function NotificationToast({ notifications, onRemove }) {
    const [mounted, setMounted] = useState({});
    useEffect(() => {
        notifications.forEach(notification => {
            if (!mounted[notification.id]) {
                setMounted(prev => ({ ...prev, [notification.id]: true }));
            }
            if (notification.autoClose && !notification.persistent) {
                const timer = setTimeout(() => {
                    onRemove(notification.id);
                }, notification.duration || 5000);
                return () => clearTimeout(timer);
            }
        });
    }, [notifications, onRemove, mounted]);
    const handleAction = (notification) => {
        if (notification.action && notification.action.callback) {
            notification.action.callback();
            onRemove(notification.id);
        }
    };
    const getToastClass = (type) => {
        const baseClass = 'notification-toast';
        switch (type) {
            case 'success':
                return `${baseClass} toast-success`;
            case 'error':
                return `${baseClass} toast-error`;
            case 'warning':
                return `${baseClass} toast-warning`;
            case 'info':
                return `${baseClass} toast-info`;
            case 'game':
                return `${baseClass} toast-game`;
            case 'wallet':
                return `${baseClass} toast-wallet`;
            default:
                return baseClass;
        }
    };
    const getIcon = (type) => {
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
    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60)
            return 'À l\'instant';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60)
            return `Il y a ${minutes} min`;
        return timestamp.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    if (notifications.length === 0)
        return null;
    return (_jsx("div", { className: "notification-container", children: notifications.map(notification => (_jsxs("div", { className: getToastClass(notification.type), style: {
                animationDelay: mounted[notification.id] ? '0ms' : '100ms'
            }, children: [_jsxs("div", { className: "toast-header", children: [_jsx("span", { className: "toast-icon", children: getIcon(notification.type) }), _jsxs("div", { className: "toast-content", children: [notification.title && (_jsx("div", { className: "toast-title", children: notification.title })), _jsx("div", { className: "toast-message", children: notification.message })] }), _jsxs("div", { className: "toast-meta", children: [_jsx("span", { className: "toast-time", children: formatTime(notification.timestamp) }), _jsx("button", { onClick: () => onRemove(notification.id), className: "toast-close", "aria-label": "Fermer la notification", children: "\u00D7" })] })] }), notification.action && (_jsx("div", { className: "toast-actions", children: _jsx("button", { onClick: () => handleAction(notification), className: "toast-action-btn", children: notification.action.text }) })), !notification.persistent && notification.autoClose && (_jsx("div", { className: "toast-progress", style: {
                        animationDuration: `${notification.duration}ms`
                    } }))] }, notification.id))) }));
}
