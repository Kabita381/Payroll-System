import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function EmployeeLogin() {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple credential check
    if (empId === "emp001" && password === "emp123") {
      console.log("Employee Login Successful");
      navigate("/employee/employee-dashboard");
    } else {
      alert(
        "Invalid Employee ID or Password! Please use emp001 and emp123"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-section">
          <div className="logo-placeholder" style={{ color: "#d32f2f" }}>
            NAST
          </div>
          <h2>Employee Portal</h2>
          <p>Payroll Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Employee ID</label>
            <input
              type="text"
              placeholder="emp001"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn employee-theme">
            Sign In
          </button>
          <div className="login-footer">
          <button 
            type="button" 
            onClick={() => navigate("/")}
            className="link-button"
          >
            Back to landing page
          </button>
          </div>
        </form>

        <div className="login-footer">
          <a href="/employee/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
