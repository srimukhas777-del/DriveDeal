import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';

export default function MessagePopup() {
  const { currentPopup, clearNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (currentPopup) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        clearNotification(currentPopup.id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentPopup, clearNotification]);

  if (!isVisible || !currentPopup) return null;

  const handleReply = () => {
    navigate(`/chat/${currentPopup.senderId}`);
    setIsVisible(false);
    clearNotification(currentPopup.id);
  };

  const handleClose = () => {
    setIsVisible(false);
    clearNotification(currentPopup.id);
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-lg shadow-2xl border-l-4 border-blue-500 p-4 max-w-sm w-80">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-800">{currentPopup.senderName}</h3>
            <p className="text-xs text-gray-500">
              {currentPopup.timestamp.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {currentPopup.message}
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleReply}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition text-sm font-medium"
          >
            Reply
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
