import express from "express";
import multer from "multer";
import Complaint from "../models/Complaint.js";
import axios from "axios";
import authMiddleware from "../middleware/authMiddleware.js";

// 🔥 Sentiment Analysis (Feature 3B)
import {
  analyzeSentiment,
  getSentimentLabel
} from "../utils/sentimentAnalyzer.js";

const router = express.Router();

// -------------------- Multer Storage Setup --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


// ============================================================
// POST: Create Complaint (STUDENT)
// ============================================================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: "Title and description are required"
      });
    }

    let category = "General";
    let urgency = "Normal";
    let assignedDept = "Support";

    // 🔹 ML-based categorization
    try {
      const mlResponse = await axios.post(
        "http://127.0.0.1:8000/predict",
        { text: description }
      );

      if (mlResponse.data) {
        category = mlResponse.data.category || category;
        urgency = mlResponse.data.urgency || urgency;
        assignedDept = category;
      }
    } catch (mlErr) {
      console.warn("⚠️ ML API not reachable:", mlErr.message);
    }

    // 🔹 Duplicate check
    const existingComplaints = await Complaint.find(
      { assignedDept },
      "description"
    );

    const existingTexts = existingComplaints.map(c => c.description);

    if (existingTexts.length > 0) {
      const duplicateResponse = await axios.post(
        "http://127.0.0.1:8000/check-duplicate",
        {
          newComplaint: description,
          existingComplaints: existingTexts,
        }
      );

      if (duplicateResponse.data.similarity >= 0.75) {
        return res.status(409).json({
          error: "A similar complaint has already been registered."
        });
      }
    }

    const complaint = new Complaint({
      title,
      description,
      image: req.file ? req.file.filename : null,
      category,
      urgency,
      assignedDept,
      status: "Pending",
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint registered successfully",
      complaint,
    });

  } catch (err) {
    console.error("❌ Error creating complaint:", err.message);
    res.status(500).json({ error: "Failed to create complaint" });
  }
});


// ============================================================
// GET: Complaints (ADMIN & DEPT ADMIN)
// ============================================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { role, department } = req.user;

    let filter = {};
    if (role === "dept_admin") {
      filter = { assignedDept: department };
    }

    const complaints = await Complaint.find(filter).sort({
      urgency: -1,
      createdAt: -1,
    });

    res.json(complaints);

  } catch (err) {
    console.error("❌ Error fetching complaints:", err.message);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});


// ============================================================
// PUT: Update Complaint Status (ADMIN / DEPT ADMIN)
// ============================================================
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json(updatedComplaint);

  } catch (err) {
    console.error("❌ Error updating complaint status:", err.message);
    res.status(500).json({ error: "Failed to update complaint status" });
  }
});


// ============================================================
// POST: Submit Feedback (STUDENT)
// FEATURE 3A + FEATURE 3B 🔥
// ============================================================
router.post("/:id/feedback", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        error: "Rating and feedback comment are required",
      });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    if (complaint.status !== "Resolved") {
      return res.status(400).json({
        error: "Feedback allowed only after complaint is resolved",
      });
    }

    // 🔥 Sentiment Analysis
    const score = analyzeSentiment(comment);
    const sentiment = getSentimentLabel(score);

    // 🔁 AI-based decision
    const updatedStatus =
      sentiment === "Negative" ? "Reopened" : "Closed";

    complaint.feedback = {
      rating,
      comment,
      sentiment,
      submittedAt: new Date(),
    };

    complaint.status = updatedStatus;

    await complaint.save();

    res.json({
      message: "Feedback submitted and complaint status verified",
      sentiment,
      finalStatus: updatedStatus,
    });

  } catch (err) {
    console.error("❌ Feedback error:", err.message);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});


// ============================================================
// GET: Analytics Summary (ADMIN) 🔥
// ============================================================
router.get("/analytics/summary", authMiddleware, async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();

    const reopenedByAI = await Complaint.countDocuments({
      status: "Reopened",
      "feedback.sentiment": "Negative",
    });

    const closedByAI = await Complaint.countDocuments({
      status: "Closed",
      "feedback.sentiment": { $in: ["Positive", "Neutral"] },
    });

    res.json({
      totalComplaints,
      reopenedByAI,
      closedByAI,
    });

  } catch (err) {
    console.error("❌ Analytics error:", err.message);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
