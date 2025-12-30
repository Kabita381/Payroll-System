import React, { useEffect, useState } from "react";
import api from "../../../api/axios"; // Updated import
import ConfirmModal from "../../../components/ConfirmModal";

export default function DeductionHeads() {
  const [heads, setHeads] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    defaultRate: 0,
    isPercentage: true,
    statutory: true,
    description: ""
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchHeads();
  }, []);

  // Fetch all deduction heads
  const fetchHeads = async () => {
    try {
      const res = await api.get("/deduction-heads");
      setHeads(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch failed:", err.response?.data || err.message);
    }
  };

  // Save (create or update) deduction head
  const saveAction = async (id) => {
    try {
      if (addingNew) {
        await api.post("/deduction-heads", formData);
      } else {
        await api.put(`/deduction-heads/${id}`, formData);
      }
      fetchHeads();
      cancel();
    } catch (err) {
      console.error("Save failed:", err.response?.data || err.message);
      alert("Save failed. Please check console for details.");
    }
  };

  // Cancel editing or adding
  const cancel = () => {
    setEditingId(null);
    setAddingNew(false);
    setFormData({
      name: "",
      defaultRate: 0,
      isPercentage: true,
      statutory: true,
      description: ""
    });
  };

  return (
    <div className="org-section statutory-theme">
      <div className="section-header">
        <h3>Deduction Heads</h3>
        <button
          className="add-btn"
          onClick={() => { setAddingNew(true); setEditingId(null); }}
        >
          + Add Head
        </button>
      </div>

      <div className="table-scroll-container">
        <table className="org-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Head Name</th>
              <th>Rate (%)</th>
              <th>Statutory</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* New or editing row */}
            {(addingNew || editingId) && (
              <tr className="editing-row">
                <td className="read-only-id">{editingId || "New"}</td>
                <td>
                  <input
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={formData.defaultRate}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultRate: e.target.value })
                    }
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isPercentage}
                      onChange={(e) =>
                        setFormData({ ...formData, isPercentage: e.target.checked })
                      }
                    />{" "}
                    Is %
                  </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={formData.statutory}
                    onChange={(e) =>
                      setFormData({ ...formData, statutory: e.target.checked })
                    }
                  />{" "}
                  Yes
                </td>
                <td>
                  <button
                    className="btn-small save"
                    onClick={() => saveAction(editingId)}
                  >
                    Save
                  </button>
                  <button className="btn-small cancel" onClick={cancel}>
                    Cancel
                  </button>
                </td>
              </tr>
            )}

            {/* Existing rows */}
            {heads.map((h) => (
              editingId !== h.deductionHeadId && (
                <tr key={h.deductionHeadId}>
                  <td className="read-only-id">{h.deductionHeadId}</td>
                  <td>
                    <strong>{h.name}</strong>
                    <br />
                    <small>{h.description}</small>
                  </td>
                  <td>{h.defaultRate}{h.isPercentage ? "%" : ""}</td>
                  <td>{h.statutory ? "Statutory" : "Optional"}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="btn-small update"
                      onClick={() => { setEditingId(h.deductionHeadId); setFormData(h); }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-small delete"
                      onClick={() => { setDeleteId(h.deductionHeadId); setShowConfirm(true); }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        show={showConfirm}
        onConfirm={async () => {
          try {
            await api.delete(`/deduction-heads/${deleteId}`);
            fetchHeads();
            setShowConfirm(false);
          } catch (err) {
            console.error("Delete failed:", err.response?.data || err.message);
            alert("Delete failed");
          }
        }}
        onCancel={() => setShowConfirm(false)}
        message="Delete deduction head?"
      />
    </div>
  );
}
