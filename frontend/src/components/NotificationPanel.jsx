import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';

export default function NotificationPanel() {
  const { notifications, markAsRead, clearAllNotifications } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChat = (notification) => {
    markAsRead(notification.id);
    navigate(`/chat/${notification.senderId}`);
    setIsOpen(false);
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={togglePanel}
        className="relative p-2 text-gray-700 hover:text-gray-900 transition"
        title="Messages"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200 max-h-96 flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h3 className="font-bold text-gray-800">Messages</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No new messages
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleOpenChat(notification)}
                  className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {notification.senderName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {notification.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <div className="mt-1 inline-block w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  navigate('/chat');
                  setIsOpen(false);
                }}
                className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium py-2"
              >
                View All Messages
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
