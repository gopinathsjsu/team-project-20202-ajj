import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get the JWT token
  const token = localStorage.getItem('jwt');
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/api/bookings');
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings');
      setLoading(false);
      // if (err.response?.status === 403) {
      //   navigate('/login');
      // }
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.delete(`/api/bookings/${bookingId}`);
      // Refresh the bookings list after cancellation
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking');
      if (err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Loading your bookings...</p>;
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        margin: '20px',
        backgroundColor: '#ffebee',
        color: '#c62828',
        borderRadius: '4px'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h2>Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>You don't have any bookings yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{booking.restaurant.name}</h3>
              <p style={{ margin: '5px 0' }}>Date: {booking.date}</p>
              <p style={{ margin: '5px 0' }}>Time: {booking.time}</p>
              <p style={{ margin: '5px 0' }}>Party Size: {booking.partySize}</p>
              {booking.specialRequest && (
                <p style={{ margin: '5px 0' }}>Special Request: {booking.specialRequest}</p>
              )}
              <button
                onClick={() => handleCancelBooking(booking.id)}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#ff4b5c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingList;