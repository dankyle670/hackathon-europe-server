const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();
const router = express.Router(); // ✅ Fix: Use an Express Router

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ MongoDB Connection (Fix: Removed Deprecated Options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Fix: Mount API under `/api`
router.get("/", (req, res) => {
  console.log("📌 GET /api hit");
  res.json({ message: "Welcome to Outh Game API on Netlify!" });
});

// ✅ User Signup Route
router.post("/signup", async (req, res) => {
  try {
    console.log("📌 POST /api/signup hit with data:", req.body);

    const { first_name, last_name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("✅ New user created:", newUser);

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Apply Router to Netlify Functions
app.use("/.netlify/functions/server/api", router);

// ✅ Export for Netlify Functions
module.exports.handler = serverless(app);
