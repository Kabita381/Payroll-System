import React, { useState, useEffect, useMemo } from "react";
import api from "../../api/axios";
import "./Payroll.css";

/**
 * HISTORY MODAL COMPONENT
 * Handles viewing past payrolls by year
 */
const HistoryModal = ({ isOpen, onClose, history, employeeName }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Generate range from 2020 to 2026
  const availableYears = useMemo(() => {
    const years = [];
    for (let y = new Date().getFullYear(); y >= 2020; y--) {
      years.push(y.toString());
    }
    return years;
  }, []);

  if (!isOpen) return null;

  const yearlyHistory = history.filter(h => 
    new Date(h.payDate).getFullYear().toString() === selectedYear
  );

  return (
    <div className="modal-overlay">
      <div className="history-modal-content">
        <div className="modal-header">
          <div>
            <h2 className="header-title">Salary History: {employeeName}</h2>
            <p className="header-subtitle">Yearly disbursement breakdown</p>
          </div>
          <div className="modal-controls">
            <select 
              className="year-select" 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
        </div>
        <div className="modal-body">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Ref #</th>
                <th>Gross</th>
                <th>Net Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {yearlyHistory.length > 0 ? (
                yearlyHistory.map((h) => (
                  <tr key={h.payrollId} className={h.status === "VOIDED" ? "row-voided" : ""}>
                    <td>{h.payDate}</td>
                    <td>{h.payslipRef || `PAY-${h.payrollId}`}</td>
                    <td>Rs. {h.grossSalary.toLocaleString()}</td>
                    <td>Rs. {h.netSalary.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${h.status === "VOIDED" ? "status-void" : "status-paid"}`}>
                        {h.status || 'PAID'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    No records found for the year {selectedYear}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * MAIN PAYROLL MANAGEMENT COMPONENT
 */
const PayrollManagement = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedEmpName, setSelectedEmpName] = useState("");

  useEffect(() => { loadPayrolls(); }, []);

  const loadPayrolls = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payrolls");
      setPayrolls(res.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  // ACTION: Email
  const handleEmailPayslip = async (p) => {
    try {
      await api.post(`/payrolls/${p.payrollId}/send-email`);
      alert(`Payslip sent to ${p.employee.firstName}'s email!`);
    } catch (err) {
      alert("Email service is currently offline. Check backend logs.");
    }
  };

  // ACTION: Void
  const handleVoidPayroll = async (p) => {
    if (window.confirm(`Are you sure you want to VOID this record for ${p.employee.firstName}?`)) {
      try {
        await api.put(`/payrolls/${p.payrollId}/void`);
        alert("Payroll record has been voided.");
        loadPayrolls(); // Refresh dashboard
      } catch (err) {
        alert("Failed to void record. Ensure the backend endpoint exists.");
      }
    }
  };

  // ACTION: View History
  const handleViewHistory = async (p) => {
    try {
      const res = await api.get(`/payrolls/employee/${p.employee.empId}/history`);
      setHistoryData(res.data); 
      setSelectedEmpName(`${p.employee.firstName} ${p.employee.lastName}`);
      setIsHistoryOpen(true);
    } catch (err) { 
      setHistoryData([p]); // Fallback to current if history fetch fails
      setSelectedEmpName(`${p.employee.firstName} ${p.employee.lastName}`);
      setIsHistoryOpen(true);
    }
  };

  // Filter to show only unique latest records per employee
  const uniqueCurrentPayrolls = useMemo(() => {
    const sorted = [...payrolls].sort((a, b) => b.payrollId - a.payrollId);
    const latestMap = new Map();
    sorted.forEach(p => {
      if (!latestMap.has(p.employee.empId)) latestMap.set(p.employee.empId, p);
    });
    return Array.from(latestMap.values());
  }, [payrolls]);

  const filteredPayrolls = uniqueCurrentPayrolls.filter(p => 
    `${p.employee.firstName} ${p.employee.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalNetPayable = uniqueCurrentPayrolls
    .filter(p => p.status !== "VOIDED")
    .reduce((acc, curr) => acc + curr.netSalary, 0);

  if (loading) return <div className="loading-spinner">Initializing Payroll Environment...</div>;

  return (
    <div className="payroll-container">
      <div className="payroll-header-section">
        <div>
          <h1 className="header-title">Payroll Command Center</h1>
          <p className="header-subtitle">Professional Disbursement & Audit System</p>
        </div>
        <div className="search-wrapper">
          <input
            type="text" className="search-bar" placeholder="Search Name or Ref #..." 
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">TOTAL NET (ACTIVE)</span>
          <span className="stat-value">Rs. {totalNetPayable.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">PROCESSED MONTHLY</span>
          <span className="stat-value">{uniqueCurrentPayrolls.length} Employees</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">SYSTEM MODE</span>
          <div style={{marginTop: '8px'}}><span className="status-pill status-paid">LIVE - AUDIT ENABLED</span></div>
        </div>
      </div>

      <div className="payroll-card">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>EMPLOYEE / REF</th>
              <th>STATUS</th>
              <th>NET PAYABLE</th>
              <th>BONUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayrolls.map(p => (
              <tr key={p.payrollId} className={`table-row-hover ${p.status === "VOIDED" ? 'row-voided' : ''}`}>
                <td>
                  <span className="emp-name">{p.employee.firstName} {p.employee.lastName}</span>
                  <span className="emp-id">ID: {p.employee.empId}</span>
                </td>
                <td>
                  <span className={`status-badge ${p.status === "VOIDED" ? 'status-void' : 'status-paid'}`}>
                    {p.status || 'PAID'}
                  </span>
                </td>
                <td><span className="amount-net">Rs. {p.netSalary.toLocaleString()}</span></td>
                <td>
                  <div className="bonus-action-cell">
                    <input type="number" className="bonus-input-small" placeholder="Bonus" />
                    <button className="btn-bonus-add">ADD</button>
                  </div>
                </td>
                <td className="actions-cell">
                  <button className="btn-icon btn-history" onClick={() => handleViewHistory(p)}>History</button>
                  <button className="btn-icon btn-email" onClick={() => handleEmailPayslip(p)}>Email</button>
                  <button className="btn-icon btn-void" onClick={() => handleVoidPayroll(p)}>Void</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={historyData} 
        employeeName={selectedEmpName}
      />
    </div>
  );
};

export default PayrollManagement;