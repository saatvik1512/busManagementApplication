// src/services/auth.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from './api'; // Import API functions

const AuthContext = createContext();
document.documentElement.setAttribute('data-theme', 'light');
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (token exists)
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Attempt login via API
      const response = await api.loginAdmin(username, password); // Use unified login endpoint
      const token = response.data.token;

      if (token) {
        // Decode token to get user info (simplified - real apps might verify signature)
        // This assumes the username is in the 'sub' claim
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.authorities && payload.authorities.length > 0 ? payload.authorities[0] : 'ROLE_UNKNOWN';
        const userData = { username: payload.sub, role: userRole };

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        return { success: true };
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Clear any stale data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};