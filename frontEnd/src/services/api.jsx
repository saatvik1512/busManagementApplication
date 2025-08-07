// src/services/api.js
import axios from 'axios';

// Configure base URL for your backend
const API_BASE_URL = 'http://localhost:8080/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Public API Calls ---

// Search buses by start, end, and city
export const searchBuses = (start, end, city) => {
  return api.get(`/buses/search?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&city=${encodeURIComponent(city)}`);
};

// Get all buses by city
export const getBusesByCity = (city) => {
  return api.get(`/buses/by-city?city=${encodeURIComponent(city)}`);
};

// Admin Login
export const loginAdmin = (username, password) => {
  return api.post('/admin/login', { username, password });
};

// --- Admin API Calls ---

// Get buses for the logged-in admin
export const getAdminBuses = () => {
  return api.get('/buses'); // Assuming this returns buses for the authenticated admin
};

// Add a new bus (for admin)
export const addBus = (busData) => {
  return api.post('/buses', busData);
};

// Update a bus (for admin)
export const updateBus = (busId, busData) => {
  return api.put(`/buses/${busId}`, busData);
};

// Delete a bus (for admin)
export const deleteBus = (busId) => {
  return api.delete(`/buses/${busId}`);
};

// --- SuperAdmin API Calls ---

// Create a new admin (for superadmin)
export const createAdmin = (adminData) => {
  return api.post('/superadmin/admins', adminData);
};

// Get admins in the superadmin's city
export const getAdmins = () => {
  return api.get('/superadmin/admins');
};

// Update an admin (for superadmin)
export const updateAdmin = (adminId, adminData) => {
  return api.put(`/superadmin/admins/${adminId}`, adminData);
};

// Delete an admin (for superadmin)
export const deleteAdmin = (adminId) => {
  return api.delete(`/superadmin/admins/${adminId}`);
};

// Get all buses in the superadmin's city
export const getSuperAdminViewBuses = () => {
    return api.get('/superadmin/buses');
};

// Export the axios instance if needed elsewhere
export default api;