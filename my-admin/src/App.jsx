import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import AdminLogin from "./pages/Login/AdminLogin";
import AccountantLogin from "./pages/Login/AccountantLogin";
import EmployeeLogin from "./pages/Login/EmployeeLogin";

// ADMIN PAGES
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Employees from "./pages/Admin/Employees";
import Attendance from "./pages/Admin/Attendance";
import Leave from "./pages/Admin/Leave";
import Payroll from "./pages/Admin/Payroll";
import Report from "./pages/Admin/Report";
import SystemConfig from "./pages/Admin/SystemConfig"; // component import

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/accountant" element={<AccountantLogin />} />
        <Route path="/employee" element={<EmployeeLogin />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/leave" element={<Leave />} />
        <Route path="/admin/payroll" element={<Payroll />} />
        <Route path="/admin/report" element={<Report />} />
        <Route path="/admin/system-config" element={<SystemConfig />} /> {/* updated */}
      </Routes>
    </Router>
  );
}

export default App;
