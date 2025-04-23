import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const partySize = searchParams.get("partySize");
    const location = searchParams.get("location");
    const cuisine = searchParams.get("cuisine");

    if (date && time && partySize) {
      axios.get("http://localhost:8080/api/restaurants/search", {
        params: { date, time, partySize, location, cuisine }
      })
      .then(res => setRestaurants(res.data))
      .catch(err => console.error("Search failed", err));
    } else {
      axios.get("http://localhost:8080/api/restaurants")
        .then((res) => setRestaurants(res.data))
        .catch((err) => console.error('Error fetching restaurants:', err));
    }
  }, [searchParams]);

  const generateTimeSlots = () => ['5:30 PM', '5:45 PM', '6:00 PM'];

  const handleTimeClick = (restaurantId, time) => {
    const partySize = searchParams.get("partySize") || 2;
    navigate(`/booking/${restaurantId}/${time}/${partySize}`);
  };

  return (
    <div className="restaurant-list">
      {restaurants.length === 0 ? (
        <p>No restaurants available.</p>
      ) : (
        restaurants.map((restaurant) => {
          console.log("Image URL for", restaurant.name, ":", restaurant.imageUrl); // ✅ Debug line

          return (
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
                {generateTimeSlots().map((slot, i) => (
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
          );
        })
      )}
    </div>
  );
}

export default RestaurantList;
