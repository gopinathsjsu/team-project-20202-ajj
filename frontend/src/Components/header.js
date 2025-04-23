import React from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Header() {
  const token = localStorage.getItem('jwt');
  const isLoggedIn = !!token;

  let userInfo = null;
  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (e) {
      console.error('Invalid token');
      localStorage.removeItem('jwt');
      window.location.href = "/login";
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('jwt');
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
        {isLoggedIn ? (
          <>
            <span style={{ marginRight: '20px', color: '#fff' }}>
              Logged in as <strong>{userInfo?.role}</strong>
            </span>
            {userInfo?.role === 'MANAGER' && (
              <button onClick={() => window.location.href = "/manager/dashboard"} style={{ marginRight: '10px' }}>
                Manager Dashboard
              </button>
            )}
            {userInfo?.role === 'ADMIN' && (
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
