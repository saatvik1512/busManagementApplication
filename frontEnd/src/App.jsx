import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import { useAuth } from './services/auth';

function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="App">
        {/* Basic Header */}
        <header style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'black' }}>
          <h2>Bus Management System</h2>
          {user && (
            <div>
              <span>Hi, {user.username} ({user.role}) </span>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main style={{ padding: '20px' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SearchPage />} />
            <Route path="/login" element={<LoginForm />} />

            {/* Protected Routes - Redirect if not logged in */}
            <Route
              path="/admin/*"
              element={user && user.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/superadmin/*"
              element={user && user.role === 'ROLE_SUPER_ADMIN' ? <SuperAdminDashboard /> : <Navigate to="/login" replace />}
            />

            {/* Redirect unknown paths to search */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;