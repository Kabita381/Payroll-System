import React from "react";
import { Link } from "react-router-dom"; // 1. Import Link
import  "./ForgotPassword.css" ;

export default function AdminDashboard() {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav>
          <ul>
            {/* 2. Use Link for sidebar items */}
            <li className="active"><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/employees">Employees</Link></li>
            <li><Link to="/admin/attendance">Attendance</Link></li>
            <li><Link to="/admin/leave">Leave Requests</Link></li>
            <li><Link to="/admin/payroll">Payroll</Link></li>
            <li><Link to="/admin/config">System Config</Link></li>
            <li><Link to="/admin/reports">Reports</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="main-header">
          <h1>Admin Dashboard</h1>
          <p>Payroll Management System Overview</p>
        </header>

        <div className="stats-grid">
          {/* 3. Wrap each card in a Link to make the whole card clickable */}
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
          
           <Link to="/admin/config" className="stat-card">
            <div className="icon">📅</div>
            <h3>Config</h3>
            <p>Settings and Permissions</p>
          </Link>

          <Link to="/admin/reports" className="stat-card">
            <div className="icon">📅</div>
            <h3>Reports</h3>
            <p>Financial Statements</p>
          </Link>

        </div>
      </main>
    </div>
  );
}