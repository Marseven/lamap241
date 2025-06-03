import React, { useEffect } from 'react';

export default function NotificationToast({ 
  notifications, 
  onRemove 
}) {
  
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

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={getToastClass(notification.type)}
        >
          <div className="toast-content">
            <span className="toast-icon">{getIcon(notification.type)}</span>
            <div className="toast-text">
              {notification.title && (
                <div className="toast-title">{notification.title}</div>
              )}
              <div className="toast-message">{notification.message}</div>
            </div>
          </div>
          <button
            onClick={() => onRemove(notification.id)}
            className="toast-close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}