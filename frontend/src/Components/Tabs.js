import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Tabs() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const tabs = [
    { path: '/', label: 'Home' },
    ...(isAuthenticated ? [{ path: '/bookings', label: 'My Bookings' }] : []),
  ];

  return isAdmin? <></>: (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '10px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #eee'
    }}>
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          style={{
            padding: '10px 20px',
            textDecoration: 'none',
            color: location.pathname === tab.path ? '#ff4b5c' : '#333',
            borderBottom: location.pathname === tab.path ? '2px solid #ff4b5c' : 'none',
            margin: '0 10px',
            fontWeight: location.pathname === tab.path ? 'bold' : 'normal'
          }}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

export default Tabs;