
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // This should contain your Blue Theme CSS

const EmployeeLogin = () => {
    const [empId, setEmpId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        // --- HARDCODED CREDENTIALS CHECK ---
        if (empId === "EMP2025" && password === "password123") {
            setError('');
            // This MUST match the path you defined in App.jsx
            navigate('/employee/dashboard'); 
        } else {
            setError('Invalid Employee ID or Password');
        }
    };

    return (
        <div className="login-container" style={{backgroundColor: '#eef2f7', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className="login-card" style={{background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderTop: '5px solid #1a73e8'}}>
                <h2 style={{color: '#1a73e8', marginBottom: '20px'}}>Employee Login</h2>
                <form onSubmit={handleLogin}>
                    <div style={{marginBottom: '15px', textAlign: 'left'}}>
                        <label>Employee ID</label>
                        <input 
                            type="text" 
                            style={{width: '100%', padding: '10px', marginTop: '5px'}}
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            placeholder="EMP2025"
                            required 
                        />
                    </div>
                    <div style={{marginBottom: '15px', textAlign: 'left'}}>
                        <label>Password</label>
                        <input 
                            type="password" 
                            style={{width: '100%', padding: '10px', marginTop: '5px'}}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password123"
                            required 
                        />
                    </div>
                    {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}
                    <button type="submit" style={{width: '100%', padding: '12px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeLogin
