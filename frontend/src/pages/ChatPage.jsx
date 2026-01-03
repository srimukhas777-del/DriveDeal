import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axios.config';

export default function ChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchChatData();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connect to Socket.IO
    socketRef.current = io('http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      // Join chat room
      if (user?._id && userId) {
        socketRef.current.emit('join-chat', {
          userId: user._id,
          otherUserId: userId,
        });
      }
    });

    socketRef.current.on('receive-message', (data) => {
      setMessages(prev => [...prev, {
        _id: Date.now().toString(),
        sender: data.senderId,
        content: data.message,
        timestamp: new Date(data.timestamp),
      }]);
    });

    socketRef.current.on('user-typing', (data) => {
      setIsTyping(data.isTyping);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatData = async () => {
    try {
      // Fetch previous messages
      const response = await axiosInstance.get(`/messages/${userId}`);
      console.log('Full messages response:', response);
      console.log('Response data:', response.data);
      console.log('Response data.data:', response.data.data);
      
      let messagesData = [];
      
      // Handle different response structures
      if (response.data.data?.messages) {
        messagesData = response.data.data.messages;
      } else if (response.data.messages) {
        messagesData = response.data.messages;
      } else if (Array.isArray(response.data)) {
        messagesData = response.data;
      }
      
      console.log('Messages data:', messagesData);
      
      // Transform messages to match our format
      const transformedMessages = messagesData.map(msg => ({
        _id: msg._id,
        sender: typeof msg.sender === 'object' ? msg.sender._id : msg.sender,
        content: msg.content,
        timestamp: new Date(msg.createdAt || msg.timestamp),
      }));
      
      setMessages(transformedMessages);
      console.log('Transformed messages:', transformedMessages);

      // Mark messages as read when opening chat
      await axiosInstance.put(`/messages/${userId}/read`).catch(err => 
        console.log('Error marking as read:', err)
      );

      // Fetch other user info from a different endpoint or use the userId
      // For now, set basic user info - this would ideally come from an API endpoint
      try {
        const userResponse = await axiosInstance.get(`/auth/user/${userId}`).catch(() => null);
        if (userResponse) {
          setOtherUser({
            _id: userId,
            name: userResponse.data.user.name,
            email: userResponse.data.user.email,
            phone: userResponse.data.user.phone,
          });
        } else {
          setOtherUser({
            _id: userId,
            name: 'User',
            email: 'user@example.com',
          });
        }
      } catch (err) {
        console.log('Error fetching user info:', err);
        setOtherUser({
          _id: userId,
          name: 'User',
          email: 'user@example.com',
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat data:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socketRef.current) return;

    // Emit typing stopped
    socketRef.current.emit('typing', {
      roomId: [user._id, userId].sort().join('-'),
      userId: user._id,
      isTyping: false,
    });

    const roomId = [user._id, userId].sort().join('-');
    
    // Send via Socket.IO
    socketRef.current.emit('send-message', {
      roomId,
      message: inputMessage,
      senderId: user._id,
      senderName: user.name,
    });

    // Save to database
    axiosInstance.post('/messages', {
      receiverId: userId,
      content: inputMessage,
    }).catch(err => console.error('Error saving message:', err));

    // Add to local state
    setMessages([...messages, {
      _id: Date.now().toString(),
      sender: user._id,
      content: inputMessage,
      timestamp: new Date(),
    }]);

    setInputMessage('');
  };

  const handleTyping = (e) => {
    setInputMessage(e.target.value);
    
    const roomId = [user._id, userId].sort().join('-');
    
    // Emit typing event
    socketRef.current?.emit('typing', {
      roomId,
      userId: user._id,
      isTyping: true,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to emit typing stopped
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('typing', {
        roomId,
        userId: user._id,
        isTyping: false,
      });
    }, 1000);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-lg p-6 flex items-center justify-between border-b-2 border-blue-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition"
            >
              ←
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">💬 Chat</h2>
              <p className="text-sm text-gray-600">{otherUser?.name || 'User'}</p>
              {isTyping && <p className="text-xs text-green-600 font-semibold">typing...</p>}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-gray-50 flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.sender === user?._id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    msg.sender === user?._id
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="break-words">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender === user?._id ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-xl shadow-lg p-6 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg font-bold transition disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
