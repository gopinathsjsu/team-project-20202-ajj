import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
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

      <nav>
        {isAuthenticated && user ? (
          <>
            <span style={{ marginRight: '20px', color: '#fff' }}>
              Welcome, <strong>{user.name}</strong>
            </span>
            {user.role === 'MANAGER' && (
              <button onClick={() => window.location.href = "/manager/dashboard"} style={{ marginRight: '10px' }}>
                Manager Dashboard
              </button>
            )}
            {user.role === 'ADMIN' && (
              <button onClick={() => window.location.href = "/admin/dashboard"} style={{ marginRight: '10px' }}>
                Admin Panel
              </button>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => window.location.href = "/login"}>Sign In</button>
        )}
      </nav>
    </header>
  );
}

export default Header;
