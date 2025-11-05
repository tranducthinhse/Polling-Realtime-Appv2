import express from "express";
import mongoose from "mongoose";
import Poll from "../models/Poll.js";
import { getIO } from "../socket.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// 🟢 Lấy tất cả polls
router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Tạo poll mới
router.post("/", async (req, res) => {
  try {
    const poll = await Poll.create(req.body);
    try {
      getIO().emit("pollCreated", poll);
    } catch (socketError) {
      console.error("Socket emit error:", socketError);
    }
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Bỏ phiếu (vote)
router.post("/:id/vote", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Vote request received:", { pollId: req.params.id, userId, body: req.body });

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid poll ID format" });
    }

    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // prevent double voting: check if user already voted
    const already = poll.votesBy && poll.votesBy.find(v => v.userId === String(userId));
    if (already) {
      return res.status(400).json({ error: 'User already voted on this poll' });
    }

    const { optionIndex } = req.body;
    if (optionIndex === undefined || !poll.options[optionIndex]) {
      return res.status(400).json({ error: "Invalid option index" });
    }

    poll.options[optionIndex].votes++;
    poll.votesBy = poll.votesBy || [];
    poll.votesBy.push({ userId: String(userId), optionIndex });

    try {
      await poll.save();
    } catch (saveError) {
      console.error("Error saving poll:", saveError);
      return res.status(500).json({ error: "Failed to save vote" });
    }

    try { getIO().emit('pollUpdated', poll); } catch (socketError) { console.error('Socket emit error:', socketError); }

    res.json(poll);
  } catch (err) {
    console.error("Vote handling error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Like poll
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request body" });
    }

    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    // toggle like: if user already liked, remove like; otherwise add
    const alreadyLiked = poll.likedBy && poll.likedBy.includes(userId);
    if (alreadyLiked) {
      poll.likedBy = poll.likedBy.filter(id => id !== userId);
      poll.likes = Math.max(0, (poll.likes || 1) - 1);
    } else {
      poll.likedBy = poll.likedBy || [];
      poll.likedBy.push(userId);
      poll.likes = (poll.likes || 0) + 1;
    }

    try {
      await poll.save();
    } catch (saveError) {
      console.error("Error saving poll like change:", saveError);
      return res.status(500).json({ error: "Failed to update like" });
    }

    try {
      getIO().emit("pollUpdated", poll);
    } catch (socketError) {
      console.error("Socket emit error:", socketError);
    }

    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get polls liked by a specific user
router.get('/liked/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const polls = await Poll.find({ likedBy: userId });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
