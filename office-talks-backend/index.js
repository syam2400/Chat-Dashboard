require('dotenv').config();
// ENV validation
['MONGO_URI', 'JWT_SECRET'].forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing env: ${envVar}`);
    process.exit(1);
  }
});

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require("http");
const { initSocket } = require("./sockets");
const helmet = require('helmet');
const app = express();

app.set('trust proxy', 1);

app.use(helmet());
// ✅ Add compression here
const compression = require('compression');
app.use(compression());
const rateLimit = require('express-rate-limit');

// CORS config
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5000','https://office-talks.vercel.app'];

  // Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.startsWith('/api/auth'), // 👈 add this
  message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, try again later." },
});

app.use(globalLimiter);
app.use('/api/auth', authLimiter); // only this applies to auth now

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/user', require('./routes/users')); // Alias for /api/user/profile compatibility

// health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/test-rate', (req, res) => {
  res.json({ message: "API working", time: new Date() });
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

const server = http.createServer(app);

// ✅ Initialize socket here (IMPORTANT)
initSocket(server, allowedOrigins);

const PORT = process.env.PORT || 5000;
// 🔥 Start server only after DB connects
const startServer = async () => {
  try {
    await connectDB(); // ⬅️ wait for DB

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 Allowed CORS origins: ${allowedOrigins.join(', ')}`);
    });

  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
};

startServer();

