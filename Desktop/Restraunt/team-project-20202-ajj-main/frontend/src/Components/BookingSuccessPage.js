import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function BookingSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { restaurantName, date, time, partySize } = state || {};

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
      <h1>Booking Confirmation</h1>
      <div style={{ fontSize: '40px', marginBottom: '20px' }}>✅</div>
      <p>Your reservation is confirmed!</p>

      <div style={{
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '20px',
        margin: '30px 0'
      }}>
        <h2>{restaurantName}</h2>
        <p>{date} @ {time}</p>
        <p>For {partySize} {partySize === '1' ? 'person' : 'people'}</p>
      </div>

      <button
        onClick={() => navigate('/')}
        style={{
          padding: '12px 24px',
          backgroundColor: '#ff4b5c',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Back to Home
      </button>

      <div style={{ marginTop: '30px', textAlign: 'left' }}>
        <h3>Confirmation</h3>
        <p>
          A confirmation has been sent to your email. Please arrive on time, and let us know in advance if
          you need to make changes to your reservation.
        </p>
      </div>
    </div>
  );
}

export default BookingSuccessPage;
