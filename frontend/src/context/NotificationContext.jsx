import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPopup, setCurrentPopup] = useState(null);

  const addNotification = useCallback((message) => {
    const notification = {
      id: Date.now(),
      ...message,
      timestamp: new Date(),
    };
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    setCurrentPopup(notification);
    return notification.id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotification = useCallback((id) => {
    removeNotification(id);
    setCurrentPopup(null);
  }, [removeNotification]);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setCurrentPopup(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        currentPopup,
        addNotification,
        removeNotification,
        clearNotification,
        markAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
