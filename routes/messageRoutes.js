

const express = require("express");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Send Message
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const message = new Message({
      sender: req.id,
      receiver: receiverId,
      content
    });

    await message.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Messages (Latest First)
router.get("/list", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.id },
        { receiver: req.id }
      ]
    })
    .sort({ createdAt: -1 })
    .populate("sender", "username email")
    .populate("receiver", "username email");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;