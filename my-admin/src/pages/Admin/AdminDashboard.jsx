import React from "react";
import { Link } from "react-router-dom"; 
import "./admin.css";

export default function AdminDashboard() {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav>
          <ul>
            <li className="active"><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/employees">Employees</Link></li>
            <li><Link to="/admin/attendance">Attendance</Link></li>
            <li><Link to="/admin/leave">Leave Requests</Link></li>
            <li><Link to="/admin/payroll">Payroll</Link></li>
            <li><Link to="/admin/system-config">System Config</Link></li>  {/* updated */}
            <li><Link to="/admin/report">Reports</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="main-header">
          <h1>Admin Dashboard</h1>
          <p>Payroll Management System Overview</p>
        </header>

        <div className="stats-grid">
          <Link to="/admin/employees" className="stat-card">
            <div className="icon">👥</div>
            <h3>Employees</h3>
            <p>Manage staff profiles</p>
          </Link>
          
          <Link to="/admin/attendance" className="stat-card">
            <div className="icon">📅</div>
            <h3>Attendance</h3>
            <p>Daily logs & timing</p>
          </Link>

          <Link to="/admin/leave" className="stat-card">
            <div className="icon">📅</div>
            <h3>Leave</h3>
            <p>Pending Applications</p>
          </Link>
 
          <Link to="/admin/payroll" className="stat-card">
            <div className="icon">📅</div>
            <h3>Payroll</h3>
            <p>Salary and Tax Processing</p>
          </Link>
          
          <Link to="/admin/system-config" className="stat-card"> {/* updated */}
            <div className="icon">⚙️</div>
            <h3>System Config</h3>
            <p>Settings and Parameters</p>
          </Link>

          <Link to="/admin/report" className="stat-card">
            <div className="icon">📊</div>
            <h3>Reports</h3>
            <p>Financial Statements</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
