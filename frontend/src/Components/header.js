import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const buttonStyle = {
    backgroundColor: 'transparent',
    border: '2px solid white',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    marginLeft: '10px',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: 'white',
    color: '#ff4b5c',
  };

  return (
    <header style={{
      backgroundColor: 'rgba(255, 75, 92, 0.95)',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
    }}>
      {/* Logo link */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 style={{
          margin: 0,
          color: '#fff',
          fontSize: '26px',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          🍽️ OpenTable
        </h1>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated && user ? (
          <>
            <span style={{ color: '#fff', marginRight: '20px' }}>
              Welcome, <strong>{user.name}</strong>
            </span>
            
            {isAdmin ? (
              <>
                <Link 
                  to="/admin/dashboard" 
                  style={{ 
                    ...buttonStyle,
                    textDecoration: 'none',
                    ':hover': buttonHoverStyle 
                  }}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/analytics" 
                  style={{ 
                    ...buttonStyle,
                    textDecoration: 'none',
                    ':hover': buttonHoverStyle 
                  }}
                >
                  Analytics
                </Link>
              </>
            ) : (
              <Link 
                to="/bookings" 
                style={{ 
                  ...buttonStyle,
                  textDecoration: 'none',
                  ':hover': buttonHoverStyle 
                }}
              >
                My Bookings
              </Link>
            )}
            
            <button 
              onClick={handleLogout} 
              style={buttonStyle}
              onMouseEnter={e => Object.assign(e.target.style, buttonHoverStyle)}
              onMouseLeave={e => Object.assign(e.target.style, buttonStyle)}
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            style={{ 
              ...buttonStyle,
              textDecoration: 'none',
              ':hover': buttonHoverStyle 
            }}
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
