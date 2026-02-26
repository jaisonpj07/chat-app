// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    console.log(" MongoDB Connected");

    mongoose.connection.on("disconnected", () => {
      console.warn(" MongoDB disconnected! Trying to reconnect...");
    });

    mongoose.connection.on("error", (err) => {
      console.error(" MongoDB connection error:", err);
    });

  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;