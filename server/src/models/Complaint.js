import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },

  image: { type: String, default: null },

  category: { type: String, default: "General" },
  urgency: { type: String, default: "Normal" },
  assignedDept: { type: String, default: "Support" },

  // 🔥 Updated status enum (Feature 3B)
  status: {
    type: String,
    enum: [
      "Pending",
      "In Progress",
      "Resolved",
      "Closed",
      "Reopened"
    ],
    default: "Pending",
  },

  // 🔹 Feedback with sentiment
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"]
    },
    submittedAt: { type: Date }
  },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Complaint", complaintSchema);
