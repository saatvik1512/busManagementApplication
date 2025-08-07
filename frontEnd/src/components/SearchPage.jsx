// src/components/SearchPage.jsx
import React, { useState } from 'react';
import * as api from '../services/api';

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
    <div>
      <h2>Search Buses</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label>
            <input
              type="radio"
              value="route"
              checked={searchType === 'route'}
              onChange={() => setSearchType('route')}
            />
            Search by Route (Start - End)
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              value="city"
              checked={searchType === 'city'}
              onChange={() => setSearchType('city')}
            />
            Search by City
          </label>
        </div>

        {searchType === 'route' && (
          <>
            <div>
              <label htmlFor="start">Start Stop:</label>
              <input
                type="text"
                id="start"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required={searchType === 'route'}
              />
            </div>
            <div>
              <label htmlFor="end">End Stop:</label>
              <input
                type="text"
                id="end"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required={searchType === 'route'}
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {buses.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {buses.map((bus) => (
              <li key={bus.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <strong>{bus.busName}</strong> ({bus.busNumber}) - {bus.city}
                <br />
                Company: {bus.companyName}
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;