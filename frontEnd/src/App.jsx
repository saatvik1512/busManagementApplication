import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import SuperAdminSignup from './components/SuperAdminSignup';
import PassengerLogin from './components/PassengerLogin';
import PassengerSignup from './components/PassengerSignup';
import { useAuth } from './services/auth';
import MyBookings from './components/MyBookings';
import './styles.css';

function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="App">
        <header>
          <div className="container">
            <h2>Bus Management System</h2>
            {user ? (
              <div className="user-info">
                <span>Welcome, {user.username} ({user.role.replace('ROLE_', '').replace('_', ' ')})</span>
                {user.role === 'ROLE_PASSENGER' && (
                  <Link to="/my-bookings" className="btn btn-sm" style={{backgroundColor: '#16a085', marginRight: '0.5rem'}}>
                    My Bookings
                  </Link>
                )}
                <button className="btn btn-sm" onClick={logout}>Logout</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-sm">
                  Admin Login
                </Link>
                <Link to="/signup/superadmin" className="btn btn-sm btn-secondary">
                  Super Admin Signup
                </Link>
                <Link to="/passenger-login" className="btn btn-sm" style={{backgroundColor: '#9b59b6'}}>
                  Passenger Login
                </Link>
                <Link to="/passenger-signup" className="btn btn-sm" style={{backgroundColor: '#8e44ad'}}>
                  Passenger Signup
                </Link>
              </div>
            )}
          </div>
        </header>

        <main>
          <div className="container">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup/superadmin" element={<SuperAdminSignup />} />
              <Route
                path="/admin/*"
                element={user && user.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/superadmin/*"
                element={user && user.role === 'ROLE_SUPER_ADMIN' ? <SuperAdminDashboard /> : <Navigate to="/login" replace />}
              />
              <Route 
                path="/my-bookings" 
                element={user && user.role === 'ROLE_PASSENGER' ? <MyBookings /> : <Navigate to="/passenger-login" replace />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/passenger-login" element={<PassengerLogin />} />
              <Route path="/passenger-signup" element={<PassengerSignup />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;