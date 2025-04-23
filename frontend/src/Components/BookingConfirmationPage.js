import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function BookingConfirmationPage() {
  const { restaurantId, time, partySize } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/restaurants/${restaurantId}`)
      .then(res => setRestaurant(res.data))
      .catch(err => console.error('Failed to load restaurant', err));
  }, [restaurantId]);

  const getFormattedPhone = () => phone.replace(/\D/g, '');

  const sendOtp = () => {
    const formattedPhone = getFormattedPhone();
    if (!formattedPhone) return alert('Enter a valid phone number');

    setLoading(true);
    axios.post(`http://localhost:8080/api/otp/send?phoneNumber=${formattedPhone}`)
      .then(() => {
        setOtpSent(true);
        alert(`OTP sent to ${formattedPhone}`);
      })
      .catch(() => alert('Failed to send OTP'))
      .finally(() => setLoading(false));
  };

  const verifyOtp = () => {
    const formattedPhone = getFormattedPhone();
    if (!otp) return alert('Enter the OTP');

    axios.post(`http://localhost:8080/api/otp/verify?phoneNumber=${formattedPhone}&otp=${otp}`)
      .then(() => {
        setOtpVerified(true);
        alert('OTP verified! You can now complete your reservation.');
      })
      .catch(() => alert('Invalid OTP'));
  };

  const handleReservation = () => {
    const bookingData = {
      restaurantId,
      customerPhone: getFormattedPhone(),
      customerEmail: email,
      time,
      partySize,
      specialRequest,
    };

    axios.post('http://localhost:8080/api/bookings', bookingData)
      .then(() => {
        alert('Reservation confirmed!');
        navigate('/');
      })
      .catch(err => {
        alert('Error creating reservation');
        console.error(err);
      });
  };

  if (!restaurant) return <p>Loading reservation details...</p>;

  return (
    <div className="reservation-page" style={{ maxWidth: '700px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '12px' }}>
      <h2>You're almost done!</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <img
          src={restaurant.imageUrl || 'https://source.unsplash.com/featured/?restaurant'}
          alt={restaurant.name}
          style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div>
          <h3 style={{ margin: 0 }}>{restaurant.name}</h3>
          <p>{time} · {partySize} people</p>
        </div>
      </div>

      <p style={{ marginBottom: '6px' }}>Phone number (required):</p>
      <PhoneInput
        country={'us'}
        value={phone}
        onChange={setPhone}
        inputStyle={{ width: '100%' }}
        disabled={otpSent}
      />

      {!otpSent ? (
        <button
          onClick={sendOtp}
          disabled={loading}
          style={{
            marginTop: '10px',
            backgroundColor: '#ff4b5c',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      ) : (
        <>
          <p style={{ marginTop: '15px' }}>Enter verification code:</p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          {!otpVerified && (
            <button
              onClick={verifyOtp}
              style={{
                marginTop: '10px',
                backgroundColor: '#333',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Verify OTP
            </button>
          )}
        </>
      )}

      <p style={{ marginTop: '15px' }}>Use email instead (optional):</p>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
      />

      <p style={{ marginTop: '15px' }}>Special request (optional):</p>
      <textarea
        value={specialRequest}
        onChange={(e) => setSpecialRequest(e.target.value)}
        rows="3"
        placeholder="Add any special requests..."
        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
      ></textarea>

      {otpVerified && (
        <button
          onClick={handleReservation}
          className="complete-reservation-button"
          style={{
            backgroundColor: '#ff4b5c',
            color: 'white',
            padding: '14px',
            width: '100%',
            marginTop: '24px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Complete Reservation
        </button>
      )}
    </div>
  );
}

export default BookingConfirmationPage;
