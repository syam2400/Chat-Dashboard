const { getIO } = require("../sockets");

const sendNotification = (data) => {
  try {
    const io = getIO(); // get socket instance
    io.emit("notification", data);
  } catch (err) {
    console.error("Socket not initialized:", err.message);
  }
};

module.exports = sendNotification;