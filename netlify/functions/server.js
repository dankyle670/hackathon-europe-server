const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require("serverless-http");
const authRoutes = require("./authRoutes"); // Import authentication routes
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Logging Middleware for Debugging
app.use((req, res, next) => {
  console.log(`📌 ${req.method} ${req.url}`);
  next();
});

// ✅ Test Route
app.get("/api", (req, res) => {
  console.log("📌 GET /api hit");
  res.json({ message: "Welcome to Outh Game API on Netlify!" });
});

// ✅ Register API Routes
app.use("/api", authRoutes); // Mount authRoutes under `/api`

// ✅ Catch-all Route for Undefined Routes (Debugging)
app.use("*", (req, res) => {
  console.log("❌ 404 Not Found:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

// ✅ Export for Netlify Functions
module.exports.handler = serverless(app);
