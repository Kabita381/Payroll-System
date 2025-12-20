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