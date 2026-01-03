import { useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { NotificationContext } from '../context/NotificationContext';
import { useAuth } from './useAuth';

export function useNotifications() {
  const { addNotification } = useContext(NotificationContext);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;

    const socket = io('http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Notification socket connected');
      // Register user for notifications
      socket.emit('register-user', user._id);
    });

    socket.on('new-message', (data) => {
      console.log('New message notification:', data);
      addNotification({
        senderId: data.senderId,
        senderName: data.senderName,
        message: data.message,
        isRead: false,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id, addNotification]);
}
