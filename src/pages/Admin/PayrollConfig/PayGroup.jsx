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

export default function PayGroup() {
  const [payGroups, setPayGroups] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState({ name: "", frequency: "Monthly", nextRunDate: "" });
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [messageData, setMessageData] = useState({ show: false, type: "", message: "" });

  const API_URL = "/paygroups";

  useEffect(() => { fetchGroups(); }, []);

  const showMessage = (type, message) => setMessageData({ show: true, type, message });
  const closeMessage = () => setMessageData({ show: false, type: "", message: "" });

  const fetchGroups = async () => {
    try {
      const res = await api.get(API_URL);
      setPayGroups(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showMessage("error", "Failed to fetch Pay Groups");
    }
  };

  const startEdit = (p) => {
    setEditingId(p.payGroupId);
    setAddingNew(false);
    setFormData({ name: p.name, frequency: p.frequency, nextRunDate: p.nextRunDate });
  };

  const cancel = () => {
    setEditingId(null);
    setAddingNew(false);
    setFormData({ name: "", frequency: "Monthly", nextRunDate: "" });
  };

  const saveEdit = async (id) => {
    if (!formData.name || !formData.nextRunDate) {
      showMessage("error", "Group name and Next Run Date are required");
      return;
    }
    try {
      if (addingNew) {
        await api.post(API_URL, formData);
        showMessage("success", "Pay Group Created!");
      } else {
        await api.put(`${API_URL}/${id}`, formData);
        showMessage("success", "Pay Group Updated!");
      }
      fetchGroups();
      cancel();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Save failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`${API_URL}/${deleteId}`);
      showMessage("success", "Pay Group Deleted!");
      fetchGroups();
    } catch {
      showMessage("error", "Cannot delete: Pay Group may be in use");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="org-section leave-theme">
      <MessageModal {...messageData} onClose={closeMessage} />

      <div className="section-header">
        <h3>Pay Groups</h3>
        <button className="add-btn" onClick={() => { setAddingNew(true); setEditingId(null); setFormData({ name: "", frequency: "Monthly", nextRunDate: "" }); }}>
          + Add Group
        </button>
      </div>

      <div className="table-wrapper">
        <table className="org-table">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>ID</th>
              <th>Group Name</th>
              <th>Frequency</th>
              <th>Next Run</th>
              <th style={{ textAlign: 'center', width: '25%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(addingNew || editingId) && (
              <tr className="editing-row">
                <td className="read-only-id">{editingId || "New"}</td>
                <td>
                  <input autoFocus value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Staff" />
                </td>
                <td>
                  <select value={formData.frequency} onChange={e => setFormData({ ...formData, frequency: e.target.value })}>
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Biweekly">Biweekly</option>
                  </select>
                </td>
                <td>
                  <input type="date" value={formData.nextRunDate} onChange={e => setFormData({ ...formData, nextRunDate: e.target.value })} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-small save" onClick={() => saveEdit(editingId)}>Save</button>
                  <button className="btn-small cancel" onClick={cancel}>Cancel</button>
                </td>
              </tr>
            )}

            {payGroups.map(p => (
              editingId !== p.payGroupId && (
                <tr key={p.payGroupId}>
                  <td className="read-only-id">{p.payGroupId}</td>
                  <td>{p.name}</td>
                  <td><span className="type-badge">{p.frequency}</span></td>
                  <td>{p.nextRunDate}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn-small update" onClick={() => startEdit(p)}>Edit</button>
                    <button className="btn-small delete" onClick={() => { setDeleteId(p.payGroupId); setShowConfirm(true); }}>Delete</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={showConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
        message="Are you sure? Deleting a Pay Group can affect employee payroll processing."
      />
    </div>
  );
}
