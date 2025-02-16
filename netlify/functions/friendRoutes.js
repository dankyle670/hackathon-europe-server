const express = require("express");
const FriendshipModel = require("./models/FriendshipModel");
const authMiddleware = require("./middleware/authMiddleware");

const router = express.Router();

// Send Friend Request
router.post("/friend-request/:receiverId", authMiddleware, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.userId;

    const existingRequest = await FriendshipModel.findOne({ senderId, receiverId });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    const friendship = new FriendshipModel({ senderId, receiverId });
    await friendship.save();
    res.status(201).json({ message: "Friend request sent!" });
  } catch (error) {
    console.error("Friend request error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Accept Friend Request
router.put("/friend-request/:requestId/accept", authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FriendshipModel.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiverId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = "accepted";
    await request.save();
    res.status(200).json({ message: "Friend request accepted!" });
  } catch (error) {
    console.error(" Accept request error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Friends List
router.get("/friends", authMiddleware, async (req, res) => {
  try {
    const friendships = await FriendshipModel.find({
      $or: [{ senderId: req.user.userId, status: "accepted" }, { receiverId: req.user.userId, status: "accepted" }]
    }).populate("senderId receiverId", "first_name last_name email");

    res.status(200).json(friendships);
  } catch (error) {
    console.error("Fetch friends error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
