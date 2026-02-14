import { useState } from "react";
import axios from "axios";

export default function FeedbackForm({ complaintId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");

  const submitFeedback = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!complaintId) {
        setMsg("❌ Invalid complaint ID");
        return;
      }

      if (!comment.trim()) {
        setMsg("❌ Feedback comment cannot be empty");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/complaints/${complaintId}/feedback`,
        {
          rating: Number(rating),
          comment: comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setMsg("✅ Feedback submitted successfully");
      setComment("");
      onSubmitted && onSubmitted();

    } catch (err) {
      console.error(err.response?.data || err.message);
      setMsg("❌ Failed to submit feedback");
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <label>Rating:</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <textarea
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <button onClick={submitFeedback}>
        Submit Feedback
      </button>

      {msg && <p>{msg}</p>}
    </div>
  );
}
