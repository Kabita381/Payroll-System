import React, { useEffect, useState } from "react";
import api from "../../../api/axios"; // centralized axios instance
import ConfirmModal from "../../../components/ConfirmModal";
import "./PayrollConfig.css";

function MessageModal({ show, type, message, onClose }) {
  if (!show) return null;
  return (
    <div className="message-modal-backdrop">
      <div className={`message-modal ${type}`}>
        <p>{message}</p>
        <button onClick={onClose}>Dismiss</button>
      </div>
    </div>
  );
}

export default function SalaryGrade() {
  const [grades, setGrades] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState({ gradeName: "", description: "" });
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [messageData, setMessageData] = useState({ show: false, type: "", message: "" });

  const API_URL = "/salary-grades";

  const showMessage = (type, message) => setMessageData({ show: true, type, message });
  const closeMessage = () => setMessageData({ show: false, type: "", message: "" });

  useEffect(() => { fetchGrades(); }, []);

  const fetchGrades = async () => {
    try {
      const res = await api.get(API_URL);
      setGrades(Array.isArray(res.data) ? res.data : []);
    } catch {
      showMessage("error", "Failed to fetch salary grades");
    }
  };

  const startEdit = (g) => {
    setEditingId(g.gradeId);
    setAddingNew(false);
    setFormData({ gradeName: g.gradeName, description: g.description });
  };

  const cancel = () => {
    setEditingId(null);
    setAddingNew(false);
    setFormData({ gradeName: "", description: "" });
  };

  const saveEdit = async (id) => {
    if (!formData.gradeName.trim()) {
      showMessage("error", "Grade name is required");
      return;
    }
    try {
      if (addingNew) {
        await api.post(API_URL, formData);
        showMessage("success", "Salary grade created!");
      } else {
        await api.put(`${API_URL}/${id}`, formData);
        showMessage("success", "Salary grade updated!");
      }
      fetchGrades();
      cancel();
    } catch {
      showMessage("error", "Save failed. Ensure grade name is valid.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${API_URL}/${deleteId}`);
      showMessage("success", "Salary grade deleted!");
      fetchGrades();
    } catch {
      showMessage("error", "Cannot delete: grade may be in use");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="org-section payroll-theme-alt">
      <MessageModal {...messageData} onClose={closeMessage} />

      <div className="section-header">
        <h3>Salary Grades</h3>
        <button className="add-btn" onClick={() => { setAddingNew(true); setEditingId(null); setFormData({ gradeName: "", description: "" }); }}>
          + Add Grade
        </button>
      </div>

      <div className="table-wrapper">
        <table className="org-table">
          <thead>
            <tr>
              <th style={{ width: '12%' }}>ID</th>
              <th style={{ width: '30%' }}>Grade Name</th>
              <th>Description</th>
              <th style={{ textAlign: 'center', width: '25%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {addingNew && (
              <tr className="adding-row">
                <td className="read-only-id">New</td>
                <td><input autoFocus value={formData.gradeName} onChange={e => setFormData({...formData, gradeName: e.target.value})} placeholder="e.g. Grade A" /></td>
                <td><input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description" /></td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-small save" onClick={() => saveEdit(null)}>Save</button>
                  <button className="btn-small cancel" onClick={cancel}>Cancel</button>
                </td>
              </tr>
            )}

            {grades.map(g => (
              <tr key={g.gradeId}>
                <td className="read-only-id">{g.gradeId}</td>
                <td>{editingId === g.gradeId ? <input value={formData.gradeName} onChange={e => setFormData({...formData, gradeName: e.target.value})} /> : g.gradeName}</td>
                <td>{editingId === g.gradeId ? <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /> : g.description}</td>
                <td style={{ textAlign: 'center' }}>
                  {editingId === g.gradeId ? (
                    <>
                      <button className="btn-small save" onClick={() => saveEdit(g.gradeId)}>Save</button>
                      <button className="btn-small cancel" onClick={cancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-small update" onClick={() => startEdit(g)}>Edit</button>
                      <button className="btn-small delete" onClick={() => { setDeleteId(g.gradeId); setShowConfirm(true); }}>Delete</button>
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
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        message="Delete this salary grade?"
      />
    </div>
  );
}
