import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const users = new Map();
const chatRooms = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', ({ username, room }) => {
    users.set(socket.id, { username, room });
    socket.join(room);

    if (!chatRooms.has(room)) {
      chatRooms.set(room, new Set());
    }
    chatRooms.get(room).add(socket.id);

    socket.to(room).emit('message', {
      user: 'System',
      text: `${username} has joined the room.`
    });

    io.to(room).emit('roomData', {
      room: room,
      users: Array.from(chatRooms.get(room)).map(id => users.get(id).username)
    });
  });

  socket.on('sendMessage', (message) => {
    const user = users.get(socket.id);
    io.to(user.room).emit('message', { user: user.username, text: message });
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const room = user.room;
      chatRooms.get(room).delete(socket.id);
      users.delete(socket.id);

      io.to(room).emit('message', {
        user: 'System',
        text: `${user.username} has left the room.`
      });

      io.to(room).emit('roomData', {
        room: room,
        users: Array.from(chatRooms.get(room)).map(id => users.get(id).username)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));