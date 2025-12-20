import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Wrapper
import EmployeeLayout from "./components/EmployeeLayout";

// Common Pages
import Landing from "./pages/Landing";

// Login Pages
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

// EMPLOYEE PAGES
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import AttendanceRecords from "./pages/Employee/AttendanceRecords";
import LeaveManagement from "./pages/Employee/LeaveManagement";
import SalaryAnalytics from "./pages/Employee/SalaryAnalytics";
import Settings from "./pages/Employee/Settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Login Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/accountant" element={<AccountantLogin />} />
        <Route path="/employee" element={<EmployeeLogin />} />

        {/* Admin Routes (You can create an AdminLayout later for these) */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/leave" element={<Leave />} />
        <Route path="/admin/payroll" element={<Payroll />} />
        <Route path="/admin/report" element={<Report />} />

        {/* EMPLOYEE ROUTES - WRAPPED IN PROFESSIONALLY STYLED LAYOUT */}
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
      </Routes>
    </Router>
  );
}

export default App;