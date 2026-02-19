import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { 
  getEmployeeHistory, 
  voidPayrollRecord, 
  emailPayslip 
} from "../../api/payrollApi";
import "./Payroll.css";

// History Modal Component
const HistoryModal = ({ isOpen, onClose, history, employeeName }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const availableYears = useMemo(() => {
    const years = [];
    for (let y = new Date().getFullYear(); y >= 2020; y--) years.push(y.toString());
    return years;
  }, []);

  if (!isOpen) return null; 

  const yearlyHistory = (history || []).filter(h => 
    h.payDate && h.payDate.startsWith(selectedYear)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="history-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="header-title">Payroll Audit: {employeeName}</h2>
            <p className="header-subtitle">Statutory history and tax deductions</p>
          </div>
          <div className="modal-controls">
            <select className="filter-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
        </div>
        <div className="modal-body">
          <table className="history-table">
            <thead>
              <tr>
                <th>Pay Date</th>
                <th>Gross Salary</th>
                <th>SSF (11%)</th>
                <th>CIT</th>
                <th>Tax</th>
                <th>Net Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {yearlyHistory.length > 0 ? yearlyHistory.map(h => (
                <tr key={h.payrollId} className={h.status === "VOIDED" ? "row-voided" : ""}>
                  <td>{h.payDate}</td>
                  <td>Rs. {h.grossSalary?.toLocaleString()}</td>
                  <td className="deduction">- {h.ssfContribution?.toLocaleString()}</td>
                  <td className="deduction">- {h.citContribution?.toLocaleString()}</td>
                  <td className="deduction">Rs. {h.totalTax?.toLocaleString()}</td>
                  <td className="bold text-success">Rs. {h.netSalary?.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${h.status?.toLowerCase().replace('_', '-')}`}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              )) : <tr><td colSpan="7" className="empty-state">No records found for {selectedYear}.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PayrollManagement = () => {
  const navigate = useNavigate();
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]); 
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedEmpName, setSelectedEmpName] = useState("");
  const [processingInputs, setProcessingInputs] = useState({});

  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    window.addEventListener('focus', fetchData);
    return () => window.removeEventListener('focus', fetchData);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, eRes, mRes] = await Promise.all([
        api.get("/payrolls"), 
        api.get("/employees"),
        api.get("/payment-methods")
      ]);
      // PRINT THIS: This shows us exactly what is in your Payroll Database
    console.log("--- DATABASE CHECK: ALL PAYROLL RECORDS ---");
    console.table(pRes.data);  setPayrolls(pRes.data || []);

      setEmployees(eRes.data || []);
      setPaymentMethods(mRes.data || []);
    } catch (err) { 
      console.error("Sync Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };
const currentStatusMap = useMemo(() => {
    const map = new Map();
    // targetPeriod will be "2026-02" based on your dropdown
    const targetPeriod = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`; 
    
    console.log("--- Payroll Lock Debug ---");
    console.log("Targeting Period:", targetPeriod);

    if (!Array.isArray(payrolls) || payrolls.length === 0) {
      console.log("No payrolls found in state.");
      return map;
    }

    payrolls.forEach(p => {
      // 1. Keep original logic: Skip voided
      if (p.status === "VOIDED" || p.isVoided) return;
      
      // 2. Based on your SQL desc: the ID is either in p.emp_id or p.employee.empId
      const empId = p.employee?.empId || p.empId;
      
      // 3. Match the date format "2026-02-01" from your SQL output
      let recordDate = "";
      if (p.payPeriodStart && typeof p.payPeriodStart === 'string') {
        recordDate = p.payPeriodStart.substring(0, 7); // Takes "2026-02"
      } else if (Array.isArray(p.payPeriodStart)) {
        recordDate = `${p.payPeriodStart[0]}-${String(p.payPeriodStart[1]).padStart(2, '0')}`;
      }

      console.log(`Checking DB Record: Emp ${empId} for Date ${recordDate}`);

      // 4. THE FIX: Link the employee to the record
      if (empId && recordDate === targetPeriod) {
        console.log(`MATCH! Locking Row for Employee ID: ${empId}`);
        map.set(String(empId), p);
      }
    });
    
    return map;
}, [payrolls, selectedMonth, selectedYear]);


  // For debugging: Log the currentStatusMap whenever it changes
  const filteredEmployees = useMemo(() => {

    const result = employees.filter(e => 
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase())
    );
    return result.sort((a, b) => b.empId - a.empId);
  }, [employees, search]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredEmployees.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);

  const handleInputChange = (empId, field, val) => {
    if (currentStatusMap.has(String(empId))) return;
    setProcessingInputs(prev => ({
      ...prev,
      [empId]: {
        ...(prev[empId] || { festivalBonus: 0, otherBonus: 0, citContribution: 0, paymentMethodId: "" }),
        [field]: val
      }
    }));
  };

  const handleActionRun = async (emp) => {
    const inputs = processingInputs[emp.empId] || {};
    if (!inputs.paymentMethodId) return alert(`Select a Payment Method for ${emp.firstName}`);

    try {
        const payload = {
            empId: parseInt(emp.empId), 
            festivalBonus: parseFloat(inputs.festivalBonus || 0),
            bonuses: parseFloat(inputs.otherBonus || 0),
            citContribution: parseFloat(inputs.citContribution || 0),
            payPeriodStart: `${selectedYear}-${selectedMonth}-01`
        };
        const res = await api.post("/payrolls/preview", payload);
        navigate("/admin/payroll/preview", { 
            state: { previewData: res.data, selectedPaymentMethodId: inputs.paymentMethodId } 
        });
    } catch (err) {
        alert(err.response?.data?.message || "Calculation failed");
        fetchData(); 
    }
  };

  const handleEmail = async (id) => {
    try { await emailPayslip(id); alert("Payslip emailed."); } catch { alert("Email failed."); }
  };

  const handleVoid = async (p) => {
    if (window.confirm(`Void payroll for ${p.employee?.firstName}?`)) {
      try { await voidPayrollRecord(p.payrollId); fetchData(); } catch { alert("Void failed."); }
    }
  };

  const handleViewHistory = async (emp) => {
    try {
      const res = await getEmployeeHistory(emp.empId);
      setHistoryData(res.data || []);
      setSelectedEmpName(`${emp.firstName} ${emp.lastName}`);
      setIsHistoryOpen(true);
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="loading-spinner">Synchronizing with Server...</div>;

  return (
    <div className="payroll-container">
      <div className="payroll-header-section">
        <div>
          <h1 className="header-title">Payroll Command Center</h1>
          <p className="header-subtitle">
            Processing: {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="header-controls">
          <select className="filter-select" value={selectedMonth} 
            onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}>
            {["01","02","03","04","05","06","07","08","09","10","11","12"].map(m => (
              <option key={m} value={m}>{new Date(2000, m-1).toLocaleString('default', {month: 'long'})}</option>
            ))}
          </select>

          <select className="filter-select" value={selectedYear} 
            onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}>
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>

          <input className="search-bar" placeholder="Search employee..." 
            onChange={(e)=>{setSearch(e.target.value); setCurrentPage(1);}} 
          />
        </div>
      </div>

      <div className="payroll-card">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Basic Salary</th>
              <th>Festival Bonus</th>
              <th>Other Bonus</th>
              <th>CIT</th>
              <th>Method</th>
              <th>Status</th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map(emp => {
                const record = currentStatusMap.get(String(emp.empId)); 
                const isLocked = !!record;
                const isPending = record?.status === "PENDING_PAYMENT";
                const inputs = processingInputs[emp.empId] || { festivalBonus: 0, otherBonus: 0, citContribution: 0, paymentMethodId: "" };

                return (
                  <tr key={emp.empId} className={isLocked ? "row-locked" : "table-row-hover"}>
                    <td>
                      <div className="emp-info">
                        <span className="emp-name">{emp.firstName} {emp.lastName}</span>
                        <span className="header-subtitle">{emp.maritalStatus}</span>
                      </div>
                    </td>
                    <td className="bold">Rs. {emp.basicSalary?.toLocaleString()}</td>
                    
                    <td>
                      {isLocked ? (
                        <span className="locked-value">Rs. {record.festivalBonus?.toLocaleString() || 0}</span>
                      ) : (
                        <input type="number" className="bonus-input-small" value={inputs.festivalBonus} 
                          onChange={(e)=>handleInputChange(emp.empId, 'festivalBonus', e.target.value)} />
                      )}
                    </td>

                    <td>
                      {isLocked ? (
                        <span className="locked-value">Rs. {record.otherBonuses?.toLocaleString() || 0}</span>
                      ) : (
                        <input type="number" className="bonus-input-small" value={inputs.otherBonus} 
                          onChange={(e)=>handleInputChange(emp.empId, 'otherBonus', e.target.value)} />
                      )}
                    </td>

                    <td>
                      {isLocked ? (
                        <span className="locked-value">Rs. {record.citContribution?.toLocaleString() || 0}</span>
                      ) : (
                        <input type="number" className="bonus-input-small" value={inputs.citContribution} 
                          onChange={(e)=>handleInputChange(emp.empId, 'citContribution', e.target.value)} />
                      )}
                    </td>

                    <td>
                      {isLocked ? (
                        <span className="method-label">{record.paymentMethod?.methodName || 'Bank'}</span>
                      ) : (
                        <select className="filter-select full-width-select" value={inputs.paymentMethodId}
                          onChange={(e) => handleInputChange(emp.empId, 'paymentMethodId', e.target.value)}>
                          <option value="">Select</option>
                          {paymentMethods.map(m => (
                            <option key={m.paymentMethodId} value={m.paymentMethodId}>{m.methodName}</option>
                          ))}
                        </select>
                      )}
                    </td>

                    <td>
                        <span className={`status-badge status-${(record?.status || 'READY').toLowerCase().replace('_', '-')}`}>
                            {record?.status || "READY"}
                        </span>
                    </td>
                    
                    <td className="actions-cell">
                        {!isLocked ? (
                          <button className="btn-icon btn-pdf" onClick={() => handleActionRun(emp)}>Run</button>
                        ) : (
                          <>
                            <button className="btn-icon btn-email" onClick={() => handleEmail(record.payrollId)} disabled={isPending}>Email</button>
                            <button className="btn-icon btn-void" onClick={() => handleVoid(record)}>Void</button>
                          </>
                        )}
                        <button className="btn-icon btn-history" onClick={() => handleViewHistory(emp)}>History</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <div className="pagination-footer">
          <div className="pagination-info">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredEmployees.length)} of {filteredEmployees.length} employees
          </div>
          <div className="pagination-buttons">
            <button className="p-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={`p-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button className="p-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
          </div>
        </div>
      </div>

      <HistoryModal isOpen={isHistoryOpen} onClose={()=>setIsHistoryOpen(false)} history={historyData} employeeName={selectedEmpName} />
    </div>
  );
};

export default PayrollManagement;