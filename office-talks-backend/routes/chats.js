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
       returnDocument: "after",
       upsert: true, // 🔥 creates if not exists
      }
    );

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/messages/:conversationId", async (req, res) => {
  const { conversationId } = req.params;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      messages
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;