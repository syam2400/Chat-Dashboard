const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const onlineUsers = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    const user = socket.user;

    console.log("🟢 Connected:", user);

    if (user?.userId) {
      // const isNewUser = !onlineUsers.has(user.userId);

      // ✅ Always update user
      onlineUsers.set(user.userId, user);

      // ✅ Always send updated list
      io.emit("online_users", [...onlineUsers.values()]);

    }

        // ✅ Step 4 — Join conversation room
    socket.on("join_room", (conversationId) => {
      socket.join(conversationId);
      console.log(`📦 ${user?.userId} joined room: ${conversationId}`);
    });

        // ✅ Step 5 — Send message
    socket.on("send_message", async ({ conversationId, text }) => {
      console.log(`✉️  Message from ${user?.userId} to ${conversationId}:`, text);
      try {
        if (!text?.trim()) {
          console.log("⚠️ Empty message ignored");
          return;
        }

        const [message] = await Promise.all([
          Message.create({
            conversationId,
            senderId: user.userId,   // ✅ pulled from socket.user, not client payload
            text: text.trim(),
            seenBy: [user.userId],
          }),
          Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text.trim(),
            lastMessageAt: new Date(),
          }),
        ]);

        io.to(conversationId).emit("new_message", message);
      } catch (err) {
        socket.emit("error", { message: "Failed to send message" });
      }
    });

        // ✅ Leave room when switching chats
    socket.on("leave_room", (conversationId) => {
      socket.leave(conversationId);
      console.log(`📤 ${user?.userId} left room: ${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", user?.userId);

      if (user?.userId) {
        onlineUsers.delete(user.userId);

        io.emit("online_users", [...onlineUsers.values()]);
      }
    });
  });
};