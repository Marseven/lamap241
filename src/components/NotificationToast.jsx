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
    
    if (seconds < 60) return 'À l\'instant';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes} min`;
    return timestamp.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={getToastClass(notification.type)}
          style={{
            animationDelay: mounted[notification.id] ? '0ms' : '100ms'
          }}
        >
          <div className="toast-header">
            <span className="toast-icon">{getIcon(notification.type)}</span>
            <div className="toast-content">
              {notification.title && (
                <div className="toast-title">{notification.title}</div>
              )}
              <div className="toast-message">{notification.message}</div>
            </div>
            <div className="toast-meta">
              <span className="toast-time">{formatTime(notification.timestamp)}</span>
              <button
                onClick={() => onRemove(notification.id)}
                className="toast-close"
                aria-label="Fermer la notification"
              >
                ×
              </button>
            </div>
          </div>
          
          {notification.action && (
            <div className="toast-actions">
              <button
                onClick={() => handleAction(notification)}
                className="toast-action-btn"
              >
                {notification.action.text}
              </button>
            </div>
          )}
          
          {!notification.persistent && notification.autoClose && (
            <div 
              className="toast-progress"
              style={{
                animationDuration: `${notification.duration}ms`
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}