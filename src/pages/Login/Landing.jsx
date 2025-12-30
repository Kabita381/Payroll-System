import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import your custom api instance instead of the global axios
import api from "../../api/axios";
import './login.css';

const Landing = ({ setUser }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Handler for Login Form
    const handleLogin = async (e) => {
        e.preventDefault(); // CRITICAL: Stops the page refresh
        setIsLoading(true);
        setError('');

        try {
            // Using the 'api' instance. Path is relative to the baseURL set in axios.js
            const response = await api.post('/auth/login', credentials);
            
            /** * userData now contains: userId, username, email, role, and token 
             * because of our backend AuthServiceImpl update.
             */
            const userData = response.data; 

            // Save the session (including the JWT token) to localStorage
            localStorage.setItem("user_session", JSON.stringify(userData));
            
            // Update global state
            setUser(userData);

            // Redirect based on the mapped role names from your backend
            const role = userData.role; 
            
            if (role === 'ROLE_ADMIN') {
                navigate('/admin/dashboard');
            } else if (role === 'ROLE_ACCOUNTANT') {
                navigate('/accountant/dashboard');
            } else if (role === 'ROLE_EMPLOYEE') {
                navigate('/employee/dashboard');
            } else {
                setError("Access Denied: Role not recognized.");
            }

        } catch (err) {
            // Handle error response from Spring Security
            if (err.response?.status === 401) {
                setError("Invalid username or password.");
            } else if (err.response?.status === 403) {
                setError("Your account does not have access rights.");
            } else {
                setError("Server connection error. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for Trouble Signing In Button
    const handleTrouble = () => {
        navigate('/forgot-password');
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <h1>NAST</h1>
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
                            autoComplete="username"
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
                        />
                    </div>

                    <div className="input-group">
                        <label>PASSWORD</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            autoComplete="current-password"
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
                        />
                    </div>

                    {error && <div className="error-box">{error}</div>}

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? 'VERIFYING...' : 'SIGN IN'}
                    </button>
                </form>

                <button 
                    type="button" 
                    className="trouble-link" 
                    onClick={handleTrouble}
                >
                    Trouble signing in?
                </button>
            </div>
        </div>
    );
};

export default Landing;