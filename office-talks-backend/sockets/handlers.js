const onlineUsers = new Map(); // userId -> user object

module.exports = (io) => {

  io.on("connection", (socket) => {
    const user = socket.user;

    console.log("🟢 Connected:----?>", user);

    if (user?.userId) {
      // ✅ Add user
      onlineUsers.set(user.userId, user);

      // ✅ Send full list to ALL users
      io.emit("online_users", [...onlineUsers.values()]);

      // ✅ Notify others (not self)
      socket.broadcast.emit("notification", {
        type: "USER_LOGIN",
        user,
        message: `${user.name} logged in`,
        time: new Date(),
      });
    }

    // ✅ Send current list to NEW user
    // socket.emit("online_users",  [...onlineUsers.values()]);

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", user?.userId);

      if (user?.userId) {
        onlineUsers.delete(user.userId);

        // ✅ Update everyone
        io.emit("online_users", Array.from(onlineUsers.values()));
      }
    });
  });
};