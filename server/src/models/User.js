import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "admin", "dept_admin"],
      default: "student",
    },

    // Only for department admins
    department: {
      type: String,
      enum: ["Library", "Hostel", "Sports", "Transport", "Canteen"],
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
