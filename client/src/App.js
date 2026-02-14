import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import RegisterComplaint from "./pages/RegisterComplaint";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminQueries from "./pages/AdminQueries";
import StudentQueries from "./pages/StudentQueries";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Status from "./pages/Status";
import CreateDeptAdmin from "./pages/admin/CreateDeptAdmin";
import DeptAdminDashboard from "./pages/department/DeptAdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

/* ---------------- NAVBAR ---------------- */
function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="main-navbar">
      <h1 className="navbar-title">
        Automated Complaint Resolution System
      </h1>

      <div className="nav-actions">
        {/* MAIN ADMIN */}
        {role === "admin" && (
          <>
            <Link to="/admin" className="nav-btn primary">
              Dashboard
            </Link>
            <Link to="/admin/analytics" className="nav-btn secondary">
              Analytics
            </Link>
            <Link to="/admin/queries" className="nav-btn secondary">
              Queries
            </Link>
            <Link to="/admin/create-dept-admin" className="nav-btn secondary">
              Create Dept Admin
            </Link>
          </>
        )}

        {/* DEPARTMENT ADMIN */}
        {role === "dept_admin" && (
          <>
            <Link to="/department" className="nav-btn primary">
              Department Dashboard
            </Link>
          </>
        )}

        {/* STUDENT */}
        {role === "student" && (
          <>
            <Link to="/complaint" className="nav-btn primary">
              Register
            </Link>
            <Link to="/status" className="nav-btn secondary">
              Status
            </Link>
            <Link to="/queries" className="nav-btn secondary">
              Queries
            </Link>
          </>
        )}

        <button
          onClick={handleLogout}
          className="nav-btn danger logout-btn"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

/* ----------- LAYOUTS ----------- */
const AuthLayout = ({ children }) => <>{children}</>;

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="page-container">{children}</div>
  </>
);

/* ---------------- APP ---------------- */
function App() {
  return (
    <Router>
      <Routes>
        {/* ---------------- AUTH ---------------- */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />

        {/* ---------------- STUDENT ---------------- */}
        <Route
          path="/complaint"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MainLayout>
                <RegisterComplaint />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/status"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MainLayout>
                <Status />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/queries"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MainLayout>
                <StudentQueries />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ---------------- MAIN ADMIN ---------------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <AdminAnalytics />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/queries"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <AdminQueries />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-dept-admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <CreateDeptAdmin />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ---------------- DEPARTMENT ADMIN ---------------- */}
        <Route
          path="/department"
          element={
            <ProtectedRoute allowedRoles={["dept_admin"]}>
              <MainLayout>
                <DeptAdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ---------------- DEFAULT ---------------- */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
