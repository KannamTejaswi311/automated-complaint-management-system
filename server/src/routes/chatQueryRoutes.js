import express from "express";
import ChatQuery from "../models/ChatQuery.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= STUDENT: SUBMIT QUERY ================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const query = await ChatQuery.create({
      student: req.user.id,
      message: req.body.message,
    });
    res.status(201).json(query);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit query" });
  }
});

/* ================= STUDENT: GET OWN QUERIES ================= */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const queries = await ChatQuery.find({
      student: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch queries" });
  }
});

/* ================= ADMIN: GET ALL QUERIES ================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const queries = await ChatQuery.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch queries" });
  }
});

/* ================= ADMIN: REPLY ================= */
router.post("/:id/reply", authMiddleware, async (req, res) => {
  try {
    await ChatQuery.findByIdAndUpdate(req.params.id, {
      reply: req.body.reply,
    });
    res.json({ message: "Reply sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send reply" });
  }
});

export default router;
