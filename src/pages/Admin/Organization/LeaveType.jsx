import React, { useEffect, useState } from "react";
import api from "../../../api/axios"; // centralized axios with JWT
import ConfirmModal from "../../../components/ConfirmModal";
import "./LeaveType.css";

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

export default function LeaveType() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState({ typeName: "", defaultDaysPerYear: "", paid: true });

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [messageData, setMessageData] = useState({ show: false, type: "", message: "" });

  useEffect(() => { fetchLeaveTypes(); }, []);

  const fetchLeaveTypes = async () => {
    try {
      const res = await api.get("/leave-types");
      setLeaveTypes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showMessage("error", "Failed to fetch leave types. Permission denied or backend error.");
    }
  };

  const showMessage = (type, message) => setMessageData({ show: true, type, message });
  const closeMessage = () => setMessageData({ show: false, type: "", message: "" });

  const startEdit = (lt) => {
    setEditingId(lt.leaveTypeId);
    setAddingNew(false);
    setFormData({ typeName: lt.typeName, defaultDaysPerYear: lt.defaultDaysPerYear, paid: lt.paid });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setAddingNew(false);
    setFormData({ typeName: "", defaultDaysPerYear: "", paid: true });
  };

  const saveEdit = async (id) => {
    if (!formData.typeName.trim() || !formData.defaultDaysPerYear) {
      showMessage("error", "Name and Days are required");
      return;
    }
    try {
      if (addingNew) {
        await api.post("/leave-types", formData);
        showMessage("success", "Leave Type Created!");
      } else {
        await api.put(`/leave-types/${id}`, formData);
        showMessage("success", "Leave Type Updated!");
      }
      fetchLeaveTypes();
      cancelEdit();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Action failed");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/leave-types/${deleteId}`);
      showMessage("success", "Leave Type Deleted!");
      fetchLeaveTypes();
    } catch {
      showMessage("error", "Cannot delete: Leave Type might be in use or permission denied");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="org-section leave-theme">
      <MessageModal {...messageData} onClose={closeMessage} />

      <div className="section-header">
        <h3>Leave Types</h3>
        <button className="add-btn" onClick={() => { setAddingNew(true); setEditingId(null); setFormData({ typeName: "", defaultDaysPerYear: "", paid: true }); }}>
          + Add Type
        </button>
      </div>

      <div className="table-wrapper">
        <table className="org-table">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>ID</th>
              <th>Name</th>
              <th style={{ width: '15%' }}>Days</th>
              <th style={{ width: '15%' }}>Paid</th>
              <th style={{ textAlign: 'center', width: '25%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {addingNew && (
              <tr className="adding-row">
                <td className="read-only-id">New</td>
                <td>
                  <input
                    autoFocus
                    value={formData.typeName}
                    onChange={e => setFormData({ ...formData, typeName: e.target.value })}
                    placeholder="E.g. Sick Leave"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={formData.defaultDaysPerYear}
                    onChange={e => setFormData({ ...formData, defaultDaysPerYear: e.target.value })}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={formData.paid}
                    onChange={e => setFormData({ ...formData, paid: e.target.checked })}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-small save" onClick={() => saveEdit(null)}>Save</button>
                  <button className="btn-small cancel" onClick={cancelEdit}>Cancel</button>
                </td>
              </tr>
            )}
            {Array.isArray(leaveTypes) && leaveTypes.map((lt) => (
              <tr key={lt.leaveTypeId}>
                <td className="read-only-id">{lt.leaveTypeId}</td>
                <td>
                  {editingId === lt.leaveTypeId ? (
                    <input
                      value={formData.typeName}
                      onChange={e => setFormData({ ...formData, typeName: e.target.value })}
                    />
                  ) : (
                    lt.typeName
                  )}
                </td>
                <td>
                  {editingId === lt.leaveTypeId ? (
                    <input
                      type="number"
                      value={formData.defaultDaysPerYear}
                      onChange={e => setFormData({ ...formData, defaultDaysPerYear: e.target.value })}
                    />
                  ) : (
                    lt.defaultDaysPerYear
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {editingId === lt.leaveTypeId ? (
                    <input
                      type="checkbox"
                      checked={formData.paid}
                      onChange={e => setFormData({ ...formData, paid: e.target.checked })}
                    />
                  ) : (
                    lt.paid ? "✅" : "❌"
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {editingId === lt.leaveTypeId ? (
                    <>
                      <button className="btn-small save" onClick={() => saveEdit(lt.leaveTypeId)}>Save</button>
                      <button className="btn-small cancel" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-small update" onClick={() => startEdit(lt)}>Update</button>
                      <button className="btn-small delete" onClick={() => { setDeleteId(lt.leaveTypeId); setShowConfirm(true); }}>Delete</button>
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
        message="Are you sure you want to delete this leave type?"
      />
    </div>
  );
}
