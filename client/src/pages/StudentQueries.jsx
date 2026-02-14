import { useEffect, useState } from "react";
import axios from "axios";
import "./StudentQueries.css";

export default function StudentQueries() {
  const [message, setMessage] = useState("");
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/chat_queries/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQueries(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load queries");
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat_queries",
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQueries((prev) => [res.data, ...prev]);
      setMessage("");
    } catch (err) {
      console.error("Failed to submit query:", err);
      alert("Failed to submit query");
    }
  };

  if (loading) return <p className="queries-loading">Loading...</p>;
  if (error) return <p className="queries-error">{error}</p>;

  return (
    <div className="student-queries-page">
      <h2>My Queries</h2>

      <form onSubmit={handleSubmit} className="query-form">
        <textarea
          placeholder="Ask your question here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">Submit Query</button>
      </form>

      {queries.length === 0 ? (
        <p className="no-queries">No queries submitted yet.</p>
      ) : (
        <div className="query-list">
          {queries.map((q) => (
            <div key={q._id} className="query-card">
              <p className="query-message">{q.message}</p>

              {q.reply ? (
                <p className="query-reply">
                  <strong>Admin Reply:</strong> {q.reply}
                </p>
              ) : (
                <p className="query-pending">
                  Awaiting admin reply...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
