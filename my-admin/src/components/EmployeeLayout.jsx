import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EmployeeLayout.css";

const EmployeeLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/employee/dashboard", icon: "🏠" },
    { label: "Attendance", path: "/employee/attendance", icon: "🕒" },
    { label: "Leave", path: "/employee/leave", icon: "📅" },
    { label: "Salary", path: "/employee/salary", icon: "💰" },
    { label: "Settings", path: "/employee/settings", icon: "⚙️" },
  ];

  return (
    <div className="layout-container">
      {/* FIXED SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-section">
          <h2>PAYROLL<span>MS</span></h2>
        </div>
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => navigate("/")} className="btn-logout">Logout</button>
        </div>
      </aside>

      {/* DYNAMIC MAIN CONTENT */}
      <div className="main-wrapper">
        <header className="top-header">
          <div className="breadcrumb">
            Employee / <span>{location.pathname.split("/").pop()}</span>
          </div>
          <div className="user-info">
            <span className="emp-id">EMP-2025</span>
            <div className="avatar">JD</div>
          </div>
        </header>
        <main className="content-area">
          {children} {/* This is where your actual pages will load */}
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;