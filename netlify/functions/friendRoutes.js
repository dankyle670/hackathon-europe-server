const express = require("express");
const FriendshipModel = require("./models/FriendshipModel");
const UserModel = require("./models/UserModel");
const authMiddleware = require("./middleware/authMiddleware");

const router = express.Router();

// Send Friend Request
router.post("/friend-request/:receiverId", authMiddleware, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.userId;

    if (receiverId === senderId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself." });
    }

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
    console.error("Accept request error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject Friend Request
router.put("/friend-request/:requestId/reject", authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FriendshipModel.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiverId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await FriendshipModel.findByIdAndDelete(requestId);
    res.status(200).json({ message: "Friend request rejected!" });
  } catch (error) {
    console.error("Reject request error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel Sent Friend Request
router.delete("/friend-request/:receiverId/cancel", authMiddleware, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.userId;

    const request = await FriendshipModel.findOne({ senderId, receiverId, status: "pending" });

    if (!request) {
      return res.status(404).json({ message: "No pending request found." });
    }

    await FriendshipModel.findByIdAndDelete(request._id);
    res.status(200).json({ message: "Friend request canceled!" });
  } catch (error) {
    console.error("Cancel request error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//  Get Pending Friend Requests with Count
router.get("/friend-requests/pending", authMiddleware, async (req, res) => {
    try {
      const pendingRequests = await FriendshipModel.find({
        receiverId: req.user.userId,
        status: "pending",
      }).populate("senderId", "first_name last_name email");
      res.status(200).json({ count: pendingRequests.length, pendingRequests });
    } catch (error) {
      console.error("❌ Fetch pending friend requests error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// Get Friends List
router.get("/friends", authMiddleware, async (req, res) => {
  try {
    const friendships = await FriendshipModel.find({
      $or: [
        { senderId: req.user.userId, status: "accepted" },
        { receiverId: req.user.userId, status: "accepted" },
      ],
    }).populate("senderId receiverId", "first_name last_name email");

    const friends = friendships.map((friendship) =>
      friendship.senderId._id.toString() === req.user.userId
        ? friendship.receiverId
        : friendship.senderId
    );

    res.status(200).json(friends);
  } catch (error) {
    console.error("Fetch friends error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove a Friend
router.delete("/friends/:friendId/remove", authMiddleware, async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.userId;

    const friendship = await FriendshipModel.findOneAndDelete({
      $or: [
        { senderId: userId, receiverId: friendId, status: "accepted" },
        { senderId: friendId, receiverId: userId, status: "accepted" },
      ],
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found." });
    }

    res.status(200).json({ message: "Friend removed!" });
  } catch (error) {
    console.error("Remove friend error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
