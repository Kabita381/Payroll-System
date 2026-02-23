import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./EmployeeLayout.css";

const EmployeeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    navigate("/");
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* A small, clean icon/logo placeholder */}
          <div className="brand-icon">💰</div>
          <div className="brand-text-wrapper">
            <span className="brand-subtitle">Payroll System</span>
            <h2 className="brand-title">Employee Overview</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/employee/dashboard" className={location.pathname === "/employee/dashboard" ? "active" : ""}>
            <span className="nav-icon">🏠</span> Dashboard
          </Link>
          <Link to="/employee/attendance" className={location.pathname === "/employee/attendance" ? "active" : ""}>
            <span className="nav-icon">🕒</span> Attendance
          </Link>
          <Link to="/employee/leave" className={location.pathname === "/employee/leave" ? "active" : ""}>
            <span className="nav-icon">📝</span> Leave Requests
          </Link>
          <Link to="/employee/salary" className={location.pathname === "/employee/salary" ? "active" : ""}>
            <span className="nav-icon">💰</span> Salary Info
          </Link>
          <Link to="/employee/settings" className={location.pathname === "/employee/settings" ? "active" : ""}>
            <span className="nav-icon">⚙️</span> Profile Settings
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn-noticeable" onClick={handleLogout}>
              Sign Out
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;