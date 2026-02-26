

const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: { type: String },
  expiresAt: { type: Date }
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);