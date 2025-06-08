// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message, options = {}) => {
    const notification = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
      title: options.title || '',
      timestamp: new Date(),
      duration: options.duration || 5000,
      autoClose: options.autoClose !== false,
      persistent: options.persistent || false,
      action: options.action || null,
      read: false,
      ...options
    };

    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove après le délai
    if (notification.autoClose && !notification.persistent) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    }

    return notification.id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Raccourcis pour les types courants
  const success = useCallback((message, options = {}) => 
    addNotification('success', message, { title: 'Succès', ...options }), [addNotification]);

  const error = useCallback((message, options = {}) => 
    addNotification('error', message, { title: 'Erreur', ...options }), [addNotification]);

  const warning = useCallback((message, options = {}) => 
    addNotification('warning', message, { title: 'Attention', ...options }), [addNotification]);

  const info = useCallback((message, options = {}) => 
    addNotification('info', message, { title: 'Information', ...options }), [addNotification]);

  // Notifications spécifiques au jeu
  const gameNotification = useCallback((message, options = {}) =>
    addNotification('game', message, { title: 'Jeu', ...options }), [addNotification]);

  const walletNotification = useCallback((message, options = {}) =>
    addNotification('wallet', message, { title: 'Portefeuille', ...options }), [addNotification]);

  // Notifications avec actions
  const notificationWithAction = useCallback((type, message, actionText, actionCallback, options = {}) => {
    return addNotification(type, message, {
      ...options,
      persistent: true,
      autoClose: false,
      action: {
        text: actionText,
        callback: actionCallback
      }
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    markAsRead,
    success,
    error,
    warning,
    info,
    gameNotification,
    walletNotification,
    notificationWithAction
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};