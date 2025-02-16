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

// ✅ Test Route
app.get("/api", (req, res) => {
  console.log("📌 GET /api hit");
  res.json({ message: "Welcome to Outh Game API on Netlify!" });
});

// ✅ Fix: Ensure `/api` prefix is applied to auth routes
app.use("/api", authRoutes); // Mount authRoutes under `/api`

// ✅ Export for Netlify
module.exports.handler = serverless(app);
