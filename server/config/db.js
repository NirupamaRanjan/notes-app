const mongoose = require("mongoose");

// Defaults to the local MongoDB daemon; no secrets or custom ports required.
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/notes_db";

const connectDB = () => {
  return mongoose
    .connect(MONGO_URI)
    .then((conn) => {
      console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      console.error("Make sure the MongoDB daemon is running at", MONGO_URI);
      process.exit(1);
    });
};

module.exports = connectDB;