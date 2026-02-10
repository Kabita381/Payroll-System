import React, { useEffect, useState } from "react";
import api from "../../../api/axios"; 
import ConfirmModal from "../../../components/ConfirmModal";
import "./PayrollConfig.css";

export default function EmployeeSalaryComponents() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Updated API path based on your Backend Entity
  const ESC_API = "/employee-salary-components";

  useEffect(() => {
    fetchEmployeeComponents();
  }, []);

  const fetchEmployeeComponents = async () => {
    try {
      const res = await api.get(ESC_API);
      setComponents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching employee specific salary components", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${ESC_API}/${deleteId}`);
      fetchEmployeeComponents();
      setShowConfirm(false);
    } catch {
      alert("Delete failed. This record might be linked to processed payroll.");
      setShowConfirm(false);
    }
  };

  if (loading) return <div className="loader">Loading Employee Pay Components...</div>;

  return (
    <div className="org-section payroll-theme-alt column-full">
      <div className="section-header">
        <h3>Individual Employee Pay Structure</h3>
        <button className="add-btn">
          + Assign New Component
        </button>
      </div>

      <div className="table-wrapper">
        <table className="org-table">
          <thead>
            <tr>
              {/* Changed Column Names as requested */}
              <th>ESC ID</th>
              <th>Employee Name</th>
              <th>Pay Component</th>
              <th>Assigned Value</th>
              <th>Status</th>
              <th>Effective From</th>
              <th>Effective To</th>
              <th style={{ textAlign: "center", width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {components.length > 0 ? (
              components.map((c) => (
                <tr key={c.escId}>
                  <td>{c.escId}</td>
                  <td>
                    <strong>{c.employee?.firstName} {c.employee?.lastName}</strong>
                    <br />
                    <small style={{ color: '#666' }}>ID: {c.employee?.empId}</small>
                  </td>
                  <td>{c.salaryComponent?.componentName}</td>
                  <td className="time-cell" style={{ color: '#2d3748' }}>
                    {c.value?.toLocaleString()}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {c.isActive ? (
                      <span className="status-badge present">Active</span>
                    ) : (
                      <span className="status-badge absent">Inactive</span>
                    )}
                  </td>
                  <td>{c.effectiveFrom}</td>
                  <td>{c.effectiveTo || "Present"}</td>
                  <td style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button className="btn-small update">
                        Edit
                      </button>
                      <button
                        className="btn-small delete"
                        onClick={() => {
                          setDeleteId(c.escId);
                          setShowConfirm(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">No specific employee salary components found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={showConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        message="Are you sure you want to remove this salary component from this employee?"
      />
    </div>
  );
}