
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();


const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socket = require("./socket/socket");

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/", messageRoutes);

socket.init(server);

server.listen(3000, () => console.log("Server running"));