require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require("http");
const socketAuth = require("./middleware/socketAuth");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// CORS config
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5000','https://office-talks.vercel.app'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ✅ Apply socket auth ONCE
socketAuth(io);

// ✅ Global access
global.io = io;

// ✅ Notification helper
global.sendNotification = (data) => {
  io.emit("notification", data);
};

// ✅ Connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.user?.userId);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.user?.userId);
  });
});

// ENV validation
['MONGO_URI', 'JWT_SECRET'].forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing env: ${envVar}`);
    process.exit(1);
  }
});

// DB
connectDB();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/user', require('./routes/users')); // Alias for /api/user/profile compatibility

// health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});