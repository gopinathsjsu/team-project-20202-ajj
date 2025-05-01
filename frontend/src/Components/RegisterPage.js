import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import api from '../services/api';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    role: 'CUSTOMER'
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed: ' + (err.response?.data || err.message));
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px'
  };

  const labelStyle = {
    display: 'block',
    textAlign: 'left',
    marginBottom: '5px',
    color: '#666',
    fontSize: '14px'
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

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>
              Full Name <span style={{ color: '#ff4b5c' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>
              Phone Number <span style={{ color: '#666' }}>(Optional)</span>
            </label>
            <PhoneInput
              country={'us'}
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              inputStyle={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>
              Email <span style={{ color: '#ff4b5c' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>
              Password <span style={{ color: '#ff4b5c' }}>*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Role <span style={{ color: '#ff4b5c' }}>*</span>
            </label>
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
          </div>

          <button
            type="submit"
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
            Register
          </button>
        </form>

        <p style={{ fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#ff4b5c', fontWeight: 'bold' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
