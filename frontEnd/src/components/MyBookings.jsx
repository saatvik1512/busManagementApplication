import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import Card from './Card';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.cancelBooking(bookingId);
        alert('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
      } catch (err) {
        alert('Failed to cancel booking: ' + (err.response?.data || err.message));
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container">
      <Card title="My Bookings">
        {bookings.length === 0 ? (
          <p>You don't have any bookings yet.</p>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="list-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>{booking.busName} ({booking.busNumber})</h4>
                    <p>Seats: {booking.seatNumbers.join(', ')}</p>
                    <p>Status: <span style={{ 
                      color: booking.status === 'CONFIRMED' ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>{booking.status}</span></p>
                    <p>Booking Date: {new Date(booking.bookingDate).toLocaleString()}</p>
                  </div>
                  {booking.status === 'CONFIRMED' && (
                    <button 
                      onClick={() => handleCancelBooking(booking.id)}
                      className="btn btn-danger"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MyBookings;