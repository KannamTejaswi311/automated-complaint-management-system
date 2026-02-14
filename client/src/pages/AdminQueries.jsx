import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminQueries.css";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/chat_queries",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setQueries(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load student queries.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const handleReply = async (id, replyText) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/chat_queries/${id}/reply`,
        { reply: replyText },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ REQUIRED
          },
        }
      );

      // Update UI immediately
      setQueries((prev) =>
        prev.map((q) =>
          q._id === id ? { ...q, reply: replyText } : q
        )
      );

      alert("Reply sent successfully!");
    } catch (err) {
      console.error("Reply failed:", err);
      alert("Failed to send reply");
    }
  };

  if (loading) return <p className="queries-loading">Loading queries...</p>;
  if (error) return <p className="queries-error">{error}</p>;

  return (
    <div className="queries-page">
      <h2>Student Queries</h2>

      {queries.length === 0 ? (
        <p className="no-queries">No pending queries.</p>
      ) : (
        <div className="queries-list">
          {queries.map((q) => (
            <div key={q._id} className="query-card">
              <p className="query-message">{q.message}</p>

              {q.reply ? (
                <p className="query-reply">
                  <strong>Reply:</strong> {q.reply}
                </p>
              ) : (
                <button
                  onClick={() => {
                    const replyText = prompt("Enter reply:");
                    if (replyText) handleReply(q._id, replyText);
                  }}
                >
                  Reply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
