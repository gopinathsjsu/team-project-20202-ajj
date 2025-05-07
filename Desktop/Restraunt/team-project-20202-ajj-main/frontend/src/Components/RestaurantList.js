import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import backgroundImage from '../assets/background.jpg'; // ✅ imported background
import './RestaurantList.css'; // ✅ make sure this file contains the CSS below

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation(); // for triggering useEffect on page return

  // 🟡 Step 1: Fetch restaurants based on search
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const date = searchParams.get("date");
        const time = searchParams.get("time");
        const partySize = searchParams.get("partySize");
        const location = searchParams.get("location");

        const res = await api.get("/api/restaurants/search", {
          params: { date, time, partySize, location }
        });

        setRestaurants(res.data || []);
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

  // 🟡 Step 2: Fetch today's booking counts whenever location changes (e.g. after booking)
  useEffect(() => {
    const fetchBookingCounts = async () => {
      try {
        const res = await api.get("/api/bookings/count/today", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        setBookingCounts(res.data || {});
      } catch (err) {
        console.error("Failed to fetch booking counts:", err);
      }
    };

    fetchBookingCounts();
  }, [location]);

  const handleTimeClick = (restaurantId, time) => {
    const partySize = searchParams.get("partySize") || "1";
    const date = searchParams.get("date");
    navigate(`/booking/${restaurantId}/${time}/${partySize}/${date}`);
  };

  if (loading) return <div className="loading">Loading restaurants...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="restaurant-page-wrapper">
      <div
        className="blur-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

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
                  Booked {bookingCounts[restaurant.id] || 0} times today
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {restaurant.availableTimeSlots && restaurant.availableTimeSlots.length > 0 ? (
                  restaurant.availableTimeSlots.map((slot, i) => (
                    <button
                      key={i}
                      className="time-slot"
                      onClick={() => handleTimeClick(restaurant.id, slot)}
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <p>No available time slots for the selected criteria.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RestaurantList;
