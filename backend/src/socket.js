const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || '*', 
        methods: ["GET", "POST"]
      }
    });

    
    io.use((socket, next) => {
      if (socket.handshake.auth && socket.handshake.auth.token) {
        jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) return next(new Error('Authentication error'));
          socket.user = decoded;
          next();
        });
      } else {
        next(new Error('Authentication error: Token missing'));
      }
    });

    io.on('connection', (socket) => {
      console.log(`🔌 Socket connected: ${socket.id} (User: ${socket.user.id})`);

      
      
      socket.join(socket.user.id);

      socket.on('join_order_room', (orderId) => {
        socket.join(`order_${orderId}`);
        console.log(`User ${socket.user.id} joined order room: order_${orderId}`);
      });

      socket.on('leave_order_room', (orderId) => {
        socket.leave(`order_${orderId}`);
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
      });
    });

    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  }
};
