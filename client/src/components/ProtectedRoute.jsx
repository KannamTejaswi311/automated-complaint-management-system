import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  // 🧩 If no token, redirect to login and remember where user was trying to go
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🧩 Check if user's role is allowed for this route
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="text-center mt-20 text-red-600">
        <h2 className="text-2xl font-bold mb-2">🚫 Access Denied</h2>
        <p className="text-gray-700">You are not authorized to view this page.</p>
      </div>
    );
  }

  // ✅ Authorized → render the child component
  return children;
};

export default ProtectedRoute;
