import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeDashboard.css";

const AttendanceRecords = () => {
  const [employeeId, setEmployeeId] = useState(15); 
  const [status, setStatus] = useState("Not Checked In");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [liveDistance, setLiveDistance] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // New: For success animation

  // ============================================================
  // HIGHLIGHT: GPS SETTINGS (TESTING MODE)
  // ============================================================
  const [officeLocation, setOfficeLocation] = useState(null);
  const ALLOWED_RADIUS_METERS = 10; 
  // ============================================================

  const API_URL = "http://localhost:8080/api/attendance";

  useEffect(() => {
    // Capture current seat as office for testing
    navigator.geolocation.getCurrentPosition((pos) => {
      setOfficeLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    });
    fetchAttendance();
  }, [employeeId]);

  // This function refreshes the data from the database
  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API_URL}/employee/${employeeId}`);
      const sorted = res.data.sort((a, b) => new Date(b.attendanceDate) - new Date(a.attendanceDate));
      setHistory(sorted);
      
      const today = new Date().toLocaleDateString('en-CA');
      const todayRec = sorted.find(r => r.attendanceDate === today);
      if (todayRec) {
        setStatus(todayRec.checkOutTime ? "Checked Out" : "Checked In");
      } else {
        setStatus("Not Checked In");
      }
    } catch (err) { console.error("Update failed"); }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleAttendance = async (type) => {
    if (!officeLocation) return alert("Waiting for GPS...");
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const distance = getDistance(latitude, longitude, officeLocation.lat, officeLocation.lon);
      setLiveDistance(distance.toFixed(2));

      if (distance > ALLOWED_RADIUS_METERS) {
        alert(`Access Denied! You are ${distance.toFixed(2)}m away.`);
        setLoading(false);
        return;
      }

      const now = new Date();
      const isoNow = now.toISOString().split('.')[0]; 
      const todayDate = now.toLocaleDateString('en-CA');

      try {
        if (type === "in") {
          await axios.post(API_URL, {
            employee: { empId: employeeId },
            attendanceDate: todayDate,
            checkInTime: isoNow,
            inGpsLat: latitude,
            inGpsLong: longitude
          });
        } else {
          const todayRec = history.find(r => r.attendanceDate === todayDate);
          await axios.put(`${API_URL}/${todayRec.attendanceId}`, { ...todayRec, checkOutTime: isoNow });
        }

        // IMMEDIATE UPDATE LOGIC
        setShowSuccess(true); // Show success checkmark
        setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
        await fetchAttendance(); // Refresh table automatically
        alert(`Successfully ${type === "in" ? "Checked In" : "Checked Out"}!`);

      } catch (err) {
        alert("Backend Error: " + (err.response?.data?.message || "Data Binding Error"));
      } finally { setLoading(false); }
    }, () => setLoading(false), { enableHighAccuracy: true });
  };

  return (
    <div className="page-container">
      <div className="header-section">
        <h1>Attendance Portal</h1>
      </div>

      <div className="attendance-action-card">
        {showSuccess && (
          <div className="success-banner">
            ✅ You have {status === "Checked In" ? "Checked In" : "Checked Out"} Successfully!
          </div>
        )}
        
        <div className="id-input-group">
            <label>Emp ID: </label>
            <input type="number" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        </div>
        
        <div className="status-display">
            <h3>Current Status: <span className={status.replace(/\s/g, '-')}>{status}</span></h3>
            {liveDistance && <p>Location Verified: {liveDistance}m away</p>}
        </div>

        <div className="button-group">
          <button className="btn-primary" onClick={() => handleAttendance("in")} disabled={loading || status !== "Not Checked In"}>
            {loading ? "Verifying..." : "Check In"}
          </button>
          <button className="btn-outline" onClick={() => handleAttendance("out")} disabled={loading || status !== "Checked In"}>
            {loading ? "Verifying..." : "Check Out"}
          </button>
        </div>
      </div>

      <div className="table-container">
        <h3>Recent Records</h3>
        <table className="data-table">
          <thead>
            <tr><th>Date</th><th>Check In</th><th>Check Out</th><th>GPS Status</th></tr>
          </thead>
          <tbody>
            {history.map(row => (
              <tr key={row.attendanceId}>
                <td>{row.attendanceDate}</td>
                <td>{row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString() : "—"}</td>
                <td>{row.checkOutTime ? new Date(row.checkOutTime).toLocaleTimeString() : "—"}</td>
                <td>{row.inGpsLat ? "✅ Verified" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceRecords;