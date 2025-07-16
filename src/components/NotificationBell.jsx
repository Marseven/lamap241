// src/components/NotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

export default function NotificationBell() {
  const { notifications, clearAllNotifications, markAsRead } = useNotifications();
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  
  const notificationsArray = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notificationsArray.filter(n => !n.read).length;
  const recentNotifications = notificationsArray.slice(0, 10);

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
      if (
        showPanel &&
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
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
    
    if (seconds < 60) return 'À l\'instant';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
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

  return (
    <div className="notification-bell">
      <button 
        ref={buttonRef}
        className="notification-btn"
        onClick={togglePanel}
        aria-label={`${unreadCount} notifications non lues`}
      >
        <span className="notification-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <>
          <div className="notification-panel" ref={panelRef}>
            <div className="panel-header">
              <h3>Notifications</h3>
              {notifications.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="clear-all-btn"
                >
                  Tout effacer
                </button>
              )}
            </div>
            
            <div className="panel-body">
              {recentNotifications.length === 0 ? (
                <div className="empty-notifications">
                  <span className="empty-icon">📭</span>
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="notifications-list">
                  {recentNotifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <span className="item-icon">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="item-content">
                        <div className="item-title">{notification.title}</div>
                        <div className="item-message">{notification.message}</div>
                        <div className="item-time">
                          {formatTime(notification.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 10 && (
              <div className="panel-footer">
                <button 
                  className="view-all-btn"
                  onClick={() => {
                    // Ici vous pourriez naviguer vers une page complète des notifications
                    console.log('Voir toutes les notifications');
                    setShowPanel(false);
                  }}
                >
                  Voir toutes les notifications ({notifications.length})
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}