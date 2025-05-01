import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BookingConfirmationPage() {
  const { restaurantId, time, partySize } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [specialRequest, setSpecialRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/restaurants/${restaurantId}`)
      .then(res => setRestaurant(res.data))
      .catch(err => console.error('Failed to load restaurant', err));
  }, [restaurantId]);

  const handleReservation = () => {
    const bookingData = {
      restaurantId,
      time,
      partySize,
      specialRequest,
      date: new Date().toISOString().split('T')[0] // Using today's date for simplicity
    };

    axios.post('http://localhost:8080/api/bookings', bookingData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    })
      .then(() => {
        alert('Reservation confirmed!');
        navigate('/bookings');
      })
      .catch(err => {
        alert('Error creating reservation: ' + (err.response?.data || err.message));
        console.error(err);
      });
  };

  if (!restaurant) return <p>Loading reservation details...</p>;

  return (
    <div className="reservation-page" style={{ maxWidth: '700px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '12px' }}>
      <h2>Confirm Your Reservation</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <img
          src={restaurant.imageUrl || 'https://source.unsplash.com/featured/?restaurant'}
          alt={restaurant.name}
          style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div>
          <h3 style={{ margin: 0 }}>{restaurant.name}</h3>
          <p>{time} · {partySize} people</p>
        </div>
      </div>

      <p style={{ marginTop: '15px' }}>Special request (optional):</p>
      <textarea
        value={specialRequest}
        onChange={(e) => setSpecialRequest(e.target.value)}
        rows="3"
        placeholder="Add any special requests..."
        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
      ></textarea>

      <button
        onClick={handleReservation}
        style={{
          backgroundColor: '#ff4b5c',
          color: 'white',
          padding: '14px',
          width: '100%',
          marginTop: '24px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Complete Reservation
      </button>
    </div>
  );
}

export default BookingConfirmationPage;
