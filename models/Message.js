

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  content: { type: String, required: true }
}, { timestamps: true });

messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);