import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/restaurants/${id}`)
      .then((res) => setRestaurant(res.data))
      .catch((err) => console.error('Error loading restaurant:', err));
  }, [id]);

  const handleBookingClick = (time) => {
    const partySize = 2; // You can get this from state or props if needed
    navigate(`/booking/${id}/${time}/${partySize}`);
  };

  if (!restaurant) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Loading restaurant details...</p>;
  }

  return (
    <div style={{
      backgroundColor: 'white',
      maxWidth: '900px',
      margin: '20px auto',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        height: '300px',
        backgroundImage: `url(${restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '10px',
        marginBottom: '25px'
      }}></div>

      <h1 style={{ fontSize: '32px', color: '#222', marginBottom: '12px' }}>{restaurant.name}</h1>
      <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
      <p><strong>Location:</strong> {restaurant.location}</p>
      <p><strong>Rating:</strong> {restaurant.rating} ⭐</p>
      <p><strong>Price Range:</strong> {restaurant.priceRange || '$$'}</p>
      {restaurant.description && <p style={{ marginTop: '20px' }}>{restaurant.description}</p>}

      <h3 style={{ marginTop: '30px' }}>Available Booking Times</h3>
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '10px',
        marginBottom: '25px',
        flexWrap: 'wrap'
      }}>
        {['11:15 PM', '11:30 PM'].map((slot, idx) => (
          <button
            key={idx}
            onClick={() => handleBookingClick(slot)}
            style={{
              padding: '10px 18px',
              backgroundColor: '#ff4b5c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            {slot}
          </button>
        ))}
      </div>

      <h3>Location Map</h3>
      <div style={{
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '10px'
      }}>
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          src={`https://www.google.com/maps?q=${restaurant.lat || 37.3541},${restaurant.lng || -121.9552}&z=15&output=embed`}
          allowFullScreen
          title="Restaurant Location"
          style={{ borderRadius: '8px' }}
        ></iframe>
      </div>

      {restaurant.address && <p style={{ color: '#666' }}>{restaurant.address}</p>}
    </div>
  );
}

export default RestaurantDetail;
