import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// Complaints per category
router.get("/categories", async (req, res) => {
  const data = await Complaint.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);
  res.json(data);
});

// Complaints by status
router.get("/status", async (req, res) => {
  const data = await Complaint.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  res.json(data);
});

export default router;
