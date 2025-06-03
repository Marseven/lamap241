import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
export default function NotificationToast({ notifications, onRemove }) {
    useEffect(() => {
        notifications.forEach(notification => {
            if (notification.autoClose !== false) {
                const timer = setTimeout(() => {
                    onRemove(notification.id);
                }, notification.duration || 5000);
                return () => clearTimeout(timer);
            }
        });
    }, [notifications, onRemove]);
    const getToastClass = (type) => {
        const baseClass = 'notification-toast';
        switch (type) {
            case 'success':
                return `${baseClass} success`;
            case 'error':
                return `${baseClass} error`;
            case 'warning':
                return `${baseClass} warning`;
            case 'info':
                return `${baseClass} info`;
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
            default: return '📢';
        }
    };
    return (_jsx("div", { className: "notification-container", children: notifications.map(notification => (_jsxs("div", { className: getToastClass(notification.type), children: [_jsxs("div", { className: "toast-content", children: [_jsx("span", { className: "toast-icon", children: getIcon(notification.type) }), _jsxs("div", { className: "toast-text", children: [notification.title && (_jsx("div", { className: "toast-title", children: notification.title })), _jsx("div", { className: "toast-message", children: notification.message })] })] }), _jsx("button", { onClick: () => onRemove(notification.id), className: "toast-close", children: "\u00D7" })] }, notification.id))) }));
}
