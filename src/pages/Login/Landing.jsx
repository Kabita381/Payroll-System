import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import api from "../../api/axios"; 
import './login.css';

const Landing = ({ setUser }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        localStorage.removeItem("user_session");
        if (setUser) setUser(null);

        const params = new URLSearchParams(location.search);
        if (params.get("expired")) {
            setError("Your session has expired. Please log in again.");
        }
    }, [location, setUser]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post("/auth/login", {
                username: credentials.username.trim(),
                password: credentials.password
            });

            if (response.data) {
                const userData = response.data;
                const { token, role, isFirstLogin, email } = userData;
                
                // 1. Save to localStorage and App State
                localStorage.setItem("user_session", JSON.stringify(userData));
                if (setUser) setUser(userData);

                // 2. PRIORITY CHECK: If first login, redirect to setup
                // We pass the email in 'state' because InitialSetup.jsx requires it
                if (isFirstLogin) {
                    navigate('/initial-setup', { state: { email: email } });
                    return; // Stop execution here
                }

                // 3. Normal Role-based navigation
                const userRole = (role.roleName || role).toUpperCase();
                
                if (userRole.includes('ADMIN')) {
                    navigate('/admin/dashboard');
                } else if (userRole.includes('ACCOUNTANT')) {
                    navigate('/accountant/dashboard');
                } else {
                    navigate('/employee/dashboard');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Authentication failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <h1>Centralized</h1>
                    <p>Payroll Management System</p>
                    <span className="badge">SECURE GATEWAY</span>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label>USERNAME</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            required
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label>PASSWORD</label>
                        <div className="input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                            <button 
                                type="button"
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-box">{error}</div>}

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? "VERIFYING..." : "SIGN IN"}
                    </button>
                </form>

                <div className="login-footer">
                    <button
                        type="button"
                        className="trouble-link"
                        onClick={() => navigate('/forgot-password')}
                    >
                        Trouble signing in?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;