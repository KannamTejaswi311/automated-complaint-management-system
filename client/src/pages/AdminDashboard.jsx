import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

// Urgency priority order
const urgencyOrder = { High: 1, Medium: 2, Normal: 3 };

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const sortByUrgency = (data) => {
    return [...data].sort(
      (a, b) =>
        (urgencyOrder[a.urgency] || 4) - (urgencyOrder[b.urgency] || 4)
    );
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setComplaints(sortByUrgency(res.data));
      } catch (err) {
        console.error("Failed to load complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComplaints((prev) =>
        sortByUrgency(
          prev.map((c) =>
            c._id === id ? { ...c, status: newStatus } : c
          )
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading complaints...</p>;
  }

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>

        <Link to="/admin/create-dept-admin" className="create-admin-btn">
          ➕ Create Department Admin
        </Link>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>{c.title}</td>
                <td>{c.category || "Auto-detected"}</td>

                <td>
                  <span className={`urgency ${c.urgency?.toLowerCase()}`}>
                    {c.urgency || "Normal"}
                  </span>
                </td>

                <td>
                  <span className={`status ${c.status?.toLowerCase()}`}>
                    {c.status || "Pending"}
                  </span>
                </td>

                <td>
                  <select
                    value={c.status}
                    onChange={(e) =>
                      handleStatusChange(c._id, e.target.value)
                    }
                    disabled={c.status === "Resolved"}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => setSelectedComplaint(c)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW COMPLAINT MODAL */}
      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedComplaint.title}</h3>

            <p className="modal-label">
              <strong>Description:</strong>
            </p>
            <p>{selectedComplaint.description}</p>

            {selectedComplaint.image && (
              <img
                src={`http://localhost:5000/uploads/${selectedComplaint.image}`}
                alt="Complaint"
                className="complaint-image"
              />
            )}

            {/* 🔥 FEEDBACK SECTION (FEATURE 3A) */}
            {selectedComplaint.feedback ? (
              <div style={{ marginTop: "15px" }}>
                <h4>📝 Student Feedback</h4>
                <p>
                  ⭐ Rating: {selectedComplaint.feedback.rating} / 5
                </p>
                <p>{selectedComplaint.feedback.comment}</p>
              </div>
            ) : (
              <p style={{ marginTop: "15px", color: "#555" }}>
                No feedback submitted yet.
              </p>
            )}

            <button
              className="close-btn"
              onClick={() => setSelectedComplaint(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
