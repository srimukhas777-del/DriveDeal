import app from './app.js';
import connectDB from './config/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Store active connections with userId mapping
const activeConnections = new Map();
const userSockets = new Map(); // Map userId to socket IDs

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Register user
  socket.on('register-user', (userId) => {
    if (!userSockets.has(userId)) {
      userSockets.set(userId, []);
    }
    userSockets.get(userId).push(socket.id);
    activeConnections.set(socket.id, { userId });
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Join a conversation room
  socket.on('join-chat', (data) => {
    const { userId, otherUserId } = data;
    const roomId = [userId, otherUserId].sort().join('-');
    socket.join(roomId);
    activeConnections.set(socket.id, { userId, roomId });
    console.log(`User ${userId} joined room ${roomId}`);
  });

  // Send message
  socket.on('send-message', (data) => {
    const { roomId, message, senderId, senderName } = data;
    
    console.log(`Message from ${senderId} in room ${roomId}: ${message}`);
    
    // Extract receiverId from roomId (format: userId1-userId2)
    const [id1, id2] = roomId.split('-');
    const receiverId = id1 === senderId ? id2 : id1;

    // Emit receive-message to all users in the room (both sender and receiver)
    io.to(roomId).emit('receive-message', {
      message,
      senderId,
      senderName,
      timestamp: new Date(),
    });

    console.log(`Message sent from ${senderId} to ${receiverId} in room ${roomId}`);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { roomId, userId, isTyping } = data;
    socket.to(roomId).emit('user-typing', { userId, isTyping });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const connection = activeConnections.get(socket.id);
    if (connection?.userId) {
      const sockets = userSockets.get(connection.userId) || [];
      userSockets.set(
        connection.userId,
        sockets.filter(id => id !== socket.id)
      );
    }
    activeConnections.delete(socket.id);
    console.log('User disconnected:', socket.id);
  });
});

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export { io };
