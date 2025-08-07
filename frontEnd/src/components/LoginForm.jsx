// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the 'from' location state or default to home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
        // Redirect based on user role or the page they came from
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData.role === 'ROLE_ADMIN') {
            navigate('/admin/dashboard');
        } else if (userData.role === 'ROLE_SUPER_ADMIN') {
            navigate('/superadmin/dashboard');
        } else {
            // Fallback if role is unknown
            navigate(from, { replace: true });
        }
        } else {
        setError(result.message || 'Invalid username or password');
        }
    };
    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required/>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
  );
};

export default LoginForm;

