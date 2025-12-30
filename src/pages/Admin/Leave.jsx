import React, { useState, useEffect } from "react";
import api from "../../api/axios"; // Use your axios.js instance
import "./Leave.css";

const LeaveAdmin = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TOTAL_ALLOWED = 30;

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/employee-leaves"); // relative path
      const data = Array.isArray(res.data) ? res.data : [];

      const formattedData = data.map((leave) => ({
        ...leave,
        emp_name: leave.employee
          ? `${leave.employee.firstName} ${leave.employee.lastName}`
          : "Unknown",
        leave_type_name: leave.leaveType
          ? leave.leaveType.typeName
          : "Home Leave",
        totalDays: leave.totalDays || 0,
      }));

      setLeaveRequests(formattedData);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      setError("Could not fetch leave records. Ensure Spring Boot is running.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const getEmployeeUsedLeaves = (employeeName) => {
    return leaveRequests
      .filter(
        (leave) => leave.emp_name === employeeName && leave.status === "Approved"
      )
      .reduce((sum, leave) => sum + leave.totalDays, 0);
  };

  const handleLeaveAction = async (leaveId, action) => {
    const userSession = JSON.parse(localStorage.getItem("user_session")); // token user
    const adminId = userSession?.user?.userId || 1;

    try {
      await api.patch(`/employee-leaves/${leaveId}/status`, {
        status: action,
        adminId: adminId,
      });

      fetchLeaves(); // Refresh after action
    } catch (err) {
      console.error("Action error:", err.response?.data || err.message);
      alert("Failed to update leave status.");
    }
  };

  if (loading)
    return <div className="leave-container">Loading system records...</div>;
  if (error)
    return (
      <div className="leave-container" style={{ color: "red" }}>
        {error}
      </div>
    );

  return (
    <div className="leave-container">
      <h2 className="leave-header">Employee Leave Management</h2>
      <table className="leave-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Dates</th>
            <th>Requested</th>
            <th>Status</th>
            <th>Total Taken</th>
            <th>Remaining Days</th>
            <th>Approved By</th>
            <th>Approved At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((leave) => {
            const usedLeaves = getEmployeeUsedLeaves(leave.emp_name);
            const remaining = TOTAL_ALLOWED - usedLeaves;

            return (
              <tr key={leave.leaveId}>
                <td>{leave.leaveId}</td>
                <td>{leave.emp_name}</td>
                <td>{leave.leave_type_name}</td>
                <td>
                  {leave.startDate} <span className="date-separator">to</span>{" "}
                  {leave.endDate}
                </td>
                <td>{leave.totalDays} Days</td>
                <td>
                  <span
                    className={`status-badge ${
                      (leave.status || "pending").toLowerCase()
                    }`}
                  >
                    {leave.status || "Pending"}
                  </span>
                </td>
                <td>{usedLeaves}</td>
                <td className="remaining-cell" style={{ fontWeight: "bold" }}>
                  {remaining}
                </td>
                <td>
                  {leave.approvedBy
                    ? `User ID: ${leave.approvedBy.userId}`
                    : "—"}
                </td>
                <td>
                  {leave.approvedAt
                    ? new Date(leave.approvedAt).toLocaleString()
                    : "—"}
                </td>
                <td>
                  {!leave.status || leave.status === "Pending" ? (
                    <div className="btn-group">
                      <button
                        className="btn-approve"
                        onClick={() =>
                          handleLeaveAction(leave.leaveId, "Approved")
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() =>
                          handleLeaveAction(leave.leaveId, "Rejected")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className={`text-final ${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveAdmin;
