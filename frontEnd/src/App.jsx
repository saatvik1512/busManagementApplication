// frontEnd/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import { useAuth } from './services/auth';
import './styles.css'; // Import centralized styles

function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="App">
        <header>
          <div className="container">
            <h2>Bus Management System</h2>
            {user && (
              <div className="user-info">
                <span>Hi, {user.username} ({user.role}) </span>
                <button className="btn" onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        </header>

        <main>
          <div className="container">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/admin/*"
                element={user && user.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/superadmin/*"
                element={user && user.role === 'ROLE_SUPER_ADMIN' ? <SuperAdminDashboard /> : <Navigate to="/login" replace />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;