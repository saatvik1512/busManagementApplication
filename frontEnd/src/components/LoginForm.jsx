// frontEnd/src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth';
import Card from './Card';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'ROLE_SUPER_ADMIN') {
        navigate('/superadmin/dashboard');
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError(result.message || 'Invalid username or password');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <Card title="Login">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>
            Login
          </button>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;