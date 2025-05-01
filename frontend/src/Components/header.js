import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const isLoggedIn = !!token;

  let userInfo = null;
  if (token) {
    try {
      userInfo = jwtDecode(token);
    } catch (e) {
      console.error('Invalid token');
      localStorage.removeItem('jwt');
      navigate("/login");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate("/login");
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
            {userInfo?.role === 'ADMIN' && (
              <Link to="/admin/dashboard">
                <button style={buttonStyle}>Admin Panel</button>
              </Link>
            )}
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          <Link to="/login">
            <button style={buttonStyle}>Sign In</button>
          </Link>
        )}
      </nav>
    </header>
  );
}

const buttonStyle = {
  backgroundColor: '#fff',
  color: '#ff4b5c',
  border: 'none',
  padding: '10px 18px',
  cursor: 'pointer',
  borderRadius: '6px',
  fontWeight: '600',
  marginLeft: '10px'
};

export default Header;
