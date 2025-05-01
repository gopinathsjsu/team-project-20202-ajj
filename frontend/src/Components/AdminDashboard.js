import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './AdminDashboard.css';

function AdminDashboard() {
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      navigate('/login');
      return;
    }

    const { role } = jwtDecode(token);
    if (role !== 'ADMIN') {
      navigate('/');
      return;
    }

    axios.get('http://localhost:8080/api/admin/pending-restaurants', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPendingRestaurants(res.data))
    .catch(err => console.error('Error fetching pending restaurants:', err));

    axios.get('http://localhost:8080/api/admin/reservation-analytics', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAnalytics(res.data))
    .catch(err => console.error('Error fetching analytics:', err));
  }, [navigate]);

  const approveRestaurant = (id) => {
    const token = localStorage.getItem('jwt');
    axios.post(`http://localhost:8080/api/admin/approve-restaurant/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('Restaurant approved!');
      setPendingRestaurants(prev => prev.filter(r => r.id !== id));
    })
    .catch(err => console.error('Error approving restaurant:', err));
  };

  const deleteRestaurant = (id) => {
    const token = localStorage.getItem('jwt');
    axios.delete(`http://localhost:8080/api/admin/restaurant/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('Restaurant deleted!');
      setPendingRestaurants(prev => prev.filter(r => r.id !== id));
    })
    .catch(err => console.error('Error deleting restaurant:', err));
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Pending Restaurant Approvals</h3>
        {pendingRestaurants.length === 0 ? (
          <p>No pending restaurants.</p>
        ) : (
          pendingRestaurants.map((r) => (
            <div key={r.id} className="pending-restaurant">
              <strong>{r.name}</strong>
              <span>{r.location} ({r.cuisine})</span>
              <div className="action-buttons">
                <button className="approve" onClick={() => approveRestaurant(r.id)}>Approve</button>
                <button className="delete" onClick={() => deleteRestaurant(r.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </section>

      <section>
        <h3>Reservation Analytics (Last Month)</h3>
        <div className="analytics-summary">
          Total Reservations: <strong>{analytics.totalBookings || 0}</strong>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
