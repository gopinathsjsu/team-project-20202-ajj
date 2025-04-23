import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8080/auth/login', {
        email,
        password
      });

      const token = res.data;
      localStorage.setItem('jwt', token);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '40px 50px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#ff4b5c' }}>Login to BookTable</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            backgroundColor: '#ff4b5c',
            color: '#fff',
            fontWeight: 'bold',
            padding: '12px 20px',
            width: '100%',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Login
        </button>

        <p style={{ fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#ff4b5c', fontWeight: 'bold' }}>
            Create one
          </Link>
        </p>

        <p style={{ fontSize: '14px', marginTop: '10px' }}>
          <Link to="#" style={{ color: '#888' }}>
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
