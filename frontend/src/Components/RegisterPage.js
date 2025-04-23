import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'CUSTOMER'
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8080/auth/register', formData, {
        headers: { 'Content-Type': 'application/json' } // ✅ Explicitly set headers
      });
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error(err); // ✅ log full error in dev console
      alert('Registration failed: ' + (err.response?.data || err.message));
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
        <h2 style={{ marginBottom: '20px', color: '#ff4b5c' }}>Create an Account</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="MANAGER">Restaurant Manager</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          onClick={handleRegister}
          style={buttonStyle}
        >
          Register
        </button>

        <p style={{ fontSize: '14px', marginTop: '15px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#ff4b5c', fontWeight: 'bold' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '16px'
};

const buttonStyle = {
  backgroundColor: '#ff4b5c',
  color: '#fff',
  fontWeight: 'bold',
  padding: '12px 20px',
  width: '100%',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer'
};

export default RegisterPage;
