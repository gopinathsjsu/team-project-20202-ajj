import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const date = searchParams.get("date");
        const time = searchParams.get("time");
        const partySize = searchParams.get("partySize");
        const location = searchParams.get("location");

        const response = await api.get("/api/restaurants/search", {
          params: { date, time, partySize, location }
        });
        
        setRestaurants(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setError("Failed to load restaurants. Please try again.");
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams]);

  const handleTimeClick = (restaurantId, time) => {
    const partySize = searchParams.get("partySize") || "1";
    const date = searchParams.get("date");
    navigate(`/booking/${restaurantId}/${time}/${partySize}/${date}`);
  };

  if (loading) return <div className="loading">Loading restaurants...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurant-list">
      {restaurants.length === 0 ? (
        <div className="no-results">
          <p>No restaurants available for the selected criteria.</p>
          <p>Try adjusting your search parameters or selecting a different time.</p>
        </div>
      ) : (
        restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <div onClick={() => navigate(`/restaurant/${restaurant.id}`)} style={{ cursor: 'pointer' }}>
              <img
                src={restaurant.imageUrl || 'https://source.unsplash.com/400x250/?restaurant,food'}
                alt={restaurant.name}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              />
              <h2>{restaurant.name}</h2>
              <p>{restaurant.cuisine} · {restaurant.location}</p>
              <p>⭐ {restaurant.rating || '4.5'} / 5</p>
              <p style={{ fontSize: '14px', color: '#888' }}>
                Booked {restaurant.bookedCountToday || 0} times today
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {restaurant.availableTimeSlots && restaurant.availableTimeSlots.map((slot, i) => (
                <button
                  key={i}
                  className="time-slot"
                  onClick={() => handleTimeClick(restaurant.id, slot)}
                >
                  {slot}
                </button>
              ))}
              {(!restaurant.availableTimeSlots || restaurant.availableTimeSlots.length === 0) && (
                <p>No available time slots for the selected criteria.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default RestaurantList;
