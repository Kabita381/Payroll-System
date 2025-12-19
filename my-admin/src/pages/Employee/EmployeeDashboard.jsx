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
