import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ResetPassword.css"; 

const ResetPassword = () => {
    const [formData, setFormData] = useState({ token: "", newPassword: "", confirmPassword: "" });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    
    const navigate = useNavigate();

    // Logic to handle the password update
    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:8080/api/users/reset-password", null, {
                params: { 
                    token: formData.token, 
                    newPassword: formData.newPassword 
                }
            });
            alert("Success! Password updated.");
            navigate("/"); 
        } catch (err) {
            // Handle expired or invalid token
            const errMsg = err.response?.data || "Invalid/Expired OTP or server error.";
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    // Logic to handle resending the code if expired
    const handleResendCode = async () => {
        setResending(true);
        setError("");
        setSuccessMessage("");
        try {
            // Note: Update this URL to your actual 'forgot-password' or 'resend' endpoint
            await axios.post("http://localhost:8080/api/users/forgot-password", { 
                email: "user@example.com" // Ideally passed via state/context
            });
            setSuccessMessage("A new 6-digit code has been sent to your email.");
        } catch (err) {
            setError("Failed to resend code. Please try again.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-card">
                <div className="auth-logo">PAYROLL SYSTEM</div>
                <h2>Set New Password</h2>
                <p className="auth-instruction">Enter the 6-digit code sent to your email and your new password.</p>
                
                {error && <div className="error-msg">{error}</div>}
                {successMessage && <div className="success-msg">{successMessage}</div>}
                
                <form onSubmit={handleReset}>
                    <div className="input-group">
                        <label>6-DIGIT OTP</label>
                        <input 
                            type="text" 
                            placeholder="Enter OTP" 
                            value={formData.token}
                            onChange={(e) => setFormData({...formData, token: e.target.value})} 
                            required 
                        />
                        <div className="resend-section">
                            <span>Code expired? </span>
                            <button 
                                type="button" 
                                className="resend-link" 
                                onClick={handleResendCode}
                                disabled={resending}
                            >
                                {resending ? "Sending..." : "Resend Code"}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>NEW PASSWORD</label>
                        <input 
                            type={showNewPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
                            required 
                        />
                        <button 
                            type="button" 
                            className="password-toggle-icon" 
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="input-group">
                        <label>CONFIRM PASSWORD</label>
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                            required 
                        />
                        <button 
                            type="button" 
                            className="password-toggle-icon" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button type="submit" className="btn-base update-btn" disabled={loading}>
                        {loading ? "UPDATING..." : "Update Password"}
                    </button>
                </form>

                <button type="button" className="btn-base back-to-login-btn" onClick={() => navigate("/")}>
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;