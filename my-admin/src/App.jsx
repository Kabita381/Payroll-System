import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/Login/AdminLogin";
import AccountantLogin from "./pages/Login/AccountantLogin";
import EmployeeLogin from "./pages/Login/EmployeeLogin";

// DASHBOARD AND ADMIN PAGES
import AdminDashboard from "./pages/Admin/AdminDashboard"; 
import Employees from "./pages/Admin/Employees";
import Attendance from "./pages/Admin/Attendance";
import Leave from "./pages/Admin/Leave";
import Payroll from "./pages/Admin/Payroll"; // FIX: Changed 'Leave' to 'Payroll'
import Report from "./pages/Admin/Report";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/accountant" element={<AccountantLogin />} />
        <Route path="/employee" element={<EmployeeLogin />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/leave" element={<Leave />} />
        <Route path="/admin/payroll" element={<Payroll />} /> {/* Added Payroll Route */}
        <Route path="/admin/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;