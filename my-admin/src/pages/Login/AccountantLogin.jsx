import { useState } from "react";
import { useNavigate } from "react-router-dom"; // for redirect
import "./login.css";

export default function AccountantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Credential check (same pattern as Admin)
    if (email === "accountant@nast.edu.np" && password === "accountant123") {
      console.log("Accountant Login Successful");
      // Redirect to Accountant Dashboard
      navigate("/accountant/accountant-dashboard");
    } else {
      alert(
        "Invalid Email or Password! Please use accountant@nast.edu.np and accountant123"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-section">
          <div
            className="logo-placeholder"
            style={{ color: "#1976d2" }}
          >
            NAST
          </div>
          <h2>Accountant Portal</h2>
          <p>Payroll Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Accountant Email</label>
            <input
              type="email"
              placeholder="accountant@nast.edu.np"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <button type="submit" className="login-btn accountant-theme">
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
          <a href="/accountant/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
