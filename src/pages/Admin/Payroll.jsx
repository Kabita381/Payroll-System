import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "./Payroll.css";

const PayrollManagement = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPayrolls();
  }, []);

<<<<<<< HEAD
  const loadPayrolls = async () => {
    try {
      const res = await api.get("/payrolls");
      setPayrolls(res.data);
    } catch (err) {
      console.error("Failed to fetch payrolls", err);
    }
  };
=======
    const loadPayrolls = async () => {
        try {
            const res = await api.get("/payrolls");
            setPayrolls(res.data);
        } catch (err) {
            console.error("Failed to fetch payrolls", err);
        }
    };
>>>>>>> fc55ff3ba7b6ff9a8ac64d4f52d01c775e678fcc

  // --- NEW: System Logging for Email Actions ---
  const logAction = async (payrollId, actionType, employeeName) => {
    try {
      await api.post("/payroll-audit", {
        payrollId: payrollId,
        action: actionType,
        details: `${actionType === 'EMAIL_SENT' ? 'Payslip emailed' : 'Payslip viewed'} for ${employeeName}`,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error("Audit logging failed", err);
    }
  };

<<<<<<< HEAD
  // --- FIXED: Email Click Handler ---
  const handleEmailDispatch = async (payroll) => {
    const confirmSend = window.confirm(`Send digital payslip to ${payroll.employee.firstName}?`);
    
    if (confirmSend) {
      try {
        // Trigger backend email service
        await api.post(`/payrolls/${payroll.payrollId}/send-email`);
        
        // Save this event in the system audit table
        await logAction(payroll.payrollId, "EMAIL_SENT", `${payroll.employee.firstName} ${payroll.employee.lastName}`);
        
        alert("Success: Digital payslip dispatched to employee email.");
      } catch (err) {
        alert("Error: Email service is currently unavailable.");
        console.error(err);
      }
    }
  };
=======
    const generatePDFView = (data) => {
        const win = window.open("", "_blank");
        // Logic to show all individual components in the PDF
        const totalEarnings = data.grossSalary + data.totalAllowances;
        const totalDeductions = data.totalDeductions + data.totalTax;

        win.document.write(`
            <html>
                <head>
                    <title>Payslip - ${data.employee.firstName} ${data.employee.lastName}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
                        .payslip-container { max-width: 800px; margin: auto; border: 1px solid #ddd; padding: 30px; border-radius: 8px; }
                        .header { text-align: center; border-bottom: 3px solid #1a73e8; padding-bottom: 10px; margin-bottom: 25px; }
                        .header h1 { margin: 0; color: #1a73e8; }
                        .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        th { background: #f8f9fa; padding: 12px; border: 1px solid #dee2e6; text-align: left; }
                        td { padding: 12px; border: 1px solid #dee2e6; }
                        .text-right { text-align: right; font-weight: bold; }
                        .net-box { background: #1a73e8; color: white; padding: 20px; text-align: right; border-radius: 4px; margin-top: 20px; }
                        .footer { margin-top: 40px; font-size: 11px; text-align: center; color: #777; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="payslip-container">
                        <div class="header">
                            <h1>NAST COLLEGE</h1>
                            <p>Dhangadhi, Nepal | Monthly Salary Slip</p>
                        </div>
                        <div class="info-section">
                            <div>
                                <p><strong>Employee:</strong> ${data.employee.firstName} ${data.employee.lastName}</p>
                                <p><strong>Employee ID:</strong> ${data.employee.empId}</p>
                                <p><strong>Pay Period:</strong> ${data.payPeriodStart} - ${data.payPeriodEnd}</p>
                            </div>
                            <div style="text-align: right">
                                <p><strong>Payroll ID:</strong> #${data.payrollId}</p>
                                <p><strong>Pay Date:</strong> ${data.payDate || 'N/A'}</p>
                                <p><strong>Bank Account:</strong> ${data.paymentAccount ? data.paymentAccount.accountNumber : 'N/A'}</p>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Earnings Component</th><th class="text-right">Amount</th>
                                    <th>Deductions Component</th><th class="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Basic Gross Salary</td><td class="text-right">Rs. ${data.grossSalary.toLocaleString()}</td>
                                    <td>TDS / Income Tax</td><td class="text-right">Rs. ${data.totalTax.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Total Allowances</td><td class="text-right">Rs. ${data.totalAllowances.toLocaleString()}</td>
                                    <td>Other Deductions</td><td class="text-right">Rs. ${data.totalDeductions.toLocaleString()}</td>
                                </tr>
                                <tr style="background:#f1f3f4; font-weight:bold;">
                                    <td>Total Earnings (A)</td><td class="text-right">Rs. ${totalEarnings.toLocaleString()}</td>
                                    <td>Total Deductions (B)</td><td class="text-right">Rs. ${totalDeductions.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="net-box">
                            <div style="font-size: 14px;">NET PAYABLE (A - B)</div>
                            <h2 style="margin: 5px 0 0 0;">Rs. ${data.netSalary.toLocaleString()}</h2>
                        </div>
                        <div class="footer">
                            <p>This is a system-generated document and does not require a physical signature.</p>
                            <p>Generated on ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                    <div class="no-print" style="text-align:center; margin-top:20px;">
                        <button onclick="window.print()" style="padding:10px 20px; background:#1a73e8; color:white; border:none; border-radius:5px; cursor:pointer;">Print Now</button>
                    </div>
                </body>
            </html>
        `);
        win.document.close();
    };
>>>>>>> fc55ff3ba7b6ff9a8ac64d4f52d01c775e678fcc

  const generateProfessionalPayslip = async (data) => {
    // Save "Viewed" action to system
    await logAction(data.payrollId, "PAYSLIP_VIEWED", `${data.employee.firstName} ${data.employee.lastName}`);

<<<<<<< HEAD
    let components = [];
    try {
      const res = await api.get(`/employee-salary-components/employee/${data.employee.empId}`);
      components = res.data;
    } catch (err) {
      console.warn("Using summary data.");
    }

    const win = window.open("", "_blank");
    
    // Formatting data for the template
    const bankName = data.employee.bankAccounts?.[0]?.bankName || "Global IME Bank";
    const accNo = data.employee.bankAccounts?.[0]?.accountNumber || "112233445566";

    const earnings = components.filter(c => c.salaryComponent.componentType.name.toLowerCase() === 'allowance');
    const deductions = components.filter(c => c.salaryComponent.componentType.name.toLowerCase() === 'deduction');

    win.document.write(`
      <html>
        <head>
          <title>Enterprise Payslip - ${data.employee.firstName}</title>
          <style>
            body { font-family: 'Inter', sans-serif; color: #1a1f36; padding: 40px; line-height: 1.6; background: #f4f7fa; }
            .payslip-wrapper { max-width: 850px; margin: auto; background: white; padding: 50px; border-radius: 12px; border: 1px solid #e3e8ee; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { display: flex; justify-content: space-between; border-bottom: 4px solid #0052cc; padding-bottom: 20px; margin-bottom: 30px; }
            .brand h1 { color: #0052cc; margin: 0; font-size: 30px; }
            .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; background: #f8f9fc; padding: 25px; border-radius: 8px; margin-bottom: 30px; }
            .info-item label { display: block; font-size: 10px; font-weight: 800; color: #8792a2; text-transform: uppercase; margin-bottom: 5px; }
            .info-item span { font-size: 14px; font-weight: 600; }
            .salary-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .salary-table th { background: #0052cc; color: white; padding: 12px; text-align: left; font-size: 11px; }
            .salary-table td { padding: 12px; border: 1px solid #e3e8ee; font-size: 13px; }
            .amt { text-align: right; font-weight: bold; }
            .net-box { background: #0052cc; color: white; padding: 30px; border-radius: 8px; margin-top: 30px; display: flex; justify-content: space-between; align-items: center; }
            .net-val { font-size: 34px; font-weight: 800; margin: 0; }
            @media print { .no-print { display: none; } body { background: white; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="payslip-wrapper">
            <div class="header">
              <div class="brand"><h1>NAST COLLEGE</h1><p>Dhangadhi, Nepal | Monthly Salary Slip</p></div>
              <div class="meta"><h3>#PAY-${data.payrollId}</h3><p>Pay Date: ${new Date().toLocaleDateString()}</p></div>
            </div>
            <div class="info-grid">
              <div class="info-item"><label>Employee</label><span>${data.employee.firstName} ${data.employee.lastName}</span></div>
              <div class="info-item"><label>Employee ID</label><span>#${data.employee.empId}</span></div>
              <div class="info-item"><label>Department</label><span>${data.employee.department?.name || 'Administration'}</span></div>
              <div class="info-item"><label>Grade</label><span>${data.employee.salaryGrade?.gradeName || 'N/A'}</span></div>
              <div class="info-item"><label>Bank</label><span>${bankName}</span></div>
              <div class="info-item"><label>Account No</label><span>${accNo}</span></div>
=======
    return (
        <div className="payroll-container">
            <div className="payroll-header-section">
                <h2>Payroll Command Center</h2>
                <input 
                    className="search-bar" 
                    placeholder="Search by Name or Employee ID..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="payroll-card">
                <table className="payroll-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Basic Gross</th>
                            <th>Allowances</th>
                            <th>Tax (TDS)</th>
                            <th>Deductions</th>
                            <th>Net Payable</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p.payrollId}>
                                <td>
                                    <span className="emp-name">{p.employee.firstName} {p.employee.lastName}</span>
                                    <span className="emp-id">ID: {p.employee.empId}</span>
                                </td>
                                <td>Rs. {p.grossSalary.toLocaleString()}</td>
                                <td style={{color: '#2dce89'}}>+ Rs. {p.totalAllowances.toLocaleString()}</td>
                                <td style={{color: '#f5365c'}}>- Rs. {p.totalTax.toLocaleString()}</td>
                                <td style={{color: '#f5365c'}}>- Rs. {p.totalDeductions.toLocaleString()}</td>
                                <td><span className="amount-net">Rs. {p.netSalary.toLocaleString()}</span></td>
                                <td className="actions-cell">
                                    <button className="btn-icon btn-pdf" onClick={() => generatePDFView(p)}>View PDF</button>
                                    <button className="btn-icon btn-email" onClick={() => handleEmailDispatch(p.payrollId)}>Email</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
>>>>>>> fc55ff3ba7b6ff9a8ac64d4f52d01c775e678fcc
            </div>
            <table class="salary-table">
              <thead>
                <tr><th>Earnings</th><th class="amt">Amount</th><th>Deductions</th><th class="amt">Amount</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Salary</td><td class="amt">Rs. ${data.grossSalary.toLocaleString()}</td>
                  <td>Tax (TDS)</td><td class="amt">Rs. ${data.totalTax.toLocaleString()}</td>
                </tr>
                ${Array.from({ length: Math.max(earnings.length, deductions.length) }).map((_, i) => `
                  <tr>
                    <td>${earnings[i] ? earnings[i].salaryComponent.componentName : '-'}</td>
                    <td class="amt">${earnings[i] ? 'Rs. ' + earnings[i].value.toLocaleString() : ''}</td>
                    <td>${deductions[i] ? deductions[i].salaryComponent.componentName : '-'}</td>
                    <td class="amt">${deductions[i] ? 'Rs. ' + deductions[i].value.toLocaleString() : ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="net-box">
              <div><small>TOTAL NET DISBURSEMENT</small><h2 class="net-val">Rs. ${data.netSalary.toLocaleString()}</h2></div>
              <div style="text-align:right"><strong>Status: PAID</strong></div>
            </div>
            <div class="no-print" style="margin-top:20px; text-align:center;">
              <button onclick="window.print()" style="padding:12px 30px; background:#0052cc; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Print Payslip</button>
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="payroll-container">
      <div className="payroll-header">
        <div className="header-title">
          <h2>Payroll Management</h2>
          <p>Manage and disburse employee salaries</p>
        </div>
        <input
          type="text" 
          className="search-input" 
          placeholder="Search employees..." 
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-card">
        <table className="main-payroll-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Grade</th>
              <th>Gross</th>
              <th>Deductions</th>
              <th>Net Payable</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.filter(p => `${p.employee.firstName} ${p.employee.lastName}`.toLowerCase().includes(search.toLowerCase())).map(p => (
              <tr key={p.payrollId}>
                <td>
                  <div className="emp-primary">{p.employee.firstName} {p.employee.lastName}</div>
                  <div className="emp-secondary">ID: {p.employee.empId}</div>
                </td>
                <td><span className="grade-badge">{p.employee.salaryGrade?.gradeName || "N/A"}</span></td>
                <td>Rs. {p.grossSalary.toLocaleString()}</td>
                <td className="deduction-text">-Rs. {(p.totalTax + p.totalDeductions).toLocaleString()}</td>
                <td className="net-text">Rs. {p.netSalary.toLocaleString()}</td>
                <td>
                  <button className="action-btn view" onClick={() => generateProfessionalPayslip(p)}>View</button>
                  {/* --- FIXED: Added onClick handler here --- */}
                  <button className="action-btn email" onClick={() => handleEmailDispatch(p)}>Email</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollManagement;