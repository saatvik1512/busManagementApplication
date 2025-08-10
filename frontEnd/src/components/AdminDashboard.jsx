// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import Card from './Card';

const AdminDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBus, setNewBus] = useState({
    busNumber: '', busName: '', city: '', stops: [{ stopName: '', arrivalTime: '', departureTime: '' }]
  });

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await api.getAdminBuses();
        setBuses(response.data);
      } catch (err) {
        console.error("Error fetching admin buses:", err);
        setError('Failed to load buses.');
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      const response = await api.addBus(newBus);
      setBuses([...buses, response.data]);
      setNewBus({ busNumber: '', busName: '', city: '', stops: [{ stopName: '', arrivalTime: '', departureTime: '' }] });
      setShowAddForm(false);
      alert('Bus added successfully!');
    } catch (err) {
      console.error("Error adding bus:", err);
      alert('Failed to add bus: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await api.deleteBus(busId);
        setBuses(buses.filter(bus => bus.id !== busId));
        alert('Bus deleted successfully!');
      } catch (err) {
        console.error("Error deleting bus:", err);
        alert('Failed to delete bus: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const addStopField = () => {
    setNewBus({
      ...newBus,
      stops: [...newBus.stops, { stopName: '', arrivalTime: '', departureTime: '' }]
    });
  };

  const removeStopField = (index) => {
    if (newBus.stops.length > 1) {
      const updatedStops = newBus.stops.filter((_, i) => i !== index);
      setNewBus({ ...newBus, stops: updatedStops });
    }
  };

  const handleStopChange = (index, field, value) => {
    const updatedStops = [...newBus.stops];
    updatedStops[index][field] = value;
    setNewBus({ ...newBus, stops: updatedStops });
  };

  if (loading) return <p>Loading buses...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container">
      <Card title="Admin Dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Your Buses</h3>
          <button 
            className={`btn ${showAddForm ? 'btn-danger' : 'btn-secondary'}`} 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Bus'}
          </button>
        </div>
      </Card>

      {showAddForm && (
        <Card title="Add New Bus">
          <form onSubmit={handleAddBus}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label>Bus Number</label>
                <input 
                  type="text" 
                  value={newBus.busNumber} 
                  onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Bus Name</label>
                <input 
                  type="text" 
                  value={newBus.busName} 
                  onChange={(e) => setNewBus({ ...newBus, busName: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  value={newBus.city} 
                  onChange={(e) => setNewBus({ ...newBus, city: e.target.value })} 
                  required 
                />
              </div>
            </div>
            
            <h4 style={{ margin: '1.5rem 0 1rem' }}>Stops:</h4>
            {newBus.stops.map((stop, index) => (
              <div key={index} className="form-group" style={{ 
                border: '1px solid #eee', 
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h5>Stop #{index + 1}</h5>
                  {newBus.stops.length > 1 && (
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      style={{ padding: '0.25rem 0.5rem' }}
                      onClick={() => removeStopField(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Stop Name</label>
                    <input 
                      type="text" 
                      value={stop.stopName} 
                      onChange={(e) => handleStopChange(index, 'stopName', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Arrival Time</label>
                    <input 
                      type="text" 
                      value={stop.arrivalTime} 
                      onChange={(e) => handleStopChange(index, 'arrivalTime', e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Departure Time</label>
                    <input 
                      type="text" 
                      value={stop.departureTime} 
                      onChange={(e) => handleStopChange(index, 'departureTime', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              type="button" 
              className="btn"
              style={{ marginBottom: '1rem' }}
              onClick={addStopField}
            >
              Add Stop
            </button>
            
            <button type="submit" className="btn" style={{ width: '100%' }}>
              Save Bus
            </button>
          </form>
        </Card>
      )}

      {loading && <div className="loading">Loading buses...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      {!loading && buses.length === 0 && !showAddForm && (
        <Card>
          <p style={{ textAlign: 'center', padding: '2rem' }}>
            You have not added any buses yet.
          </p>
        </Card>
      )}

      {!loading && buses.length > 0 && (
        <Card title={`Your Buses (${buses.length})`}>
          <div className="bus-list">
            {buses.map((bus) => (
              <div key={bus.id} className="list-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>{bus.busName} ({bus.busNumber})</h4>
                    <p style={{ color: '#7f8c8d', margin: '0.25rem 0' }}>
                      {bus.city}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDeleteBus(bus.id)} 
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
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
    </div>
  );
};

export default AdminDashboard;