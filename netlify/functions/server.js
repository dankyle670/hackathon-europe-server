const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require("serverless-http");
const { createServer } = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./authRoutes");
const friendRoutes = require("./friendRoutes");
require("dotenv").config();

const app = express();
const server = createServer(app);

// WebSocket Server (Socket.io)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store active users for real-time communication
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log(`New user connected: ${socket.id}`);

  // Register user (store socket with user ID)
  socket.on("register", (userId) => {
    console.log(`User ${userId} is online with socket ID: ${socket.id}`);
    activeUsers.set(userId, socket.id);
  });

  //  Send a game invite
  socket.on("invite", (data) => {
    console.log(`Game invite from ${data.senderId} to ${data.receiverId}`);

    const receiverSocketId = activeUsers.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-invite", data);
    }
  });

  // Accept game invite
  socket.on("accept-invite", (data) => {
    console.log(`Game accepted by ${data.receiverId}`);

    const senderSocketId = activeUsers.get(data.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("invite-accepted", data);
    }
  });

  //  Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    activeUsers.forEach((value, key) => {
      if (value === socket.id) {
        activeUsers.delete(key);
      }
    });
  });
});

//  Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  });

//  Logging Middleware for Debugging
app.use((req, res, next) => {
  console.log(` ${req.method} ${req.url}`);
  next();
});

// Register API Routes
app.use("/api", authRoutes);
app.use("/api", friendRoutes);

//  Catch-all Route for Undefined Routes (Debugging)
app.use("*", (req, res) => {
  console.log("404 Not Found:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

// Start Server (For Local Development)
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} else {
  module.exports.handler = serverless(app);
}
