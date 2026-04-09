# Comprehensive Technical Documentation: Office-Talks Backend

## 🎯 **Project Overview**
**Office-Talks** is a **modern real-time office chat application** built with a **full-stack architecture**:

- **Backend**: Node.js + Express.js + Socket.io + MongoDB (this repo)
- **Frontend**: Next.js 14+ (sister repo: `office-talks/`)
- **Purpose**: Real-time messaging, user authentication, profile management, file uploads, and notifications for office communication.

**Key Features**:
```
✅ JWT Authentication (Signup/Login)
✅ Real-time notifications (Socket.io)
✅ User profile management (CRUD + Image upload)
✅ File upload to Cloudinary
✅ Rate limiting & Security (Helmet, CORS)
✅ MongoDB with Mongoose ORM
✅ RESTful API endpoints
✅ Health checks & Error handling
✅ Production-ready (Compression, Proxy trust)
```

**Tech Stack**:
```
🐳 Backend: Express 5+, Socket.io 4+, Mongoose 9+
🗄️  DB: MongoDB Atlas (Replica Set)
☁️  Storage: Cloudinary
🔐 Auth: JWT + bcryptjs
🛡️  Security: Helmet, Rate Limiting, CORS
📦 Deployment: Vercel (frontend), Render/Heroku (backend)
```

## 🏗️ **Project Structure**
```
office-talks-backend/
├── index.js                 # 🚀 Main server entrypoint
├── config/                  # ⚙️ Configuration
│   ├── db.js               # MongoDB connection
│   └── cloudinary.js       # Cloudinary setup
├── middleware/              # 🛡️ Custom middleware
│   ├── authMiddleware.js   # JWT token verification
│   ├── socketAuth.js       # Socket.io JWT auth
│   └── upload.js           # Multer file upload (memory storage)
├── models/                  # 🗃️ Mongoose schemas
│   └── User.js             # User model (name, email, password, profileImage)
├── routes/                  # 📡 API routes
│   ├── auth.js             # /api/auth (signup, login)
│   └── users.js            # /api/users (CRUD, profile)
├── .env                    # 🔑 Environment variables
├── package.json            # 📦 Dependencies & scripts
└── ... (gitignore, etc.)
```

## 🔧 **Core Architecture Flow**

### 1. **Server Startup** (`index.js`)
```javascript
// 1. Environment validation (MONGO_URI, JWT_SECRET)
['MONGO_URI', 'JWT_SECRET'].forEach(envVar => {
  if (!process.env[envVar]) process.exit(1);
});

// 2. Middleware stack (Security-first)
app.use(helmet());           // Security headers
app.use(compression());      // Gzip compression
app.use(cors({...}));        // Configurable origins
app.use(express.json());     // JSON parsing
app.use(rateLimit({...}));   // Global + Auth rate limiting

// 3. Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 4. Socket.io setup
const io = new Server(server, { cors });
socketAuth(io);              // JWT auth for sockets
global.io = io;              // Global access
global.sendNotification = ... // Real-time notifications

// 5. DB-first startup
await connectDB();
server.listen(PORT);
```

### 2. **Authentication Flow** (`routes/auth.js`)
```
POST /api/auth/signup
  ↓ (User.findOne({email}))
✅ No duplicate → bcrypt.hash() → User.create()
  ↓ JWT.sign({userId}) → Response: {token, user}
  ↓ global.sendNotification("NEW_USER")

POST /api/auth/login
  ↓ User.findOne({email}) → bcrypt.compare()
  ↓ JWT.sign({userId}) → Response: {token, user}
  ↓ global.sendNotification("USER_LOGIN")
```

**Token Payload**: `{ userId: ObjectId }` (expires in 1h)

### 3. **User Management** (`routes/users.js`)
**Protected Routes** (JWT middleware required):

```
GET    /api/users/profile     → Current user profile (-password)
PUT    /api/users/profile     → Update name/email
PUT    /api/users/profile-image → Cloudinary upload
GET    /api/users/all-users   → All users list
GET    /api/users             → All users
GET    /api/users/:id         → Single user
PUT    /api/users/:id         → Update user
DELETE /api/users/:id         → Delete user
```

**Profile Image Upload Flow**:
```
Frontend → Multer (memoryStorage) → Buffer
  ↓ streamifier → Cloudinary.upload_stream()
  ↓ Save secure_url → User.profileImage = result.secure_url
```

### 4. **Real-Time Features** (Socket.io)
```javascript
// socketAuth.js - JWT middleware for sockets
io.use((socket, next) => {
  jwt.verify(socket.handshake.auth.token, JWT_SECRET);
  socket.user = decoded;  // Attach user to socket
});

// index.js - Global notification system
global.sendNotification = (data) => io.emit("notification", data);

// Events
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.user.userId);
});
```

**Auth Integration**: 
- HTTP: `Authorization: Bearer <token>`
- Socket: `handshake.auth.token`

## 🔐 **Security Implementation**

| Feature | Implementation | Details |
|---------|----------------|---------|
| **Rate Limiting** | `express-rate-limit` | Global: 100/min<br>Auth: 20/10min |
| **JWT Auth** | `jsonwebtoken` | 1h expiry, userId payload |
| **Password** | `bcryptjs` | 10 salt rounds |
| **Headers** | `helmet()` | All security headers |
| **CORS** | Configurable origins | localhost + Vercel |
| **Input** | Mongoose validation | Required/unique fields |
| **Files** | Memory storage + Cloudinary | No disk writes |

## 🌐 **API Endpoints**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Login + JWT |
| GET | `/api/users/profile` | Yes | Current profile |
| PUT | `/api/users/profile` | Yes | Update profile |
| PUT | `/api/users/profile-image` | Yes | Upload avatar |
| GET | `/api/users/all-users` | Yes | List all users |
| GET | `/api/users` | Yes | All users |
| GET | `/api/users/:id` | Yes | Get user |
| PUT | `/api/users/:id` | Yes | Update user |
| DELETE | `/api/users/:id` | Yes | Delete user |
| GET | `/health` | No | Health check |

**Response Format**:
```json
{
  "success": true,
  "user": { "id": "...", "name": "...", "email": "...", "profileImage": "..." }
}
```

## 🛠️ **Environment Variables** (`.env`)
```env
# Database
MONGO_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_strong_jwt_secret

# Cloudinary
CLOUD_NAME=...
API_KEY=...
API_SECRET=...

# Deployment
NODE_ENV=production
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000,https://office-talks.vercel.app
```

## 🚀 **Local Development**
```bash
# 1. Clone & Install
cd office-talks-backend
npm install

# 2. Setup .env (MongoDB Atlas + Cloudinary)

# 3. Run
npm run dev    # nodemon
npm start      # production

# Logs:
# ✅ Server running on port 5000
# MongoDB Connected: ac-vlc0e7h-shard-00-02.ptcnbvu.mongodb.net:27017
```

## 📱 **Frontend Integration**
```
Next.js App (office-talks/)
├── Uses this API for auth/profile
├── Socket.io-client for real-time
├── NotificationContext for io.emit()
└── Protected routes with token
```

## 🎯 **Interview Talking Points**

1. **Why Express 5+?** Latest features, better TypeScript support
2. **Real-time Arch?** Socket.io with JWT middleware, global notification system
3. **Security-First?** Helmet → Rate-limit → Auth → Input validation
4. **File Upload?** Multer (memory) → Streamifier → Cloudinary (no disk I/O)
5. **DB Design?** Simple User schema, scalable for chats/messages
6. **Error Handling?** Global handler + async/await try-catch
7. **Production?** Compression, proxy trust, configurable CORS/origins
8. **Scalability?** MongoDB replica set ready, stateless JWT

## 🔮 **Future Enhancements**
```
[ ] Chat/Message models & Socket rooms
[ ] Typing indicators & Read receipts
[ ] File sharing (images, docs)
[ ] User status (online/offline)
[ ] Group chats & Channels
[ ] Search & Message history
[ ] Push notifications
```

---

**Built with ❤️ for scalable office communication!** 🚀

