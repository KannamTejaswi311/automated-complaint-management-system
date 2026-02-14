import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// -------------------- CREATE DEPARTMENT ADMIN --------------------
router.post("/create-dept-admin", authMiddleware, async (req, res) => {
  try {
    // 🔒 Only main admin allowed
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password (same logic as signup)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create department admin
    const deptAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "dept_admin",
      department,
    });

    await deptAdmin.save();

    res.status(201).json({
      message: "Department admin created successfully",
      admin: {
        id: deptAdmin._id,
        name: deptAdmin.name,
        email: deptAdmin.email,
        department: deptAdmin.department,
      },
    });
  } catch (err) {
    console.error("❌ Create dept admin error:", err);
    res.status(500).json({ error: "Failed to create department admin" });
  }
});

export default router;
