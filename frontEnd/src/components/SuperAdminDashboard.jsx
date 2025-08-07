// src/components/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

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
    <div>
      <h2>Super Admin Dashboard</h2>
      <div>
        <button
          onClick={() => setActiveTab('admins')}
          style={{ fontWeight: activeTab === 'admins' ? 'bold' : 'normal' }}
        >
          Manage Admins
        </button>
        <button
          onClick={() => setActiveTab('buses')}
          style={{ fontWeight: activeTab === 'buses' ? 'bold' : 'normal', marginLeft: '10px' }}
        >
          View All Buses (City)
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {activeTab === 'admins' && (
        <div>
          <h3>Admins in Your City</h3>
          <button onClick={() => setShowAddAdminForm(!showAddAdminForm)}>
            {showAddAdminForm ? 'Cancel' : 'Create New Admin'}
          </button>

          {showAddAdminForm && (
            <form onSubmit={handleAddAdmin} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0' }}>
              <h4>Create New Admin</h4>
              <div>
                <label>Username: <input type="text" value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} required /></label>
              </div>
              <div>
                <label>Password: <input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} required /></label>
              </div>
              <div>
                <label>Company Name: <input type="text" value={newAdmin.companyName} onChange={(e) => setNewAdmin({ ...newAdmin, companyName: e.target.value })} required /></label>
              </div>
              <div>
                <label>License Number: <input type="text" value={newAdmin.licenseNumber} onChange={(e) => setNewAdmin({ ...newAdmin, licenseNumber: e.target.value })} required /></label>
              </div>
               {/* City is typically set by the SuperAdmin's city on the backend, but showing it might be okay */}
              {/* <div>
                <label>City: <input type="text" value={newAdmin.city} onChange={(e) => setNewAdmin({ ...newAdmin, city: e.target.value })} required /></label>
              </div> */}
              <button type="submit">Create Admin</button>
            </form>
          )}

          {loadingAdmins ? (
            <p>Loading admins...</p>
          ) : admins.length === 0 ? (
            <p>No admins found in your city.</p>
          ) : (
            <ul>
              {admins.map((admin) => (
                <li key={admin.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                  <strong>{admin.username}</strong> - {admin.companyName} (License: {admin.licenseNumber})
                  <br />
                  City: {admin.city}
                  <br />
                  {/* Add edit functionality if needed */}
                  <button onClick={() => handleDeleteAdmin(admin.id)} style={{ backgroundColor: 'red', color: 'white', marginTop: '5px' }}>Delete Admin</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === 'buses' && (
        <div>
          <h3>All Buses in Your City</h3>
          {loadingBuses ? (
            <p>Loading buses...</p>
          ) : buses.length === 0 ? (
            <p>No buses found in your city.</p>
          ) : (
            <ul>
              {buses.map((bus) => (
                <li key={bus.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                  <strong>{bus.busName}</strong> ({bus.busNumber}) - {bus.city}
                  <br />
                  Managed by: {bus.companyName} {/* Assuming companyName is in BusDTO */}
                  <br />
                  <strong>Stops:</strong>
                  <ul>
                    {bus.stops.map((stop, index) => (
                      <li key={index}>
                        {stop.stopName} (Arrival: {stop.arrivalTime}
                        {stop.departureTime && `, Departure: ${stop.departureTime}`})
                      </li>
                    ))}
                  </ul>
                  {/* Add actions like view details if needed, but probably no edit/delete here */}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;