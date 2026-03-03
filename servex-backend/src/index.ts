import express from 'express';
import { createServer } from 'http'; // Standard Node.js HTTP server
import { Server } from 'socket.io'; // Socket.io engine
import cors from 'cors';
import dotenv from 'dotenv';
import { db, auth } from './firebase';
import userRoutes from './routes/userRoutes';
import serviceRoutes from './routes/serviceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import chatRoutes from './routes/chatRoutes';
import deliveryRoutes from './routes/deliveryRoutes';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app); // Wrap Express
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all for now; we can restrict this during deployment
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// REST API Routes
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/delivery', deliveryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ServeX API and Socket Server Running' });
});

// 1. Socket.io Authentication Middleware
// This checks the Firebase ID token before allowing the connection
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: Token required'));
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    (socket as any).user = decodedToken; // Attach decoded user info to the socket
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// 2. Socket.io Connection Logic
io.on('connection', (socket) => {
  const user = (socket as any).user;
  console.log(`User connected: ${user.email} (${socket.id})`);

  // 1. Join a specific project room
  socket.on('join_project', (bookingId) => {
    socket.join(bookingId);
    console.log(`User ${user.email} joined room: ${bookingId}`);
  });

  // 2. Handle sending messages
  socket.on('send_message', async (data) => {
    const { bookingId, text, fileUrl } = data;

    const messageData = {
      senderId: user.uid,
      senderEmail: user.email,
      text: text || '',
      fileUrl: fileUrl || null,
      timestamp: new Date().toISOString(),
    };

    try {
      // Save to Firestore: chats/{bookingId}/messages/
      await db.collection('chats')
        .doc(bookingId)
        .collection('messages')
        .add(messageData);

      // Broadcast to everyone in the room (Admin + Customer)
      io.to(bookingId).emit('receive_message', messageData);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// IMPORTANT: Listen on httpServer, not app
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});