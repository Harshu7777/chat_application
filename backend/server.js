import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file (if needed)
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Dynamically set the frontend URL for deployment
    methods: ["GET", "POST"],
  }
});

app.use(cors());

// Initialize users and rooms
const users = new Map();
const chatRooms = new Map();

// Handle user connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a chat room
  socket.on('join', ({ username, room }) => {
    users.set(socket.id, { username, room });
    socket.join(room);

    if (!chatRooms.has(room)) {
      chatRooms.set(room, new Set());
    }
    chatRooms.get(room).add(socket.id);

    // Inform others in the room about the new user
    socket.to(room).emit('message', {
      user: 'System',
      text: `${username} has joined the room.`,
    });

    // Broadcast updated user list in the room
    io.to(room).emit('roomData', {
      room: room,
      users: Array.from(chatRooms.get(room)).map(id => users.get(id).username)
    });
  });

  // Handle sending messages
  socket.on('sendMessage', (message) => {
    const user = users.get(socket.id);
    io.to(user.room).emit('message', { user: user.username, text: message });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const room = user.room;
      chatRooms.get(room).delete(socket.id);
      users.delete(socket.id);

      // Notify room about user disconnection
      io.to(room).emit('message', {
        user: 'System',
        text: `${user.username} has left the room.`,
      });

      // Broadcast updated user list
      io.to(room).emit('roomData', {
        room: room,
        users: Array.from(chatRooms.get(room)).map(id => users.get(id).username)
      });
    }
  });
});

// Define port (from environment variable or default to 3000)
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
