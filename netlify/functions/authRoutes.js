const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/UserModel"); // Import UserModel
require("dotenv").config();

const router = express.Router();

// User Signup Route
router.post("/signup", async (req, res) => {
  try {
    console.log("POST /api/signup hit with data:", req.body);

    const { first_name, last_name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
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
    console.log("New user created:", newUser);

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Login Route
router.post("/login", async (req, res) => {
  try {
    console.log(" POST /api/login hit with data:", req.body);

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match for:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(" Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
