import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import EmployeeLayout from "./components/EmployeeLayout";

// Public Pages
import Landing from "./pages/Landing";

// Login Pages
import AdminLogin from "./pages/Login/AdminLogin";
import AccountantLogin from "./pages/Login/AccountantLogin";
import EmployeeLogin from "./pages/Login/EmployeeLogin";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Employees from "./pages/Admin/Employees";
import Attendance from "./pages/Admin/Attendance";
import Leave from "./pages/Admin/Leave";
import Payroll from "./pages/Admin/Payroll";
import Report from "./pages/Admin/Report";
import Forgotpw from "./pages/Admin/Forgotpw";

// Accountant Pages
import Accountant from "./pages/Accountant/Accountant";
import Forgotpass from "./pages/Accountant/Forgotpass";

// Employee Pages
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import AttendanceRecords from "./pages/Employee/AttendanceRecords";
import LeaveManagement from "./pages/Employee/LeaveManagement";
import SalaryAnalytics from "./pages/Employee/SalaryAnalytics";
import Settings from "./pages/Employee/Settings";
import ForgotPassword from "./pages/Employee/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Login */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/accountant" element={<AccountantLogin />} />
        <Route path="/employee" element={<EmployeeLogin />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/leave" element={<Leave />} />
        <Route path="/admin/payroll" element={<Payroll />} />
        <Route path="/admin/report" element={<Report />} />
        <Route path="/admin/forgot-password" element={<Forgotpw />} />

        {/* Accountant */}
        <Route path="/accountant/dashboard" element={<Accountant />} />
        <Route path="/accountant/forgot-password" element={<Forgotpass />} />

        {/* Employee (with layout) */}
        <Route
          path="/employee/dashboard"
          element={<EmployeeLayout><EmployeeDashboard /></EmployeeLayout>}
        />
        <Route
          path="/employee/attendance"
          element={<EmployeeLayout><AttendanceRecords /></EmployeeLayout>}
        />
        <Route
          path="/employee/leave"
          element={<EmployeeLayout><LeaveManagement /></EmployeeLayout>}
        />
        <Route
          path="/employee/salary"
          element={<EmployeeLayout><SalaryAnalytics /></EmployeeLayout>}
        />
        <Route
          path="/employee/settings"
          element={<EmployeeLayout><Settings /></EmployeeLayout>}
        />
        <Route path="/employee/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
