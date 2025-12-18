import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Essential for moving to the dashboard
import "./login.css"; // Correct path since login.css is in the same folder

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize the navigation hook

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // UPDATED LOGIC: Checking for specific credentials
    if (email === "admin@nast.edu.np" && password === "admin123") {
      console.log("Login Successful");
      // Redirects the user to the Admin Dashboard path
      navigate("/admin/dashboard"); 
    } else {
      // Shows an error if the credentials don't match
      alert("Invalid Email or Password! Please use admin@nast.edu.np and admin123");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-section">
          <div className="logo-placeholder">NAST</div>
          <h2>Admin Portal</h2>
          <p>Payroll Management System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Admin Email</label>
            <input
              type="email"
              placeholder="admin@nast.edu.np"
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

          <button type="submit" className="login-btn admin-theme">
            Sign In
          </button>
        </form>
        
        <div className="login-footer">
          <a href="#">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}