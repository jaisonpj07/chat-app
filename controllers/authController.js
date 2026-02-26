

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const { generateTokens } = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 12);

  const user = await User.create({
    username,
    email,
    password: hashed
  });

  res.status(201).json({ message: "User created" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const { accessToken, refreshToken } = generateTokens(user._id);

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7*24*60*60*1000)
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  });

  res.json({ accessToken });
};

exports.refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  const stored = await RefreshToken.findOne({ token });
  if (!stored) return res.sendStatus(403);

  jwt.verify(token, process.env.REFRESH_SECRET);

  const { accessToken, refreshToken } = generateTokens(stored.user);

  await stored.deleteOne();
  await RefreshToken.create({
    user: stored.user,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7*24*60*60*1000)
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  });

  res.json({ accessToken });
};