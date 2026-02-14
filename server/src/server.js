import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

// Routes
import complaintRoutes from "./routes/complaintRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // ✅ NEW
import chatQueryRoutes from "./routes/chatQueryRoutes.js";

dotenv.config();

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

/* ===================== DATABASE ===================== */
connectDB();

/* ===================== ROUTES ===================== */
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes); // ✅ NEW (Admin-only APIs)
app.use("/api/chat_queries", chatQueryRoutes);

/* ===================== DEFAULT ROUTE ===================== */
app.get("/", (req, res) => {
  res.send("Smart College Complaint Resolution API is running");
});

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
