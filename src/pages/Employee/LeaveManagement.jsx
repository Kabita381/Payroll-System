import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [currentEmpId] = useState(1); 
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [balances, setBalances] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); 
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Get today's date in YYYY-MM-DD format for the 'min' attribute
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadLeaveData();
  }, [currentEmpId]);

  const loadLeaveData = async () => {
    try {
      setLoading(true);
      const [typesRes, balRes, histRes] = await Promise.all([
        axios.get("http://localhost:8080/api/leave-types"),
        axios.get(`http://localhost:8080/api/leave-balance/employee/${currentEmpId}`),
        axios.get(`http://localhost:8080/api/employee-leaves`)
      ]);
      
      setLeaveTypes(typesRes.data);
      setBalances(balRes.data);
      const myHistory = histRes.data.filter(item => item.employee?.empId === currentEmpId);
      setLeaveHistory(myHistory);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const now = new Date(today);

    // --- VALIDATION LOGIC ---
    if (start < now) {
      setErrorMsg("Invalid Date: Start Date cannot be in the past.");
      setTimeout(() => setErrorMsg(""), 5000);
      return;
    }

    if (start > end) {
      setErrorMsg("Invalid Range: Start Date cannot be later than End Date.");
      setTimeout(() => setErrorMsg(""), 5000);
      return;
    }

    const payload = {
      employee: { empId: currentEmpId },
      leaveType: { leaveTypeId: parseInt(formData.leaveTypeId) },
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: "Pending"
    };

    try {
      await axios.post("http://localhost:8080/api/employee-leaves", payload);
      setSuccessMsg("Application Sent Successfully!");
      setFormData({ leaveTypeId: "", startDate: "", endDate: "", reason: "" });
      loadLeaveData();
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      const msg = err.response?.data?.message || "Check backend constraints.";
      setErrorMsg(`Failed: ${msg}`);
      setTimeout(() => setErrorMsg(""), 5000);
    }
  };

  if (loading) return <div className="loading-state">Initializing Module...</div>;

  return (
    <div className="leave-module-wrapper">
      <div className="module-header-center">
        <h1>Leave Management Module</h1>
      </div>

      {successMsg && <div className="success-toast-message">{successMsg}</div>}
      {errorMsg && <div className="error-toast-message">{errorMsg}</div>}

      <div className="leave-top-layout">
        <div className="balance-box-compact">
          <span className="box-label">Available Quota</span>
          <div className="days-display">
            {balances.reduce((sum, b) => sum + b.currentBalanceDays, 0)}
            <span className="days-unit">Days</span>
          </div>
          <div className="approved-footer">
            Approved: <strong>{leaveHistory.filter(l => l.status === 'Approved').reduce((s, l) => s + (l.totalDays || 0), 0)}</strong>
          </div>
        </div>

        <div className="apply-box-large">
          <h2 className="apply-title">Apply for New Leave</h2>
          <form onSubmit={handleSubmit} className="leave-form-grid">
            <div className="form-field">
              <select 
                value={formData.leaveTypeId} 
                onChange={(e) => setFormData({...formData, leaveTypeId: e.target.value})}
                required
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map(t => <option key={t.leaveTypeId} value={t.leaveTypeId}>{t.typeName}</option>)}
              </select>
            </div>

            <div className="form-field-row">
              <div className="date-group">
                <label>From Date</label>
                <input 
                  type="date" 
                  value={formData.startDate} 
                  min={today} // Prevents selecting dates before today
                  onChange={(e)=>setFormData({...formData, startDate: e.target.value})} 
                  required 
                />
              </div>
              <div className="date-group">
                <label>To Date</label>
                <input 
                  type="date" 
                  value={formData.endDate} 
                  min={formData.startDate || today} // Prevents picking date before Start Date
                  onChange={(e)=>setFormData({...formData, endDate: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="form-field">
              <textarea 
                placeholder="Reason for leave request..."
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                required
              />
            </div>

            <div className="submit-action-center">
              <button type="submit" className="btn-apply-gradient">Submit Application</button>
            </div>
          </form>
        </div>
      </div>

      <div className="leave-history-container">
        <h2 className="history-section-title">Your Leave History</h2>
        <div className="table-wrapper-scroll">
          <table className="leave-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Days</th>
                <th>Status</th>
                <th>Approved By</th>
                <th>Approved At</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((item) => (
                <tr key={item.leaveId}>
                  <td>#LV-{item.leaveId}</td>
                  <td>{item.leaveType?.typeName}</td>
                  <td>{item.startDate} to {item.endDate}</td>
                  <td className="bold-days">{item.totalDays}</td>
                  <td>
                    <span className={`status-pill ${item.status?.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status === "Approved" && item.approvedBy ? (
                      <span className="admin-text">{item.approvedBy.username}</span>
                    ) : (
                      <span className="dash-text">—</span>
                    )}
                  </td>
                  <td>
                    {item.status === "Approved" && item.approvedAt ? (
                      <span className="date-text">{new Date(item.approvedAt).toLocaleDateString()}</span>
                    ) : (
                      <span className="dash-text">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;