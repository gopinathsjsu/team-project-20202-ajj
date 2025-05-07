import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Grid, Paper, Divider, Rating } from '@mui/material';
import Review from './Review';
import api from '../services/api';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [partySize, setPartySize] = useState(2);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [slotsChecked, setSlotsChecked] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  // Get the JWT token and create auth header using useMemo
  const authHeader = useMemo(() => {
    const token = localStorage.getItem('jwt');
    return { Authorization: `Bearer ${token}` };
  }, []);

  // Fetch restaurant details and reviews
  useEffect(() => {
    let mounted = true;

    const fetchRestaurantData = async () => {
      try {
        const [restaurantRes, reviewsRes] = await Promise.all([
          api.get(`/api/restaurants/${id}`),
          api.get(`/api/restaurants/${id}/reviews`)
        ]);
        
        if (mounted) {
          setRestaurant(restaurantRes.data);
          setReviews(reviewsRes.data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error loading restaurant data:', err);
          setError('Failed to load restaurant details');
          if (err.response?.status === 403) {
            navigate('/login');
          }
        }
      }
    };

    fetchRestaurantData();

    return () => {
      mounted = false;
    };
  }, [id, navigate, authHeader]);

  // Check availability for the selected date and party size
  useEffect(() => {
    let mounted = true;
    
    const checkAvailability = async () => {
      if (!id || !selectedDate || !mounted) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/bookings/availability`, {
          params: {
            restaurantId: id,
            date: selectedDate,
            partySize
          },
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
          if (error.response?.status === 403) {
            navigate('/login');
          }
        }
      }
    };

    checkAvailability();

    return () => {
      mounted = false;
    };
  }, [id, selectedDate, partySize, navigate, authHeader]);

  const handleBookingClick = (time) => {
    navigate(`/booking/${id}/${time}/${partySize}/${selectedDate}`);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!restaurant) {
    return <Typography>Restaurant not found</Typography>;
  }

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Restaurant Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {restaurant.name}
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Rating value={averageRating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({reviews.length} reviews)
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {restaurant.cuisine} • {restaurant.priceRange}
            </Typography>
            <Typography variant="body1" paragraph>
              {restaurant.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {restaurant.location}
            </Typography>
          </Paper>

          {/* Booking Section */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Make a Reservation
            </Typography>
            <Box sx={{ mb: 3 }}>
              <label style={{ marginRight: '10px' }}>Date: </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={loading}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  marginRight: '20px'
                }}
              />
              <label style={{ marginRight: '10px' }}>Party Size: </label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                disabled={loading}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Available Time Slots
            </Typography>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {loading ? (
                <Typography>Loading available time slots...</Typography>
              ) : slotsChecked && availableSlots.length === 0 ? (
                <Typography>No available time slots for the selected date and party size.</Typography>
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
            </Box>
          </Paper>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Reviews
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {reviews.length === 0 ? (
              <Typography color="text.secondary">No reviews yet</Typography>
            ) : (
              reviews.map((review) => (
                <Review key={review.id} review={review} />
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Restaurant Image and Map */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <div style={{
              height: '300px',
              backgroundImage: `url(${restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '10px'
            }}></div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <div style={{
              height: '300px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps?q=${restaurant.lat},${restaurant.lng}&z=15&output=embed`}
                allowFullScreen
                title="Restaurant Location"
                style={{ borderRadius: '8px' }}
              ></iframe>
            </div>
            {restaurant.address && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {restaurant.address}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default RestaurantDetail;
