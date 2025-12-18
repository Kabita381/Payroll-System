import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1 className="landing-title">Payroll Management System</h1>
        <p className="landing-subtitle">
          Choose your portal to continue
        </p>

        <div className="button-group">
          <Link to="/admin" className="landing-btn admin">
            Admin Login
          </Link>

          <Link to="/accountant" className="landing-btn accountant">
            Accountant Login
          </Link>

          <Link to="/employee" className="landing-btn employee">
            Employee Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
