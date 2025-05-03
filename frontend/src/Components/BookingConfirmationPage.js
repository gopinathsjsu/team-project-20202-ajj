import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingConfirmationPage() {
  const { restaurantId, time, partySize, date } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [specialRequest, setSpecialRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/restaurants/${restaurantId}`)
      .then(res => setRestaurant(res.data))
      .catch(err => {
        console.error('Failed to load restaurant', err);
        setError('Failed to load restaurant details');
      });
  }, [restaurantId]);

  // Check availability before showing confirmation
  useEffect(() => {
    if (restaurant) {
      axios.get(`http://localhost:8080/api/bookings/availability`, {
        params: {
          restaurantId,
          date,
          time,
          partySize
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(res => {
        if (!res.data) {
          setError('This time slot is no longer available. Please choose another time.');
        }
      })
      .catch(err => {
        console.error('Failed to check availability', err);
        setError('Failed to verify availability');
      });
    }
  }, [restaurant, restaurantId, time, partySize, date]);

  const handleReservation = () => {
    setLoading(true);
    setError('');

    const bookingData = {
      restaurantId: Number(restaurantId),
      date,
      time,
      partySize: Number(partySize),
      specialRequest
    };

    axios.post('http://localhost:8080/api/bookings', bookingData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    })
      .then(() => {
        navigate('/bookings');
      })
      .catch(err => {
        setError(err.response?.data || 'Failed to create reservation');
        setLoading(false);
      });
  };

  if (!restaurant) return <p>Loading reservation details...</p>;

  return (
    <div className="reservation-page" style={{ maxWidth: '700px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '12px' }}>
      <h2>Confirm Your Reservation</h2>

      {error && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <img
          src={restaurant.imageUrl || 'https://source.unsplash.com/featured/?restaurant'}
          alt={restaurant.name}
          style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div>
          <h3 style={{ margin: 0 }}>{restaurant.name}</h3>
          <p style={{ margin: '5px 0' }}>{date}</p>
          <p style={{ margin: '5px 0' }}>{time} · {partySize} people</p>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="specialRequest" style={{ display: 'block', marginBottom: '8px' }}>
          Special requests (optional):
        </label>
      <textarea
          id="specialRequest"
        value={specialRequest}
        onChange={(e) => setSpecialRequest(e.target.value)}
        rows="3"
        placeholder="Add any special requests..."
          style={{ 
            width: '100%', 
            padding: '10px', 
            borderRadius: '6px', 
            border: '1px solid #ccc',
            marginBottom: '20px'
          }}
        />
      </div>

        <button
          onClick={handleReservation}
        disabled={loading || error}
          style={{
          backgroundColor: loading || error ? '#ccc' : '#ff4b5c',
            color: 'white',
            padding: '14px',
            width: '100%',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
          cursor: loading || error ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
        {loading ? 'Processing...' : 'Complete Reservation'}
        </button>
    </div>
  );
}

export default BookingConfirmationPage;
