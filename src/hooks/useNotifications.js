import { useState, useCallback } from "react";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(
    (type, message, title = "", options = {}) => {
      const notification = {
        id: Math.random().toString(36).substring(2, 9),
        type,
        title,
        message,
        timestamp: new Date(),
        duration: options.duration || 5000,
        autoClose: options.autoClose !== false,
        ...options,
      };

      setNotifications((prev) => [...prev, notification]);
      return notification.id;
    },
    []
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Raccourcis pour les types de notifications
  const success = useCallback(
    (message, title = "", options = {}) =>
      addNotification("success", message, title, options),
    [addNotification]
  );

  const error = useCallback(
    (message, title = "", options = {}) =>
      addNotification("error", message, title, options),
    [addNotification]
  );

  const warning = useCallback(
    (message, title = "", options = {}) =>
      addNotification("warning", message, title, options),
    [addNotification]
  );

  const info = useCallback(
    (message, title = "", options = {}) =>
      addNotification("info", message, title, options),
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  };
};
