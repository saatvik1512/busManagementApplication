// src/components/SearchPage.jsx
import React, { useState } from 'react';
import * as api from '../services/api';
import Card from './Card';

const SearchPage = () => {
  const [searchType, setSearchType] = useState('route'); // 'route' or 'city'
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [city, setCity] = useState('');
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBuses([]);

    try {
      let response;
      if (searchType === 'route' && start && end && city) {
        response = await api.searchBuses(start, end, city);
      } else if (searchType === 'city' && city) {
        response = await api.getBusesByCity(city);
      } else {
        throw new Error('Please fill in all required fields for the selected search type.');
      }
      setBuses(response.data);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.response?.data?.message || 'An error occurred during search.');
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Card title="Search Buses">
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  value="route"
                  checked={searchType === 'route'}
                  onChange={() => setSearchType('route')}
                  style={{ marginRight: '0.5rem' }}
                />
                Search by Route
              </label>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="radio"
                  value="city"
                  checked={searchType === 'city'}
                  onChange={() => setSearchType('city')}
                  style={{ marginRight: '0.5rem' }}
                />
                Search by City
              </label>
            </div>
          </div>

          {searchType === 'route' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="start">Start Stop</label>
                <input
                  type="text"
                  id="start"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  required={searchType === 'route'}
                  placeholder="Enter start stop"
                />
              </div>
              <div className="form-group">
                <label htmlFor="end">End Stop</label>
                <input
                  type="text"
                  id="end"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  required={searchType === 'route'}
                  placeholder="Enter end stop"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="Enter city"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Buses'}
          </button>
        </form>
      </Card>

      {error && <div className="alert alert-danger">{error}</div>}

      {buses.length > 0 && (
        <Card title={`Search Results (${buses.length})`}>
          <div className="bus-list">
            {buses.map((bus) => (
              <div key={bus.id} className="list-item">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>{bus.busName} ({bus.busNumber})</h4>
                  <span style={{ backgroundColor: '#e8f4fd', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    {bus.city}
                  </span>
                </div>
                <p style={{ color: '#7f8c8d', margin: '0.5rem 0' }}>
                  Company: {bus.companyName}
                </p>
                
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

export default SearchPage;