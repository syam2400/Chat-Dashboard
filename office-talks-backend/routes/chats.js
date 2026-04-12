const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const multer = require("multer");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// protect all chat routes
router.use(auth);

// get conversation between two users, if not exists create new conversation
router.post("/create", async (req, res) => {
  const userId = req.user.id;
  const { receiverId } = req.body;

  try {
    const members = [userId, receiverId].sort();

    const conversation = await Conversation.findOneAndUpdate(
      { members },
      {
        $setOnInsert: {
          members,
          isGroup: false,
          lastMessage: "",
          lastMessageAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true, // 🔥 creates if not exists
      }
    );

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST /api/chats/message/send
router.post("messages/:conversationId", async (req, res) => {
  const senderId = req.user.id;
  const { conversationId, receiverId, text } = req.body;

  try {
    // 1. create message
    const message = await Message.create({
      conversationId,
      senderId,
      text,
      seenBy: [senderId],
    });

    // 2. update conversation metadata
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageAt: new Date(),
    });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;