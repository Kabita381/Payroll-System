import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getActiveEmployeeStats,
} from "../../api/employeeApi";
import { getDepartments } from "../../api/departmentApi";
import { getDesignations } from "../../api/designationApi";
import ConfirmModal from "../../components/ConfirmModal";
import "./Employees.css";

// MessageModal Component
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

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [addingNew, setAddingNew] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [activeStats, setActiveStats] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [messageData, setMessageData] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchDesignations();
    fetchActiveStats();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data || []);
    } catch (err) {
      showMessage("error", "Failed to fetch employees");
    }
  };

  const fetchDepartments = async () => {
    try {
      const depts = await getDepartments();
      setDepartments(depts);
    } catch (err) {
      showMessage("error", "Failed to fetch departments");
    }
  };

  const fetchDesignations = async () => {
    try {
      const desigs = await getDesignations();
      setDesignations(desigs);
    } catch (err) {
      showMessage("error", "Failed to fetch designations");
    }
  };

  const fetchActiveStats = async () => {
    try {
      const res = await getActiveEmployeeStats();
      setActiveStats(res.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  const showMessage = (type, message) => {
    setMessageData({ show: true, type, message });
  };

  const closeMessage = () => {
    setMessageData({ show: false, type: "", message: "" });
  };

const handleSearch = async () => {
  if (!searchId) return fetchEmployees();

  try {
    const res = await getEmployees(searchId);

    if (!res.data) {
      setEmployees([]);
      showMessage("error", `Employee with ID ${searchId} not found`);
    } else {
      setEmployees([res.data]);
    }
  } catch (err) {
    setEmployees([]);

    // Extract backend message
    let errorMsg = "An error occurred while searching";
    if (err.response && err.response.data && err.response.data.message) {
      errorMsg = err.response.data.message; // Should be "Employee not found with id: X"
    } else if (err.message) {
      errorMsg = err.message;
    }

    showMessage("error", errorMsg);
  }
};


  const startEdit = (emp) => {
    setEditingId(emp.empId);
    setAddingNew(false); // Close add row if open
    setFormData({
      ...emp,
      deptId: emp.department?.deptId,
      designationId: emp.position?.designationId,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setAddingNew(false);
    setFormData({});
    fetchEmployees(); // Reload DB data
  };

  const saveEdit = async (id) => {
    try {
      const payload = {
        ...formData,
        department: { deptId: formData.deptId },
        position: { designationId: formData.designationId },
      };

      if (addingNew) {
        await createEmployee(payload);
        showMessage("success", "Employee successfully created!");
      } else {
        await updateEmployee(id, payload);
        showMessage("success", "Employee successfully updated!");
      }

      fetchEmployees();
      fetchActiveStats();
      setAddingNew(false);
      setEditingId(null);
      setFormData({});
    } catch (err) {
      console.error(err);
      showMessage("error", "An error occurred. Please try again.");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteEmployee(deleteId);
      showMessage("success", "Employee successfully deleted!");
      fetchEmployees();
      fetchActiveStats();
    } catch (err) {
      console.error(err);
      showMessage("error", "Failed to delete employee");
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <>
      <h1>Employees</h1>

      <MessageModal
        show={messageData.show}
        type={messageData.type}
        message={messageData.message}
        onClose={closeMessage}
      />

      <div className="search-container">
        <input
          type="number"
          placeholder="Search by Employee ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button className="btn-small update" onClick={handleSearch}>Search</button>
      </div>

      <div className="active-stats">
        <h3>Active Employees Per Month</h3>
        <ul>
          {Object.keys(activeStats).map((month) => (
            <li key={month}>
              Month {month}: {activeStats[month]} Active
            </li>
          ))}
        </ul>
      </div>

      <button
        className="add-btn"
        onClick={() => {
          setAddingNew(true);
          setEditingId(null);
          setFormData({});
        }}
      >
        Add New Employee
      </button>

      <div className="table-table-container scrollable-table">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Marital Status</th>
              <th>Designation</th>
              <th>Education</th>
              <th>Employment Status</th>
              <th>Joining Date</th>
              <th>Address</th>
              <th>Department</th>
              <th>Active</th>
              <th>Created At</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Add New Employee Row */}
            {addingNew && (
              <tr>
                <td>New</td>
                <td><input name="firstName" value={formData.firstName || ""} onChange={handleChange} /></td>
                <td><input name="lastName" value={formData.lastName || ""} onChange={handleChange} /></td>
                <td><input name="email" value={formData.email || ""} onChange={handleChange} /></td>
                <td><input name="contact" value={formData.contact || ""} onChange={handleChange} /></td>
                <td><input name="maritalStatus" value={formData.maritalStatus || ""} onChange={handleChange} /></td>
                <td>
                  <select name="designationId" value={formData.designationId || ""} onChange={handleChange}>
                    <option value="">Select Designation</option>
                    {designations.map((d) => (
                      <option key={d.designationId} value={d.designationId}>{d.designationTitle}</option>
                    ))}
                  </select>
                </td>
                <td><input name="education" value={formData.education || ""} onChange={handleChange} /></td>
                <td><input name="employmentStatus" value={formData.employmentStatus || ""} onChange={handleChange} /></td>
                <td><input type="date" name="joiningDate" value={formData.joiningDate || ""} onChange={handleChange} /></td>
                <td><input name="address" value={formData.address || ""} onChange={handleChange} /></td>
                <td>
                  <select name="deptId" value={formData.deptId || ""} onChange={handleChange}>
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.deptId} value={d.deptId}>{d.deptName}</option>
                    ))}
                  </select>
                </td>
                <td><input type="checkbox" name="isActive" checked={formData.isActive || false} onChange={handleChange} /></td>
                <td>Auto</td>
                <td className="actions-col">
                  <button className="btn-small save" onClick={() => saveEdit(null)}>Save</button>
                  <button className="btn-small cancel" onClick={cancelEdit}>Cancel</button>
                </td>
              </tr>
            )}

            {/* Employee List */}
            {employees.map((emp) => (
              <tr key={emp.empId}>
                <td>{emp.empId}</td>
                <td>{editingId === emp.empId ? <input name="firstName" value={formData.firstName} onChange={handleChange} /> : emp.firstName}</td>
                <td>{editingId === emp.empId ? <input name="lastName" value={formData.lastName} onChange={handleChange} /> : emp.lastName}</td>
                <td>{editingId === emp.empId ? <input name="email" value={formData.email} onChange={handleChange} /> : emp.email}</td>
                <td>{editingId === emp.empId ? <input name="contact" value={formData.contact} onChange={handleChange} /> : emp.contact}</td>
                <td>{editingId === emp.empId ? <input name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} /> : emp.maritalStatus}</td>
                <td>{editingId === emp.empId ? (
                  <select name="designationId" value={formData.designationId || ""} onChange={handleChange}>
                    <option value="">Select Designation</option>
                    {designations.map((d) => (
                      <option key={d.designationId} value={d.designationId}>{d.designationTitle}</option>
                    ))}
                  </select>
                ) : emp.position?.designationTitle}</td>
                <td>{editingId === emp.empId ? <input name="education" value={formData.education} onChange={handleChange} /> : emp.education}</td>
                <td>{editingId === emp.empId ? <input name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} /> : emp.employmentStatus}</td>
                <td>{editingId === emp.empId ? <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} /> : emp.joiningDate}</td>
                <td>{editingId === emp.empId ? <input name="address" value={formData.address} onChange={handleChange} /> : emp.address}</td>
                <td>{editingId === emp.empId ? (
                  <select name="deptId" value={formData.deptId || ""} onChange={handleChange}>
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.deptId} value={d.deptId}>{d.deptName}</option>
                    ))}
                  </select>
                ) : emp.department?.deptName}</td>
                <td>{editingId === emp.empId ? <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> : emp.isActive ? "Yes" : "No"}</td>
                <td>{emp.createdAt}</td>
                <td className="actions-col">
                  {editingId === emp.empId ? (
                    <>
                      <button className="btn-small save" onClick={() => saveEdit(emp.empId)}>Save</button>
                      <button className="btn-small cancel" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-small update" onClick={() => startEdit(emp)}>Update</button>
                      <button className="btn-small delete" onClick={() => handleDeleteClick(emp.empId)}>Delete</button>
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
        message="Are you sure you want to delete this employee?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
