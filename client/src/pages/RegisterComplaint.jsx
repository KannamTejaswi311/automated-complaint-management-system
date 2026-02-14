import { useState } from "react";
import axios from "axios";
import "./RegisterComplaint.css";

export default function RegisterComplaint() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");            // success message
  const [duplicateError, setDuplicateError] = useState(""); // error message
  const [tips, setTips] = useState([]);                  // FEATURE 2 tips

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });

      // 🔥 Analyze complaint text only
      if (name === "description") {
        analyzeComplaint(value);
      }
    }
  };

  // =================================================
  // FEATURE 2: NLP-based Complaint Improvement Tips
  // =================================================
  const analyzeComplaint = (text) => {
    const suggestions = [];

    // Location
    if (!/(hostel|block|room|library|lab|canteen|class|building)/i.test(text)) {
      suggestions.push("📍 Mention the location (e.g., hostel, block, room).");
    }

    // Duration
    if (!/(day|days|hour|hours|since|week|weeks|today|yesterday)/i.test(text)) {
      suggestions.push("⏱ Mention how long the issue has existed.");
    }

    // Severity / nature
    if (
      !/(not working|broken|leak|leaking|damaged|urgent|emergency|issue)/i.test(
        text
      )
    ) {
      suggestions.push("⚠️ Describe the severity or nature of the problem.");
    }

    setTips(suggestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setDuplicateError("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/complaints", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Complaint submitted successfully");
      setForm({ title: "", description: "", image: null });
      setTips([]);
    } catch (err) {
      console.error(err);

      if (err.response && err.response.status === 409) {
        setDuplicateError(
          "⚠️ A similar complaint has already been registered by you or another student. Please check existing complaints instead of submitting again."
        );
      } else {
        setDuplicateError("❌ Failed to submit complaint. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="complaint-page">
      <div className="complaint-card">
        <h2>Register Complaint</h2>
        <p className="subtitle">
          Submit your issue and track its resolution
        </p>

        {/* Success message */}
        {message && <div className="message success">{message}</div>}

        {/* Error / duplicate message */}
        {duplicateError && (
          <div className="message error">{duplicateError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Complaint Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter complaint title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Describe your complaint in detail..."
            value={form.description}
            onChange={handleChange}
            required
          />

          {/* 🔥 FEATURE 2: Improvement Suggestions */}
          {tips.length > 0 && (
            <div className="tips-box">
              <strong>💡 Improve your complaint:</strong>
              <ul>
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <label>Upload Image (optional)</label>
          <input type="file" name="image" onChange={handleChange} />

          {form.image && (
            <img
              src={URL.createObjectURL(form.image)}
              alt="Preview"
              className="preview"
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}
