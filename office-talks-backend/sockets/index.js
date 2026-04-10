const { Server } = require("socket.io");
const socketAuth = require("../middleware/socketAuth");
const registerHandlers = require("./handlers");

let io;

const initSocket = (server, allowedOrigins) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  // ✅ Auth middleware
  socketAuth(io);

  // ✅ Register all socket logic
  registerHandlers(io);

  console.log("✅ Socket initialized");

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { initSocket, getIO };