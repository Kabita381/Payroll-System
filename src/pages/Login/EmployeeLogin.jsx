import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./login.css"; 

export default function EmployeeLogin({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

 // Handle form submission fetch request to backend
   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9090/api/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid email or password");

      const data = await response.json();
      console.log("Login successful:", data);

      localStorage.setItem("user_session", JSON.stringify(data));
      setUser(data);
      navigate("/employee/dashboard"); // Redirect to accountant dashboard
    } catch (error) {
      console.error("Error:", error.message);
      alert("Login failed. Check your email and password.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">NAST</div>
          <h2>Employee Portal</h2>
          <p>Access your payroll and attendance</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Employee Email</label>
            <input
              type="email"
              placeholder="employee@nast.edu.np"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ backgroundColor: '#059669' }}>
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <button onClick={() => navigate("/")} className="btn-text">
            ← Back to Landing Page
          </button>
          <a href="/employee/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}