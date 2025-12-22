import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./login.css"; 

export default function AccountantLogin({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 
  // Handle form submission fetch request to backend
   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:9090/api/accountant/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid email or password");

      const data = await response.json();
      console.log("Login successful:", data);

      localStorage.setItem("user_session", JSON.stringify(data));
      setUser(data);
      navigate("/accountant/dashboard"); // Redirect to accountant dashboard
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
          <h2>Accountant Portal</h2>
          <p>Manage financial records and payroll</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Accountant Email</label>
            <input
              type="email"
              placeholder="accountant@nast.edu.np"
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

          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <button onClick={() => navigate("/")} className="btn-text">
            ← Back to Landing Page
          </button>
          <a href="/accountant/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}