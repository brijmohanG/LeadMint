
const express = require('express');
const appRoutes = require('./router/index');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./models/message')

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use('/api', appRoutes);

// Create HTTP server and integrate `socket.io`
const server = http.createServer(app);
const io = socketIo(server);

// Set up socket.io connections
io.on('connection', (socket) => {
    console.log('New user connected');
  
    socket.on('joinRoom', ({ roomId, userId }) => {
        socket.join(roomId);
        console.log(`${userId} joined room ${roomId}`);
    });
  
    socket.on('chatMessage', ({ roomId, message, userId }) => {
      const messageValue = {
        roomId,message,userId
      }
        Message.create(messageValue)
        io.to(roomId).emit('chatMessage', { userId, message });
    });
  
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log("Server is running on port 3000");
});

module.exports = app;
