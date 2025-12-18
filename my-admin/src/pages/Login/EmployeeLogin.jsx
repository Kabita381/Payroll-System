import { useState } from "react";
import "./login.css";

export default function EmployeeLogin() {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Employee Login Successful");
  };

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Employee Login</h2>

        <input
          type="text"
          placeholder="Employee ID"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn employee">Login</button>
      </form>
    </div>
  );
}
