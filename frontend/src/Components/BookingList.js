import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BookingList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/bookings')
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/bookings/${id}`)
      .then(() => {
        setBookings(bookings.filter(booking => booking.id !== id));
      })
      .catch(error => {
        console.error('Error deleting booking:', error);
      });
  };

  return (
    <div>
      <h2> </h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            {booking.customerName} - {booking.date} at {booking.time}
            <button onClick={() => handleDelete(booking.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookingList;