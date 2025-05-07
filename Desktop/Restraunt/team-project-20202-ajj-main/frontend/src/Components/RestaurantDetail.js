import React, { useEffect, useState, useMemo } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [partySize, setPartySize] = useState(2);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [slotsChecked, setSlotsChecked] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookingCount, setBookingCount] = useState(0);
  const navigate = useNavigate();

  const authHeader = useMemo(() => {
    const token = localStorage.getItem('jwt');
    return { Authorization: `Bearer ${token}` };
  }, []);

  // Fetch restaurant details
  useEffect(() => {
    let mounted = true;
    const fetchRestaurantDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/restaurants/${id}`, {
          headers: authHeader
        });
        if (mounted) setRestaurant(res.data);
      } catch (err) {
        if (mounted) {
          console.error('Error loading restaurant:', err);
          setError('Failed to load restaurant details');
          if (err.response?.status === 403) navigate('/login');
        }
      }
    };
    fetchRestaurantDetails();
    return () => { mounted = false; };
  }, [id, navigate, authHeader]);

  // Fetch today's booking count
  useEffect(() => {
    const fetchBookingCount = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/bookings/count/today', {
          headers: authHeader
        });
        const counts = res.data;
        setBookingCount(counts[id] || 0);
      } catch (err) {
        console.error('Failed to fetch booking count', err);
      }
    };
    fetchBookingCount();
  }, [id, authHeader]);

  // Check availability
  useEffect(() => {
    let mounted = true;
    const checkAvailability = async () => {
      if (!id || !selectedDate || !mounted) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8080/api/bookings/availability', {
          params: { restaurantId: id, date: selectedDate, partySize },
          headers: authHeader
        });
        if (mounted) {
          setAvailableSlots(response.data || []);
          setSlotsChecked(true);
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          console.error('Error checking availability:', error);
          setError('Failed to load available time slots. Please try again later.');
          setAvailableSlots([]);
          setSlotsChecked(true);
          setLoading(false);
          if (error.response?.status === 403) navigate('/login');
        }
      }
    };
    checkAvailability();
    return () => { mounted = false; };
  }, [id, selectedDate, partySize, navigate, authHeader]);

  // Static reviews
  useEffect(() => {
    const staticReviews = {
      1: [
        { customerName: 'John Doe', rating: 5, comment: 'Amazing pasta and cozy ambiance.', createdAt: '2025-05-01' },
        { customerName: 'Emma', rating: 4, comment: 'Great service and tasty garlic bread.', createdAt: '2025-05-02' }
      ],
      2: [
        { customerName: 'Alice', rating: 5, comment: 'Best sushi I’ve had in the city!', createdAt: '2025-05-01' },
        { customerName: 'Bob', rating: 4, comment: 'Fresh and fast, will come again.', createdAt: '2025-05-02' }
      ],
      4: [
        { customerName: 'Mike', rating: 4, comment: 'Juicy burgers and friendly staff.', createdAt: '2025-05-03' }
      ],
      5: [
        { customerName: 'Priya', rating: 5, comment: 'Delicious butter chicken!', createdAt: '2025-05-04' }
      ]
    };
    setReviews(staticReviews[id] || []);
  }, [id]);

  const handleBookingClick = (time) => {
    navigate(`/booking/${id}/${time}/${partySize}/${selectedDate}`);
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
        backgroundImage: `url(${restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'})`,
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
      <p style={{ color: '#38a169', fontWeight: 'bold' }}>
        Booked {bookingCount} {bookingCount === 1 ? 'time' : 'times'} today
      </p>
      {restaurant.description && <p style={{ marginTop: '20px' }}>{restaurant.description}</p>}

      <div style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>Date: </label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={loading}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginRight: '20px' }}
          />
          <label style={{ marginRight: '10px' }}>Party Size: </label>
          <select
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            disabled={loading}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? 'person' : 'people'}
              </option>
            ))}
          </select>
        </div>

        <h3>Available Time Slots</h3>
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
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '10px',
          marginBottom: '25px',
          flexWrap: 'wrap'
        }}>
          {loading ? (
            <p>Loading available time slots...</p>
          ) : slotsChecked && availableSlots.length === 0 ? (
            <p>No available time slots for the selected date and party size.</p>
          ) : (
            availableSlots.map((slot, idx) => (
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
            ))
          )}
        </div>
      </div>

      <h3>Location Map</h3>
      <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          src={
            restaurant.lat && restaurant.lng
              ? `https://www.google.com/maps?q=${restaurant.lat},${restaurant.lng}&z=15&output=embed`
              : `https://www.google.com/maps?q=37.3541,-121.9552&z=15&output=embed`
          }
          allowFullScreen
          title="Restaurant Location"
          style={{ borderRadius: '8px' }}
        ></iframe>
      </div>

      {restaurant.address && <p style={{ color: '#666' }}>{restaurant.address}</p>}

      <h3 style={{ marginTop: '30px', fontSize: '20px' }}>Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p style={{ color: '#777' }}>No reviews yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
          {reviews.map((review, index) => (
            <li key={index} style={{
              backgroundColor: '#f9f9f9',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '12px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}>
              <p style={{ fontWeight: 'bold' }}>{review.customerName}</p>
              <p style={{ color: '#f59e0b' }}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </p>
              <p style={{ marginTop: '4px' }}>{review.comment}</p>
              <p style={{ fontSize: '12px', color: '#888' }}>{review.createdAt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RestaurantDetail;
