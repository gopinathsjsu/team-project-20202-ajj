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
        const cuisine = searchParams.get("cuisine");

        const response = await api.get("/api/restaurants/search", {
          params: { date, time, partySize, location, cuisine }
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

  const generateTimeSlots = (baseTime) => {
    // Parse the base time (e.g., "7:00 PM")
    const [time, period] = baseTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;

    // Generate slots 30 minutes before and after
    const slots = [];
    for (let i = -30; i <= 30; i += 15) {
      const slotTime = new Date();
      slotTime.setHours(hour24);
      slotTime.setMinutes(minutes);
      slotTime.setMinutes(slotTime.getMinutes() + i);

      const slotHour = slotTime.getHours() % 12 || 12;
      const slotMinutes = slotTime.getMinutes().toString().padStart(2, '0');
      const slotPeriod = slotTime.getHours() >= 12 ? 'PM' : 'AM';
      
      slots.push(`${slotHour}:${slotMinutes} ${slotPeriod}`);
    }
    
    return slots;
  };

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
              {generateTimeSlots(searchParams.get("time") || "7:00 PM").map((slot, i) => (
                <button
                  key={i}
                  className="time-slot"
                  onClick={() => handleTimeClick(restaurant.id, slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default RestaurantList;
