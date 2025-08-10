// src/components/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import Card from './Card';

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [buses, setBuses] = useState([]); // For city-wide view
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('admins'); // 'admins' or 'buses'
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', companyName: '', licenseNumber: '', city: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminsRes, busesRes] = await Promise.all([
          api.getAdmins().finally(() => setLoadingAdmins(false)),
          api.getSuperAdminViewBuses().finally(() => setLoadingBuses(false))
        ]);
        setAdmins(adminsRes.data);
        setBuses(busesRes.data);
      } catch (err) {
        console.error("Error fetching ", err);
        setError('Failed to load data.');
      }
    };

    fetchData();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
        // SuperAdmin's city should ideally be enforced by the backend based on the token
        // If needed, you could fetch the SuperAdmin's details first to get the city
        // and pre-fill it or validate against it.
      const response = await api.createAdmin(newAdmin);
      setAdmins([...admins, response.data]);
      setNewAdmin({ username: '', password: '', companyName: '', licenseNumber: '', city: '' }); // Reset form
      setShowAddAdminForm(false);
      alert('Admin created successfully!');
    } catch (err) {
      console.error("Error creating admin:", err);
      alert('Failed to create admin: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to delete this admin? This will likely also delete their buses.')) {
      try {
        await api.deleteAdmin(adminId);
        setAdmins(admins.filter(admin => admin.id !== adminId));
        alert('Admin deleted successfully!');
      } catch (err) {
        console.error("Error deleting admin:", err);
        alert('Failed to delete admin: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="container">
      <Card title="Super Admin Dashboard">
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            Manage Admins
          </button>
          <button 
            className={`tab-btn ${activeTab === 'buses' ? 'active' : ''}`}
            onClick={() => setActiveTab('buses')}
          >
            View All Buses
          </button>
        </div>
      </Card>

      {error && <div className="alert alert-danger">{error}</div>}

      {activeTab === 'admins' && (
        <>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Admins in Your City</h3>
              <button 
                className={`btn ${showAddAdminForm ? 'btn-danger' : 'btn-secondary'}`} 
                onClick={() => setShowAddAdminForm(!showAddAdminForm)}
              >
                {showAddAdminForm ? 'Cancel' : 'Create New Admin'}
              </button>
            </div>
          </Card>

          {showAddAdminForm && (
            <Card title="Create New Admin">
              <form onSubmit={handleAddAdmin}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Username</label>
                    <input 
                      type="text" 
                      value={newAdmin.username} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      value={newAdmin.password} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input 
                      type="text" 
                      value={newAdmin.companyName} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, companyName: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>License Number</label>
                    <input 
                      type="text" 
                      value={newAdmin.licenseNumber} 
                      onChange={(e) => setNewAdmin({ ...newAdmin, licenseNumber: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn" style={{ marginTop: '1rem', width: '100%' }}>
                  Create Admin
                </button>
              </form>
            </Card>
          )}

          {loadingAdmins ? (
            <div className="loading">Loading admins...</div>
          ) : admins.length === 0 ? (
            <Card>
              <p style={{ textAlign: 'center', padding: '2rem' }}>
                No admins found in your city.
              </p>
            </Card>
          ) : (
            <Card title={`Admins (${admins.length})`}>
              <div className="admin-list">
                {admins.map((admin) => (
                  <div key={admin.id} className="list-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>{admin.username}</h4>
                        <p style={{ color: '#7f8c8d', margin: '0.25rem 0' }}>
                          {admin.companyName} (License: {admin.licenseNumber})
                        </p>
                        <p>City: {admin.city}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteAdmin(admin.id)} 
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {activeTab === 'buses' && (
        <>
          <Card>
            <h3>All Buses in Your City</h3>
          </Card>
          
          {loadingBuses ? (
            <div className="loading">Loading buses...</div>
          ) : buses.length === 0 ? (
            <Card>
              <p style={{ textAlign: 'center', padding: '2rem' }}>
                No buses found in your city.
              </p>
            </Card>
          ) : (
            <Card title={`Buses (${buses.length})`}>
              <div className="bus-list">
                {buses.map((bus) => (
                  <div key={bus.id} className="list-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>{bus.busName} ({bus.busNumber})</h4>
                        <p style={{ color: '#7f8c8d', margin: '0.25rem 0' }}>
                          {bus.city} • Company: {bus.companyName}
                        </p>
                      </div>
                    </div>
                    
                    <h5 style={{ margin: '1rem 0 0.5rem' }}>Stops:</h5>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                      {bus.stops.map((stop, index) => (
                        <li key={index} style={{ marginBottom: '0.5rem' }}>
                          <strong>{stop.stopName}</strong> - 
                          Arrival: {stop.arrivalTime}
                          {stop.departureTime && `, Departure: ${stop.departureTime}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default SuperAdminDashboard;