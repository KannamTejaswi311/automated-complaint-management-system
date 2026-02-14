import React, { useEffect, useState } from "react";
import axios from "axios";
import FeedbackForm from "../components/FeedbackForm"; // 🔥 ADD THIS
import "./Status.css";

// Urgency priority order (highest → lowest)
const urgencyOrder = ["Critical", "High", "Urgent", "Normal", "Low"];

const Status = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.length > 0) {
        const sorted = [...res.data].sort((a, b) => {
          const aIndex =
            urgencyOrder.indexOf(a.urgency) !== -1
              ? urgencyOrder.indexOf(a.urgency)
              : urgencyOrder.length;
          const bIndex =
            urgencyOrder.indexOf(b.urgency) !== -1
              ? urgencyOrder.indexOf(b.urgency)
              : urgencyOrder.length;
          return aIndex - bIndex;
        });
        setComplaints(sorted);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load complaints. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) return <p className="status-loading">Loading complaints...</p>;
  if (error) return <p className="status-error">{error}</p>;

  return (
    <div className="status-page">
      <h2>My Complaints Status</h2>

      {complaints.length === 0 ? (
        <p className="no-complaints">No complaints submitted yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="status-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category (NLP)</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Image</th>
                <th>Feedback</th> {/* 🔥 NEW */}
              </tr>
            </thead>

            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td>{c.category || "Auto-detected"}</td>

                  <td>
                    <span
                      className={`urgency ${
                        c.urgency ? c.urgency.toLowerCase() : "low"
                      }`}
                    >
                      {c.urgency || "Normal"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status ${
                        c.status ? c.status.toLowerCase() : "pending"
                      }`}
                    >
                      {c.status || "Pending"}
                    </span>
                  </td>

                  <td>
                    {c.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${c.image}`}
                        alt="Complaint"
                        className="status-image"
                      />
                    ) : (
                      <span className="no-image">No Image</span>
                    )}
                  </td>

                  {/* 🔥 FEEDBACK COLUMN */}
                  <td>
                    {c.status === "Resolved" && !c.feedback ? (
                      <FeedbackForm
                        complaintId={c._id}
                        onSubmitted={fetchComplaints}
                      />
                    ) : c.feedback ? (
                      <span className="feedback-submitted">
                        ✅ Feedback submitted
                      </span>
                    ) : (
                      <span className="feedback-pending">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Status;
