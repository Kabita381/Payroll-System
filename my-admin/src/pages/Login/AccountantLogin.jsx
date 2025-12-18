import { useState } from "react";
import "./login.css"; // Correct path since files are in the same folder

export default function AccountantLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Accountant Login Successful");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-section">
        <div className="logo-placeholder" style={{ color: '#1976d2' }}>
  
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
        </form>
      </div>
    </div>
  );
}