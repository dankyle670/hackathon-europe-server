const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require("serverless-http");
const { createServer } = require("http");
const Invite = require("./Invite");

const authRoutes = require("./authRoutes");
const friendRoutes = require("./friendRoutes");
require("dotenv").config();

const app = express();
const server = createServer(app);
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
app.use("/api/invites", Invite);

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
