import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/api/bookings');
        setBookings(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Error loading bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/bookings/${id}`);
      setBookings(bookings.filter(booking => booking.id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('Error canceling booking. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        Loading bookings...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#ff4b5c', marginBottom: '20px' }}>Your Bookings</h2>
      
      {error && (
        <div style={{
          color: '#ff4b5c',
          padding: '10px',
          backgroundColor: '#ffe5e5',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {!error && bookings.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>
          No bookings found.
        </p>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {bookings.map(booking => (
          <div
            key={booking.id}
            style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                {booking.customerName}
              </h3>
              <p style={{ margin: '0', color: '#666' }}>
                {booking.date} at {booking.time}
              </p>
            </div>
            <button
              onClick={() => handleDelete(booking.id)}
              style={{
                backgroundColor: '#ff4b5c',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingList;