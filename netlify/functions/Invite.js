const express = require("express");
const router = express.Router();
const Invite = require("./models/Invite");


router.post("/", async (req, res) => {
  try {
      const { senderId, receiverId, gameType } = req.body;

      const existingInvite = await Invite.findOne({ senderId, receiverId, status: "pending" });
      if (existingInvite) {
          return res.status(400).json({ message: "Invite already sent" });
      }

      const invite = new Invite({ senderId, receiverId, gameType });
      await invite.save();

      res.status(201).json({ message: "Invite sent", invite });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
      const { userId } = req.params;
      const invites = await Invite.find({ receiverId: userId, status: "pending" });

      res.status(200).json(invites);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:inviteId/accept", async (req, res) => {
  try {
      const { inviteId } = req.params;
      const invite = await Invite.findByIdAndUpdate(inviteId, { status: "accepted" }, { new: true });

      if (!invite) {
          return res.status(404).json({ message: "Invite not found" });
      }

      res.status(200).json({ message: "Invite accepted", invite });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:inviteId/decline", async (req, res) => {
  try {
      const { inviteId } = req.params;
      const invite = await Invite.findByIdAndUpdate(inviteId, { status: "declined" }, { new: true });

      if (!invite) {
          return res.status(404).json({ message: "Invite not found" });
      }

      res.status(200).json({ message: "Invite declined", invite });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:inviteId", async (req, res) => {
  try {
      const { inviteId } = req.params;
      const invite = await Invite.findByIdAndDelete(inviteId);

      if (!invite) {
          return res.status(404).json({ message: "Invite not found" });
      }

      res.status(200).json({ message: "Invite deleted" });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;