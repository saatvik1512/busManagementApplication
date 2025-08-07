// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

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
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Cancel' : 'Add New Bus'}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddBus} style={{ border: '1px solid #ddd', padding: '15px', margin: '10px 0' }}>
          <h3>Add New Bus</h3>
          <div>
            <label>Bus Number: <input type="text" value={newBus.busNumber} onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value })} required /></label>
          </div>
          <div>
            <label>Bus Name: <input type="text" value={newBus.busName} onChange={(e) => setNewBus({ ...newBus, busName: e.target.value })} required /></label>
          </div>
          <div>
            <label>City: <input type="text" value={newBus.city} onChange={(e) => setNewBus({ ...newBus, city: e.target.value })} required /></label>
          </div>
          <h4>Stops:</h4>
          {newBus.stops.map((stop, index) => (
            <div key={index} style={{ marginBottom: '10px', border: '1px solid #eee', padding: '5px' }}>
              <label>Stop Name: <input type="text" value={stop.stopName} onChange={(e) => handleStopChange(index, 'stopName', e.target.value)} required /></label>
              <label>Arrival Time: <input type="text" value={stop.arrivalTime} onChange={(e) => handleStopChange(index, 'arrivalTime', e.target.value)} required /></label>
              <label>Departure Time: <input type="text" value={stop.departureTime} onChange={(e) => handleStopChange(index, 'departureTime', e.target.value)} /></label>
              {newBus.stops.length > 1 && (
                <button type="button" onClick={() => removeStopField(index)}>Remove Stop</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addStopField}>Add Stop</button>
          <br />
          <button type="submit">Save Bus</button>
        </form>
      )}

      <h3>Your Buses</h3>
      {buses.length === 0 ? (
        <p>You have not added any buses yet.</p>
      ) : (
        <ul>
          {buses.map((bus) => (
            <li key={bus.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <strong>{bus.busName}</strong> ({bus.busNumber}) - {bus.city}
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
              <button onClick={() => handleDeleteBus(bus.id)} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;