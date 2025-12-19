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
import Accountant from "./pages/Accountant/Accountant";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import ForgotPassword from "./pages/Employee/ForgotPassword";
import Forgotpw from "./pages/Admin/Forgotpw";
import Forgotpass from "./pages/Accountant/Forgotpass";






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
        <Route path="/admin/forgot-password" element={<Forgotpw />} />

        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/leave" element={<Leave />} />
        <Route path="/admin/payroll" element={<Payroll />} /> {/* Added Payroll Route */}
        <Route path="/admin/report" element={<Report />} />
        {/* Accountant Routes */}
        <Route path="/accountant/accountant-dashboard" element={<Accountant />} />
        <Route path="/accountant/forgot-password" element={<Forgotpass />} />
        {/* Employee Routes */}
        <Route path="/employee/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;