import React, { useEffect, useState } from "react";
import api from "../../../api/axios"; // centralized axios with JWT
import ConfirmModal from "../../../components/ConfirmModal";
import "./Designations.css";

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

export default function Designations() {
  const [designations, setDesignations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ designationTitle: "" });
  const [addingNew, setAddingNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [messageData, setMessageData] = useState({ show: false, type: "", message: "" });

  useEffect(() => { fetchDesignations(); }, []);

  const fetchDesignations = async () => {
    try {
      const res = await api.get("/designations");
      setDesignations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showMessage("error", "Failed to fetch designations. Permission denied or backend error.");
    }
  };

  const showMessage = (type, message) => setMessageData({ show: true, type, message });
  const closeMessage = () => setMessageData({ show: false, type: "", message: "" });

  const startEdit = (desg) => {
    setEditingId(desg.designationId);
    setAddingNew(false);
    setFormData({ designationTitle: desg.designationTitle });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setAddingNew(false);
    setFormData({ designationTitle: "" });
  };

  const saveEdit = async (id) => {
    if (!formData.designationTitle.trim()) {
      showMessage("error", "Designation title is required");
      return;
    }
    try {
      const payload = { designationTitle: formData.designationTitle };
      if (addingNew) {
        await api.post("/designations", payload);
        showMessage("success", "Designation Created!");
      } else {
        await api.put(`/designations/${id}`, payload);
        showMessage("success", "Designation Updated!");
      }
      fetchDesignations();
      cancelEdit();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Operation failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/designations/${deleteId}`);
      showMessage("success", "Deleted Successfully!");
      fetchDesignations();
    } catch {
      showMessage("error", "Cannot delete: record might be in use or permission denied");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="org-section desg-theme">
      <MessageModal {...messageData} onClose={closeMessage} />

      <div className="section-header">
        <h3>Designations</h3>
        <button className="add-btn" onClick={() => { setAddingNew(true); setEditingId(null); setFormData({ designationTitle: "" }); }}>
          + Add New Designation
        </button>
      </div>

      <div className="table-wrapper">
        <table className="org-table">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>ID</th>
              <th>Designation Title</th>
              <th style={{ textAlign: 'center', width: '25%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {addingNew && (
              <tr className="adding-row">
                <td>New</td>
                <td>
                  <input
                    autoFocus
                    value={formData.designationTitle}
                    onChange={(e) => setFormData({ designationTitle: e.target.value })}
                    placeholder="Enter title..."
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-small save" onClick={() => saveEdit(null)}>Save</button>
                  <button className="btn-small cancel" onClick={cancelEdit}>Cancel</button>
                </td>
              </tr>
            )}
            {Array.isArray(designations) && designations.map((desg) => (
              <tr key={desg.designationId}>
                <td>{desg.designationId}</td>
                <td>
                  {editingId === desg.designationId ? (
                    <input
                      value={formData.designationTitle}
                      onChange={(e) => setFormData({ designationTitle: e.target.value })}
                    />
                  ) : (
                    desg.designationTitle
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {editingId === desg.designationId ? (
                    <>
                      <button className="btn-small save" onClick={() => saveEdit(desg.designationId)}>Save</button>
                      <button className="btn-small cancel" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-small update" onClick={() => startEdit(desg)}>Update</button>
                      <button className="btn-small delete" onClick={() => { setDeleteId(desg.designationId); setShowConfirm(true); }}>Delete</button>
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
        message="Are you sure you want to delete this designation?"
      />
    </div>
  );
}
