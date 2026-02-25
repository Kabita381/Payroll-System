import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, createUser, updateUser } from "../../api/userApi";
import { getRoles } from "../../api/roleApi"; 
import { FaInfoCircle } from "react-icons/fa"; 
import "./AddUser.css"; 

export default function AddUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: { roleId: "" }, 
    status: "ACTIVE"
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const rolesData = await getRoles();
      const finalRoles = Array.isArray(rolesData) ? rolesData : rolesData.data || [];
      setRoles(finalRoles);

      if (isEditMode) {
        const userRes = await getUserById(id);
        const u = userRes.data ? userRes.data : userRes;
        if (u) {
          setFormData({
            username: u.username || "",
            email: u.email || "",
            role: { roleId: u.role?.roleId || u.roleId || "" },
            status: u.status || "ACTIVE"
          });
        }
      }
    } catch (err) {
      console.error("Init error:", err);
      setStatusMsg({ type: "error", text: "Failed to load roles." });
    } finally {
      setLoading(false);
    }
  }, [id, isEditMode]);

  useEffect(() => { loadInitialData(); }, [loadInitialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "roleId") {
      setFormData(prev => ({ ...prev, role: { roleId: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        status: formData.status,
        role: { roleId: parseInt(formData.role.roleId) }
      };

      if (isEditMode) {
        await updateUser(id, payload);
        setStatusMsg({ type: "success", text: "User account updated successfully!" });
      } else {
        await createUser(payload);
        setStatusMsg({ 
          type: "success", 
          text: "User created! Default credentials have been sent to their email." 
        });
      }
      
      setTimeout(() => navigate("/admin/users"), 2000);

    } catch (err) {
      console.error("Submit error:", err);
      const errorDetail = err.response?.data?.message || "Check your network connection.";
      setStatusMsg({ type: "error", text: errorDetail });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-canvas">
      <header className="page-header">
        <h3>{isEditMode ? "Edit User Account" : "Register New User"}</h3>
      </header>

      {statusMsg.text && (
        <div className={`status-box ${statusMsg.type}`}>{statusMsg.text}</div>
      )}

      <div className="form-card-container">
        {/* Help text only for creation */}
        {!isEditMode && (
          <div className="info-alert">
            <FaInfoCircle />
            <span>The system will generate a secure password and email it to the user.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Username</label>
              <input 
                name="username" 
                placeholder="e.g. jdoe123"
                value={formData.username} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="user@example.com"
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Organizational Role</label>
              <select name="roleId" value={formData.role.roleId} onChange={handleChange} required>
                <option value="">-- Select Role --</option>
                {roles.map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Account Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="details-btn" onClick={() => navigate("/admin/users")}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="primary-btn">
              {loading ? "Saving..." : (isEditMode ? "Save Changes" : "Create User")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}