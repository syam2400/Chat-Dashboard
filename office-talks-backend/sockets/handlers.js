const onlineUsers = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    const user = socket.user;

    console.log("🟢 Connected:", user);

    if (user?.userId) {
      const isNewUser = !onlineUsers.has(user.userId);

      // ✅ Always update user
      onlineUsers.set(user.userId, user);

      // ✅ Always send updated list
      io.emit("online_users", [...onlineUsers.values()]);

      // ✅ Only notify if truly new
      if (isNewUser) {
        socket.broadcast.emit("notification", {
          type: "USER_LOGIN",
          user,
          message: `${user.name} logged in`,
          time: new Date(),
        });
      }
    }

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", user?.userId);

      if (user?.userId) {
        onlineUsers.delete(user.userId);

        io.emit("online_users", [...onlineUsers.values()]);
      }
    });
  });
};