import mongoose from "mongoose";

const chatQuerySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatQuery", chatQuerySchema);
