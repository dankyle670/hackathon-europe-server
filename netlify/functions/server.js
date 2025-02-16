const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require("serverless-http");
const authRoutes = require("./authRoutes");
const friendRoutes = require("./friendRoutes");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  });

// Logging Middleware for Debugging
app.use((req, res, next) => {
  console.log(` ${req.method} ${req.url}`);
  next();
});

// Register API Routes
app.use("/api", authRoutes);
app.use("/api", friendRoutes);

//  Catch-all Route for Undefined Routes (Debugging)
app.use("*", (req, res) => {
  console.log(" 404 Not Found:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

// Export for Netlify Functions
module.exports.handler = serverless(app);
