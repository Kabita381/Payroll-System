import React, { useEffect, useState } from "react";
import api from "../../../api/axios"; // centralized axios
import ConfirmModal from "../../../components/ConfirmModal";
import "./PayrollConfig.css";

export default function GradeSalaryComponent() {
  const [data, setData] = useState([]);
  const [grades, setGrades] = useState([]);
  const [components, setComponents] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);

  const [formData, setFormData] = useState({
    grade: { gradeId: "" },
    component: { componentId: "" },
    value: 0
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [messageData, setMessageData] = useState({ show: false, type: "", message: "" });

  const API_URL = "/grade-salary-components";

  useEffect(() => {
    fetchMainData();
    fetchDropdowns();
  }, []);

  const fetchMainData = async () => {
    try {
      const res = await api.get(API_URL);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showMessage("error", "Failed to fetch assignments or permission denied");
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [gRes, cRes] = await Promise.all([
        api.get("/salary-grades"),
        api.get("/salary-components")
      ]);
      setGrades(Array.isArray(gRes.data) ? gRes.data : []);
      setComponents(Array.isArray(cRes.data) ? cRes.data : []);
    } catch (err) {
      showMessage("error", "Failed to fetch grades or components");
    }
  };

  const showMessage = (type, message) => setMessageData({ show: true, type, message });
  const closeMessage = () => setMessageData({ show: false, type: "", message: "" });

  const startEdit = (item) => {
    setEditingId(item.gscId);
    setAddingNew(false);
    setFormData({
      grade: { gradeId: item.grade.gradeId },
      component: { componentId: item.component.componentId },
      value: item.value
    });
  };

  const cancel = () => {
    setEditingId(null);
    setAddingNew(false);
    setFormData({ grade: { gradeId: "" }, component: { componentId: "" }, value: 0 });
  };

  const saveAction = async (id) => {
    if (!formData.grade.gradeId || !formData.component.componentId) {
      showMessage("error", "Please select grade and component");
      return;
    }
    try {
      if (addingNew) {
        await api.post(API_URL, formData);
        showMessage("success", "Assignment Created!");
      } else {
        await api.put(`${API_URL}/${id}`, formData);
        showMessage("success", "Assignment Updated!");
      }
      fetchMainData();
      cancel();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Save failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`${API_URL}/${deleteId}`);
      showMessage("success", "Assignment Removed!");
      fetchMainData();
    } catch {
      showMessage("error", "Cannot delete: might be in use or permission denied");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="org-section payroll-theme-main full-width-table">
      <div className="section-header">
        <h3>Grade Salary Assignments</h3>
        <button className="add-btn" onClick={() => { setAddingNew(true); setEditingId(null); }}>
          + Assign Component
        </button>
      </div>

      <div className="table-wrapper">
        <table className="org-table">
          <thead>
            <tr>
              <th style={{ width: '8%' }}>ID</th>
              <th>Grade</th>
              <th>Component</th>
              <th>Value</th>
              <th style={{ textAlign: 'center', width: '20%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Adding Row */}
            {addingNew && (
              <tr className="adding-row">
                <td className="read-only-id">New</td>
                <td>
                  <select value={formData.grade.gradeId} onChange={e => setFormData({ ...formData, grade: { gradeId: e.target.value } })}>
                    <option value="">Select Grade</option>
                    {grades.map(g => <option key={g.gradeId} value={g.gradeId}>{g.gradeName}</option>)}
                  </select>
                </td>
                <td>
                  <select value={formData.component.componentId} onChange={e => setFormData({ ...formData, component: { componentId: e.target.value } })}>
                    <option value="">Select Component</option>
                    {components.map(c => <option key={c.componentId} value={c.componentId}>{c.componentName}</option>)}
                  </select>
                </td>
                <td>
                  <input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
                </td>
                <td>
                  <button className="btn-small save" onClick={() => saveAction(null)}>Save</button>
                  <button className="btn-small cancel" onClick={cancel}>Cancel</button>
                </td>
              </tr>
            )}

            {/* Existing Rows */}
            {Array.isArray(data) && data.map(item => (
              <tr key={item.gscId}>
                <td className="read-only-id">{item.gscId}</td>
                <td>
                  {editingId === item.gscId ? (
                    <select value={formData.grade.gradeId} onChange={e => setFormData({ ...formData, grade: { gradeId: e.target.value } })}>
                      {grades.map(g => <option key={g.gradeId} value={g.gradeId}>{g.gradeName}</option>)}
                    </select>
                  ) : item.grade.gradeName}
                </td>
                <td>
                  {editingId === item.gscId ? (
                    <select value={formData.component.componentId} onChange={e => setFormData({ ...formData, component: { componentId: e.target.value } })}>
                      {components.map(c => <option key={c.componentId} value={c.componentId}>{c.componentName}</option>)}
                    </select>
                  ) : item.component.componentName}
                </td>
                <td>
                  {editingId === item.gscId ? (
                    <input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
                  ) : <strong>{item.value}</strong>}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {editingId === item.gscId ? (
                    <>
                      <button className="btn-small save" onClick={() => saveAction(item.gscId)}>Save</button>
                      <button className="btn-small cancel" onClick={cancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-small update" onClick={() => startEdit(item)}>Edit</button>
                      <button className="btn-small delete" onClick={() => { setDeleteId(item.gscId); setShowConfirm(true); }}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={showConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
        message="Remove this salary assignment?"
      />
    </div>
  );
}
