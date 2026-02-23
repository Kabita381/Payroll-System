import React, { useState, useEffect } from "react";
import { getDashboardStats } from "../../api/employeeApi"; 
import { getAttendanceByEmployee } from "../../api/attendanceApi";
import "./EmployeeDashboard.css";
import { First } from "react-bootstrap/esm/PageItem";

const EmployeeDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [employeeInfo, setEmployeeInfo] = useState({
    name: "name",
    attendance: "0%",
    leaveBalance: "0 Days",
    lastSalary: "Rs. 0",
    tax: "Rs. 0",
    totalAllowances: "Rs. 0"
  });
  

  useEffect(() => {
    const loadData = async () => {
      try {
        const session = JSON.parse(localStorage.getItem("user_session") || "{}");
        const id = session.empId || session.userId;
        if (!id) return setLoading(false);

        // Fetch dashboard stats and attendance together
        const [statsRes, attendanceRes] = await Promise.all([
          getDashboardStats(id).catch(() => ({ data: {} })),
          getAttendanceByEmployee(id).catch(() => ({ data: [] }))
        ]);

        // Attendance calculation
        const now = new Date();
        const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const logs = attendanceRes.data || [];
        const currentMonthLogs = logs.filter(log => {
          const d = new Date(log.attendanceDate);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        const uniqueDays = new Set(currentMonthLogs.map(l => l.attendanceDate)).size;
        const percent = totalDays > 0 ? ((uniqueDays / totalDays) * 100).toFixed(1) : 0;

        // Map backend response to frontend
        const stats = statsRes.data || {};
        setEmployeeInfo({
          name: stats.firstName || "Employee",
          attendance: `${percent}%`,
          leaveBalance: `${stats.remainingLeaves || 0} Days`,
          lastSalary: `Rs. ${stats.lastSalary?.toLocaleString() || 0}`,
          tax: `Rs. ${stats.taxableAmount?.toLocaleString() || 0}`,
          totalAllowances: `Rs. ${stats.totalAllowances?.toLocaleString() || 0}`
        });
      } catch (err) {
        console.error("Dashboard Load Failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-content-wrapper">
      <header className="dashboard-welcome-header">
        <h1>Welcome Back, {employeeInfo.name}! 👋</h1>
        <p>Here is what's happening with your profile today.</p>
      </header>

      <div className="stats-row">
        <StatCard 
          label="Attendance (Monthly)" 
          value={employeeInfo.attendance} 
          icon="🕒" 
          color="#4f46e5" 
        />
        <StatCard 
          label="Leave Balance" 
          value={employeeInfo.leaveBalance} 
          icon="📝" 
          color="#0891b2" 
        />
        <StatCard 
          label="Net Salary" 
          value={employeeInfo.lastSalary} 
          icon="💰" 
          color="#059669" 
        />
        
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="status-kpi-card">
    <div 
      className="kpi-icon-container" 
      style={{ 
        color: color, 
        backgroundColor: `${color}15` // 15% opacity
      }}
    >
      {icon}
    </div>
    <div className="kpi-data">
      <span className="kpi-label">{label}</span>
      <h2 className="kpi-value">{value}</h2>
    </div>
  </div>
);

export default EmployeeDashboard;