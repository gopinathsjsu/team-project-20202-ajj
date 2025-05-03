import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/api/admin/analytics');
      setAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load analytics data');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!analytics) return null;

  // Convert data for charts
  const dateData = Object.entries(analytics.reservationsByDate || {}).map(([date, count]) => ({
    date,
    reservations: count
  })).sort((a, b) => a.date.localeCompare(b.date));

  const timeData = Object.entries(analytics.reservationsByTimeSlot || {}).map(([time, count]) => ({
    time,
    reservations: count
  })).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="analytics-dashboard">
      <h2>Reservation Analytics</h2>
      
      <div className="analytics-summary">
        <div className="analytics-card">
          <h3>Total Reservations</h3>
          <p className="analytics-number">{analytics.totalReservations}</p>
        </div>
        <div className="analytics-card">
          <h3>Average Party Size</h3>
          <p className="analytics-number">{analytics.averagePartySize.toFixed(1)}</p>
        </div>
      </div>

      <div className="analytics-chart">
        <h3>Reservations by Date</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="reservations" stroke="#ff4b5c" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-chart">
        <h3>Popular Time Slots</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reservations" fill="#ff4b5c" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="top-restaurants">
        <h3>Top Performing Restaurants</h3>
        <div className="restaurant-stats">
          {analytics.topRestaurants.map((restaurant, index) => (
            <div key={index} className="restaurant-stat-card">
              <h4>{restaurant.name}</h4>
              <p>Total Bookings: {restaurant.bookings}</p>
              <p>Avg Party Size: {restaurant.averagePartySize.toFixed(1)}</p>
              <p>Popular Time: {restaurant.popularTimeSlot}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard; 