import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReservationBox from './ReservationBox';
import './RestaurantDetail.css';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/restaurants/${id}`)
      .then((res) => setRestaurant(res.data))
      .catch((err) => console.error('Error loading restaurant:', err));
  }, [id]);

  if (!restaurant) {
    return <p className="loading-text">Loading restaurant details...</p>;
  }

  return (
    <div className="restaurant-page-container">
      <div className="restaurant-page-content">
        {/* Left Section: Restaurant Info */}
        <div className="restaurant-details">
          <div
            className="restaurant-banner"
            style={{
              backgroundImage: `url(${restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&w=1000&q=80'})`
            }}
          ></div>

          <h1 className="restaurant-name">{restaurant.name}</h1>
          <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
          <p><strong>Location:</strong> {restaurant.location}</p>
          <p><strong>Rating:</strong> {restaurant.rating} ⭐</p>
          <p><strong>Price Range:</strong> {restaurant.priceRange || '$$'}</p>
          {restaurant.description && (
            <p className="restaurant-description">{restaurant.description}</p>
          )}

          <h3 className="section-heading">Location Map</h3>
          <div className="map-container">
            <iframe
              width="100%"
              height="300"
              frameBorder="0"
              src={`https://www.google.com/maps?q=${restaurant.lat || 37.3541},${restaurant.lng || -121.9552}&z=15&output=embed`}
              allowFullScreen
              title="Restaurant Location"
            ></iframe>
          </div>

          {restaurant.address && <p className="restaurant-address">{restaurant.address}</p>}
        </div>

        {/* Right Section: Reservation Box */}
        <div className="reservation-box-wrapper">
          <ReservationBox />
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetail;
