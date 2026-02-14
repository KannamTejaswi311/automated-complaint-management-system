import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./AdminAnalytics.css";

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0"];

export default function AdminAnalytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/analytics/categories")
      .then((res) => setCategoryData(res.data))
      .catch((err) =>
        console.error("Error fetching category data:", err)
      );

    axios
      .get("http://localhost:5000/api/analytics/status")
      .then((res) => setStatusData(res.data))
      .catch((err) =>
        console.error("Error fetching status data:", err)
      );
  }, []);

  const formatData = (arr) =>
    arr.map((item) => ({
      name: item._id,
      value: item.count,
    }));

  return (
    <div className="analytics-page">
      <h2 className="analytics-title">Analytics Dashboard</h2>

      <div className="analytics-grid">
        {/* Complaints by Category */}
        <div className="analytics-card">
          <h3>Complaints by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatData(categoryData)}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Complaints by Status */}
        <div className="analytics-card">
          <h3>Complaints by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formatData(statusData)}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
              >
                {statusData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
