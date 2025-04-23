import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './ReservationPage.css'; // Import the updated CSS

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ReservationPage() {
  const query = useQuery();
  const [results, setResults] = useState([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const searchQuery = query.get('search');
  const date = query.get('date');
  const time = query.get('time');
  const people = query.get('people');

  useEffect(() => {
    if (searchQuery) {
      axios
        .get(`http://localhost:8080/api/restaurants?search=${searchQuery}`)
        .then((response) => {
          setResults(response.data);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
        });
    }
  }, [searchQuery]);

  const handleReservation = (restaurantId) => {
    const bookingData = {
      restaurantId,
      customerName: customerName || 'John Doe', // fallback if empty
      date,
      time,
    };

    axios
      .post('http://localhost:8080/api/bookings', bookingData)
      .then((response) => {
        console.log('Reservation successful:', response.data);
        alert('Reservation successful!');
      })
      .catch((error) => {
        console.error('Error making reservation:', error);
        alert('Failed to make reservation.');
      });
  };

  return (
    <div className="reservation-section reservation-page">
      <h2>Reservations for: {searchQuery}</h2>
      <p>Date: {date} | Time: {time || 'N/A'} | People: {people}</p>

      <ul className="reservation-list">
        {results.map((restaurant) => (
          <li key={restaurant.id} className="restaurant-card">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.cuisine} - {restaurant.location}</p>
            <button onClick={() => handleReservation(restaurant.id)}>
              Make a Reservation
            </button>
          </li>
        ))}
      </ul>

      <div className="booking-form">
        <input
          type="text"
          placeholder="Restaurant ID"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input type="date" defaultValue={date} />
        <input type="time" defaultValue={time} />
        <button onClick={() => handleReservation(restaurantId)}>
          Create Booking
        </button>
      </div>
    </div>
  );
}

export default ReservationPage;
