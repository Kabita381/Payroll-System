import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import api from "../../api/axios"; // JWT-enabled axios
import "./Report.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Report() {
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalPayroll: 0,
    totalDeductions: 0,
    totalAllowances: 0,
    pendingLeaves: 0
  });
  const [monthlyData, setMonthlyData] = useState([0,0,0,0,0,0]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      // Fetch employees
      const empRes = await api.get("/employees");
      const employees = Array.isArray(empRes.data) ? empRes.data : [];
      
      // Fetch payrolls
      const payrollRes = await api.get("/payrolls");
      const payrolls = Array.isArray(payrollRes.data) ? payrollRes.data : [];

      // Fetch leaves
      const leaveRes = await api.get("/employee-leaves");
      const leaves = Array.isArray(leaveRes.data) ? leaveRes.data : [];

      // Summary Calculations
      const totalPayroll = payrolls.reduce((sum, p) => sum + (p.grossSalary || 0), 0);
      const totalDeductions = payrolls.reduce((sum, p) => sum + (p.totalDeductions || 0), 0);
      const totalAllowances = payrolls.reduce((sum, p) => sum + (p.totalAllowances || 0), 0);
      const pendingLeaves = leaves.filter(l => l.status === "Pending").length;

      setSummary({
        totalEmployees: employees.length,
        totalPayroll,
        totalDeductions,
        totalAllowances,
        pendingLeaves
      });

      // Monthly payroll aggregation
      const months = [0,0,0,0,0,0]; // Jan-Jun
      payrolls.forEach(p => {
        if (p.createdAt) {
          const month = new Date(p.createdAt).getMonth(); // 0-11
          if (month < 6) months[month] += p.grossSalary || 0;
        }
      });
      setMonthlyData(months);

    } catch (err) {
      console.error("Report fetch error:", err.response?.data || err.message);
    }
  };

  const monthlyPayrollData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Salary Paid (NPR)",
        data: monthlyData,
        backgroundColor: "#1976d2"
      }
    ]
  };

  return (
    <div className="report-page">
      <div className="report-left">
        <header className="report-header">
          <h1>Payroll Reports</h1>
          <p>Consolidated payroll, employee and financial insights</p>
        </header>

        <div className="report-summary">
          <div className="summary-card">
            <div className="icon">👥</div>
            <h3>Total Employees</h3>
            <p>{summary.totalEmployees}</p>
          </div>

          <div className="summary-card">
            <div className="icon">💰</div>
            <h3>Monthly Payroll</h3>
            <p>NPR {summary.totalPayroll.toLocaleString()}</p>
          </div>

          <div className="summary-card">
            <div className="icon">📉</div>
            <h3>Total Deductions</h3>
            <p>NPR {summary.totalDeductions.toLocaleString()}</p>
          </div>

          <div className="summary-card">
            <div className="icon">🧾</div>
            <h3>Total Allowances</h3>
            <p>NPR {summary.totalAllowances.toLocaleString()}</p>
          </div>

          <div className="summary-card">
            <div className="icon">🕒</div>
            <h3>Pending Leaves</h3>
            <p>{summary.pendingLeaves}</p>
          </div>
        </div>
      </div>

      <div className="report-right">
        <div className="chart-section">
          <h2>Monthly Payroll Expenditure</h2>
          <Bar
            data={monthlyPayrollData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: true, position: "bottom" } }
            }}
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
