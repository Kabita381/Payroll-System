import React from "react";
import "./Report.css";

const Report = () => {
  // Sample payroll data
  const payrollData = [
    { id: "21075050", name: "Anil Bhul", status: "Married", basic: 60000, allow: 10000, pf: 6000, cit: 2000 },
    { id: "21075054", name: "Bharat Gurdhami", status: "Single", basic: 55000, allow: 8000, pf: 5500, cit: 1800 },
    { id: "21075071", name: "Kabita Dhakal", status: "Single", basic: 58000, allow: 9000, pf: 5800, cit: 1900 },
    { id: "21075081", name: "Salina Bishwakarma", status: "Married", basic: 62000, allow: 11000, pf: 6200, cit: 2100 },
  ];

  // Tax calculation function
  const calculateTax = (emp) => {
    const gross = emp.basic + emp.allow;
    const taxableAnnual = (gross - (emp.pf + emp.cit)) * 12;
    const threshold = emp.status === "Married" ? 600000 : 500000;

    // Nepal tax logic: 1% SS Tax on first slab
    let tax = threshold * 0.01;
    if (taxableAnnual > threshold) {
      tax += (taxableAnnual - threshold) * 0.1; // 10% tax on excess
    }

    return {
      gross,
      tax: tax.toFixed(2),
      net: (gross - emp.pf - emp.cit - tax).toFixed(2),
    };
  };

  return (
    <div className="report-container">
      <h2>Payroll Report</h2>
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Gross Salary</th>
            <th>Tax</th>
            <th>Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {payrollData.map((emp) => {
            const { gross, tax, net } = calculateTax(emp);
            return (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.status}</td>
                <td>{gross}</td>
                <td>{tax}</td>
                <td>{net}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
