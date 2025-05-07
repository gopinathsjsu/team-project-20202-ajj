import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const authHeader = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [activeTab]);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/restaurants/${activeTab}`,
        authHeader
      );
      setRestaurants(response.data);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to load restaurants');
      if (err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (restaurantId, action) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/restaurants/${restaurantId}/${action}`,
        {},
        authHeader
      );
      fetchRestaurants();
    } catch (err) {
      console.error(`Error ${action} restaurant:`, err);
      setError(`Failed to ${action} restaurant`);
    }
  };

  const getStatusActions = (restaurant) => {
    switch (activeTab) {
      case 'pending':
        return (
          <button
            onClick={() => handleStatusUpdate(restaurant.id, 'approve')}
            style={buttonStyle('#4CAF50')}
          >
            Approve
          </button>
        );
      case 'approved':
        return (
          <button
            onClick={() => handleStatusUpdate(restaurant.id, 'archive')}
            style={buttonStyle('#f44336')}
          >
            Archive
          </button>
        );
      case 'archived':
        return (
          <button
            onClick={() => handleStatusUpdate(restaurant.id, 'restore')}
            style={buttonStyle('#2196F3')}
          >
            Restore
          </button>
        );
      default:
        return null;
    }
  };

  const buttonStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer'
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <h1>Restaurant Management</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={tabStyle(activeTab === 'pending')}
        >
          Pending Approval
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          style={tabStyle(activeTab === 'approved')}
        >
          Approved
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          style={tabStyle(activeTab === 'archived')}
        >
          Archived
        </button>
      </div>

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

      {loading ? (
        <p>Loading restaurants...</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {restaurants.map(restaurant => (
            <div
              key={restaurant.id}
              style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <img
                src={restaurant.imageUrl || 'https://via.placeholder.com/300x200?text=Restaurant'}
                alt={restaurant.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}
              />
              <h3 style={{ margin: '0 0 10px 0' }}>{restaurant.name}</h3>
              <p style={{ margin: '5px 0' }}><strong>Cuisine:</strong> {restaurant.cuisine}</p>
              <p style={{ margin: '5px 0' }}><strong>Location:</strong> {restaurant.location}</p>
              <p style={{ margin: '5px 0' }}><strong>Rating:</strong> {restaurant.rating} ⭐</p>

              <div style={{ marginTop: '15px' }}>
                {getStatusActions(restaurant)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const tabStyle = (isActive) => ({
  backgroundColor: isActive ? '#ff4b5c' : '#f0f0f0',
  color: isActive ? 'white' : 'black',
  border: 'none',
  padding: '10px 20px',
  marginRight: '10px',
  borderRadius: '4px',
  cursor: 'pointer'
});

export default AdminDashboard;
