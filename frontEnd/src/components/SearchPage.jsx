// src/components/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import * as api from '../services/api';
import Card from './Card';

// const SeatSelection = ({ bus, onSeatsSelected, selectedSeats }) => {
//   const handleSeatClick = (seat) => {
//     if (!seat.available) return; // Can't select booked seats
    
//     if (selectedSeats.includes(seat.seatNumber)) {
//       // Remove seat if already selected
//       onSeatsSelected(selectedSeats.filter(num => num !== seat.seatNumber));
//     } else {
//       // Add seat to selection
//       onSeatsSelected([...selectedSeats, seat.seatNumber]);
//     }
//   };

//   // Simple bus layout configuration
//   const seatsPerRow = 4;
//   const aislePosition = 2; // Aisle after the 2nd seat in each row

//   return (
//     <div className="seat-map">
//       <h3>Select Seats (Bus: {bus.busNumber})</h3>
//       <div className="bus-layout" style={{ 
//         display: 'grid', 
//         gridTemplateColumns: `repeat(${seatsPerRow}, 1fr)`, 
//         gap: '8px',
//         padding: '20px'
//       }}>
//         {bus.seats.map((seat, index) => (
//           <React.Fragment key={seat.seatNumber}>
//             <div 
//               className="seat" 
//               style={{ 
//                 backgroundColor: !seat.available ? 'green' : 
//                                 selectedSeats.includes(seat.seatNumber) ? 'blue' : 'red',
//                 padding: '10px',
//                 borderRadius: '4px',
//                 cursor: seat.available ? 'pointer' : 'not-allowed',
//                 color: 'white',
//                 textAlign: 'center'
//               }}
//               onClick={() => handleSeatClick(seat)}
//             >
//               {seat.seatNumber}
//             </div>
            
//             {/* Add aisle space */}
//             {index % seatsPerRow === aislePosition - 1 && (
//               <div style={{ gridColumn: 'span 1' }}></div>
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//       <div className="seat-legend" style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         gap: '15px', 
//         marginTop: '15px'
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <div style={{ 
//             backgroundColor: 'red', 
//             width: '20px', 
//             height: '20px', 
//             marginRight: '5px',
//             borderRadius: '4px'
//           }}></div>
//           <span>Available</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <div style={{ 
//             backgroundColor: 'green', 
//             width: '20px', 
//             height: '20px', 
//             marginRight: '5px',
//             borderRadius: '4px'
//           }}></div>
//           <span>Booked</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <div style={{ 
//             backgroundColor: 'blue', 
//             width: '20px', 
//             height: '20px', 
//             marginRight: '5px',
//             borderRadius: '4px'
//           }}></div>
//           <span>Selected</span>
//         </div>
//       </div>
//     </div>
//   );
// };

const SeatSelection = ({ bus, onSeatsSelected, selectedSeats }) => {
  const handleSeatClick = (seat) => {
    if (!seat.available) return; // Can't select booked seats
    
    if (selectedSeats.includes(seat.seatNumber)) {
      // Remove seat if already selected
      onSeatsSelected(selectedSeats.filter(num => num !== seat.seatNumber));
    } else {
      // Add seat to selection
      onSeatsSelected([...selectedSeats, seat.seatNumber]);
    }
  };

  // Simple bus layout configuration
  const seatsPerRow = 4;
  const aislePosition = 2; // Aisle after the 2nd seat in each row

  // Handle loading state
  if (!bus) {
    return (
      <div className="seat-map" style={{ textAlign: 'center', padding: '20px' }}>
        <h3>Loading bus details...</h3>
      </div>
    );
  }

  // Handle missing seats data
  if (!bus.seats || bus.seats.length === 0) {
    return (
      <div className="seat-map" style={{ textAlign: 'center', padding: '20px' }}>
        <h3>No seat information available</h3>
        <p>Bus might not have seat configuration or there was an error loading data.</p>
      </div>
    );
  }

  return (
    <div className="seat-map">
      <h3>Select Seats (Bus: {bus.busNumber})</h3>
      <div className="bus-layout" style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${seatsPerRow}, 1fr)`, 
        gap: '8px',
        padding: '20px'
      }}>
        {bus.seats.map((seat, index) => (
          <React.Fragment key={seat.seatNumber || index}>
            <div 
              className="seat" 
              style={{ 
                backgroundColor: !seat.available ? 'green' : 
                                selectedSeats.includes(seat.seatNumber) ? 'blue' : 'red',
                padding: '10px',
                borderRadius: '4px',
                cursor: seat.available ? 'pointer' : 'not-allowed',
                color: 'white',
                textAlign: 'center'
              }}
              onClick={() => handleSeatClick(seat)}
            >
              {seat.seatNumber}
            </div>
            
            {/* Add aisle space */}
            {index % seatsPerRow === aislePosition - 1 && (
              <div style={{ gridColumn: 'span 1' }}></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="seat-legend" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px', 
        marginTop: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            backgroundColor: 'red', 
            width: '20px', 
            height: '20px', 
            marginRight: '5px',
            borderRadius: '4px'
          }}></div>
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            backgroundColor: 'green', 
            width: '20px', 
            height: '20px', 
            marginRight: '5px',
            borderRadius: '4px'
          }}></div>
          <span>Booked</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            backgroundColor: 'blue', 
            width: '20px', 
            height: '20px', 
            marginRight: '5px',
            borderRadius: '4px'
          }}></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  const [searchType, setSearchType] = useState('route'); // 'route' or 'city'
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [city, setCity] = useState('');
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('');
  const { user, login } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let results;
      if (searchType === 'route') {
        results = await api.searchBuses(start, end, city);
      } else {
        results = await api.getBusesByCity(city);
      }
      setBuses(results.data);
    } catch (err) {
      setError('Failed to search buses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSeats = async () => {
  if (!selectedSeats.length) {
    setBookingStatus('Please select at least one seat');
    return;
  }
  
  try {
    const bookingData = {
      busId: selectedBus.id,
      seatNumbers: selectedSeats,
      passengerName: user.name,
      passengerEmail: user.email,
      passengerPhone: user.phoneNumber
    };
    
    await api.createBooking(bookingData);
    setBookingStatus(`Booking successful! Seats ${selectedSeats.join(', ')} confirmed.`);
    
    // Instead of fetching the bus again, update the local state
    const updatedSeats = selectedBus.seats.map(seat => 
      selectedSeats.includes(seat.seatNumber) 
        ? { ...seat, available: false, passengerId: user.id } 
        : seat
    );
    
    setSelectedBus({
      ...selectedBus,
      seats: updatedSeats
    });
    
    // Clear selections after booking
    setTimeout(() => {
      setSelectedSeats([]);
      setBookingStatus('');
    }, 3000);
  } catch (err) {
    setBookingStatus(`Booking failed: ${err.response?.data || 'Please try again'}`);
    console.error(err);
  }
};

  // const handleViewSeats = async (bus) => {
  //   try {
  //     // Get full bus details including seats
  //     const response = await api.getBusById(bus.id);
  //     setSelectedBus(response.data);
  //     setSelectedSeats([]);
  //     setBookingStatus('');
  //   } catch (err) {
  //     setError('Failed to load bus details');
  //     console.error(err);
  //   }
  // };

//   const handleViewSeats = (bus) => {
//   // No need for API call - the bus object already contains seat information
//   setSelectedBus(bus);
//   setSelectedSeats([]);
//   setBookingStatus('');
// };

const handleViewSeats = async (bus) => {
  try {
    // Always fetch the full bus details when viewing seats
    const response = await api.getBusById(bus.id);
    setSelectedBus(response.data);
    setSelectedSeats([]);
    setBookingStatus('');
  } catch (err) {
    setError('Failed to load bus details: ' + (err.response?.data || 'Check network connection'));
    console.error(err);
  }
};

  return (
    <div className="search-page">
      <Card title="Find Your Bus">
        <div style={{ marginBottom: '1rem' }}>
          <button 
            onClick={() => setSearchType('route')}
            style={{ 
              marginRight: '0.5rem',
              backgroundColor: searchType === 'route' ? '#3498db' : '#ecf0f1',
              color: searchType === 'route' ? 'white' : '#2c3e50'
            }}
          >
            Route Search
          </button>
          <button 
            onClick={() => setSearchType('city')}
            style={{ 
              backgroundColor: searchType === 'city' ? '#3498db' : '#ecf0f1',
              color: searchType === 'city' ? 'white' : '#2c3e50'
            }}
          >
            City Search
          </button>
        </div>

        <form onSubmit={handleSearch}>
          {searchType === 'route' ? (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem' }}>
                  City
                </label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  style={{ width: '100%', padding: '0.5rem' }}
                  required
                  placeholder="Enter city (required for route search)"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem' }}>
                  Start Location
                </label>
                <input 
                  type="text" 
                  value={start} 
                  onChange={(e) => setStart(e.target.value)} 
                  style={{ width: '100%', padding: '0.5rem' }}
                  required
                  placeholder="Enter start location"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem' }}>
                  End Location
                </label>
                <input 
                  type="text" 
                  value={end} 
                  onChange={(e) => setEnd(e.target.value)} 
                  style={{ width: '100%', padding: '0.5rem' }}
                  required
                  placeholder="Enter end location"
                />
              </div>
            </>
          ) : (
            // City search form remains the same
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem' }}>
                City
              </label>
              <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                style={{ width: '100%', padding: '0.5rem' }}
                required
                placeholder="Enter city"
              />
            </div>
          )}
          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', padding: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Buses'}
          </button>
        </form>
        
        {error && <p style={{ color: '#e74c3c', marginTop: '1rem' }}>{error}</p>}
      </Card>

      {buses.length > 0 && (
        <Card title="Available Buses">
          {buses.map(bus => (
            <div 
              key={bus.id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '1rem', 
                marginBottom: '1rem',
                borderRadius: '4px'
              }}
            >
              <h3>{bus.busName} ({bus.busNumber})</h3>
              <p>From: {bus.stops[0]?.stopName || 'N/A'} - To: {bus.stops[bus.stops.length-1]?.stopName || 'N/A'}</p>
              <p>Departure: {bus.stops[0]?.departureTime || 'N/A'} | Arrival: {bus.stops[bus.stops.length-1]?.arrivalTime || 'N/A'}</p>
              <button 
                onClick={() => handleViewSeats(bus)}
                className="btn"
                style={{ backgroundColor: '#2ecc71', color: 'white' }}
              >
                View Seats
              </button>
            </div>
          ))}
        </Card>
      )}

      {selectedBus && (
        <Card title="Seat Selection">
          <SeatSelection 
            bus={selectedBus} 
            selectedSeats={selectedSeats}
            onSeatsSelected={setSelectedSeats}
          />
          
          {selectedSeats.length > 0 && (
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <p>Selected seats: {selectedSeats.join(', ')}</p>
              <button 
                onClick={handleBookSeats}
                className="btn"
                style={{ 
                  backgroundColor: '#2980b9', 
                  color: 'white',
                  padding: '0.5rem 1rem'
                }}
              >
                Book Selected Seats
              </button>
            </div>
          )}
          
          {bookingStatus && (
            <p style={{ 
              marginTop: '1rem',
              color: bookingStatus.includes('successful') ? '#27ae60' : '#e74c3c',
              fontWeight: 'bold'
            }}>
              {bookingStatus}
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default SearchPage;