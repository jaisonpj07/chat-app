

const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

let io;

exports.init = (server) => {
  io = socketIo(server, { cors: { origin: "*" } });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId);

    socket.on("sendMessage", async ({ receiverId, content }) => {
      const message = await Message.create({
        sender: socket.userId,
        receiver: receiverId,
        content
      });

      io.to(receiverId).emit("newMessage", message);
      io.to(socket.userId).emit("newMessage", message);
    });
  });
};