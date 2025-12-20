
import React from "react";
import { Link } from "react-router-dom";
import "./employee.css";

export default function EmployeeDashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Employee Panel</h2>
        </div>

        <nav>
          <ul>
            <li className="active">
              <Link to="/employee/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/employee/profile">Profile</Link>
            </li>
            <li>
              <Link to="/employee/attendance">Attendance</Link>
            </li>
            <li>
              <Link to="/employee/leave">Leave</Link>
            </li>
            <li>
              <Link to="/employee/payslip">Payslip</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1>Employee Dashboard</h1>
          <p>Personal Work & Payroll Info</p>
        </header>

        <div className="card-grid">
          <Link to="/employee/profile" className="dashboard-card">
            <div className="icon">👤</div>
            <h3>Profile</h3>
            <p>View details</p>
          </Link>

          <Link to="/employee/attendance" className="dashboard-card">
            <div className="icon">🕒</div>
            <h3>Attendance</h3>
            <p>Daily logs</p>
          </Link>

          <Link to="/employee/leave" className="dashboard-card">
            <div className="icon">📝</div>
            <h3>Leave</h3>
            <p>Apply leave</p>
          </Link>

          <Link to="/employee/payslip" className="dashboard-card">
            <div className="icon">📄</div>
            <h3>Payslip</h3>
            <p>Salary details</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  // Logic for Attendance
  const [attendanceStatus, setAttendanceStatus] = useState("Off-Duty");
  const [checkedIn, setCheckedIn] = useState(false);

  const markAttendance = () => {
    setAttendanceStatus("Detecting GPS...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setCheckedIn(true);
          setAttendanceStatus("Active: Checked In");
        },
        () => alert("Please enable location services to mark attendance.")
      );
    }
  };

  return (
    <div className="dashboard-view-container">
      {/* Cards Grid - This will now appear correctly inside your Layout content area */}
      <div className="stats-grid">
        
        {/* Daily Attendance Card */}
        <div className="stat-card">
          <div className="card-header-icon">📍</div>
          <h3>Daily Attendance</h3>
          <p className={`value-display ${checkedIn ? 'text-success' : ''}`}>
            {attendanceStatus}
          </p>
          <button
            className="btn-primary"
            onClick={markAttendance}
            disabled={checkedIn}
          >
            {checkedIn ? "Checked In Successfully" : "Mark GPS Attendance"}
          </button>
        </div>

        {/* Salary Card */}
        <div className="stat-card">
          <div className="card-header-icon">💰</div>
          <h3>Monthly Salary</h3>
          <p className="value-display">Rs. 45,000</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate("/employee/salary")}
          >
            View Analytics
          </button>
        </div>

        {/* Leave Balance Card */}
        <div className="stat-card">
          <div className="card-header-icon">📅</div>
          <h3>Leave Balance</h3>
          <p className="value-display">14 Days</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate("/employee/leave")}
          >
            Apply Leave
          </button>
        </div>

      </div>

      {/* Announcements Section */}
      <section className="announcements">
        <h3>📢 Recent Announcements</h3>
        <div className="note-box">
          Welcome to the new Payroll Management System. Please ensure your 
          bank details are up to date in the settings panel.
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;

