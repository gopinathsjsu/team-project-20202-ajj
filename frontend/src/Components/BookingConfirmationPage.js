import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './BookingConfirmationPage.css'; // Make sure to add the CSS shown below

function BookingConfirmationPage() {
  const { restaurantId, time, partySize } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt'));
  const [useEmail, setUseEmail] = useState(false);
  const [timeLeft, setTimeLeft] = useState(4 * 60); // 4 minutes countdown

  const [specialRequest, setSpecialRequest] = useState('');
  const [occasion, setOccasion] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  const [guest, setGuest] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    setRestaurant({
      id: restaurantId,
      name: 'Mosaic Restaurant and Ultra Lounge – San Jose',
      imageUrl: 'https://images.otstatic.com/prod/23668796/1/small.jpg',
    });

    if (isLoggedIn) {
      setUser({
        name: 'Abdul Muqtadir Mohammed',
        email: 'muqtadir493@gmail.com',
        phone: '4082108139',
      });
    }
  }, [restaurantId, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            alert('⏱️ Table hold expired!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const logoutUser = () => {
    localStorage.removeItem('jwt');
    window.location.reload();
  };

  const handleReservation = () => {
    const contactValue = useEmail ? guest.email : guest.phone;

    if (!agreeTerms) return alert('You must agree to the restaurant’s terms.');
    if (!isLoggedIn && !contactValue) return setError(`Please enter your ${useEmail ? 'email' : 'phone number'}.`);

    const data = isLoggedIn
      ? {
          restaurantId,
          time,
          partySize,
          customerName: user.name,
          customerEmail: user.email,
          customerPhone: user.phone,
          occasion,
          specialRequest,
        }
      : {
          restaurantId,
          time,
          partySize,
          customerName: `${guest.firstName} ${guest.lastName}`,
          customerEmail: guest.email,
          customerPhone: guest.phone,
          occasion,
          specialRequest,
        };

    console.log('✅ Booking data:', data);
    alert('Reservation confirmed (mock)!');
    navigate('/');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(1, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!restaurant || (isLoggedIn && !user)) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Loading reservation details...</p>;
  }

  return (
    <div className="booking-container">
      <h2>You're almost done!</h2>

      <div className="booking-header">
        <img src={restaurant.imageUrl} alt={restaurant.name} />
        <div>
          <h3>{restaurant.name}</h3>
          <p>{new Date(time).toLocaleString()} · {partySize} people</p>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="countdown-box">
          We’re holding this table for you for <strong>{formatTime(timeLeft)} minutes</strong>
        </div>
      )}

      <label className="section-label">Diner details</label>

      {isLoggedIn ? (
        <>
          <p><strong>{user.name}</strong>{' '}
            <button onClick={logoutUser} className="link-button">(Not {user.name}?)</button>
          </p>
          <div className="field-row">
            <input value={user.phone} disabled />
            <input value={user.email} disabled />
          </div>
        </>
      ) : (
        <>
          <div className="field-row">
            <input placeholder="First name" value={guest.firstName}
              onChange={(e) => setGuest({ ...guest, firstName: e.target.value })} />
            <input placeholder="Last name" value={guest.lastName}
              onChange={(e) => setGuest({ ...guest, lastName: e.target.value })} />
          </div>

          {useEmail ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={guest.email}
                onChange={(e) => { setGuest({ ...guest, email: e.target.value }); setError(''); }}
                className={error && !guest.email ? 'error' : ''}
              />
              {error && !guest.email && <p className="error-text">{error}</p>}
              <button className="link-button" onClick={() => setUseEmail(false)}>Use mobile instead</button>
            </>
          ) : (
            <>
              <PhoneInput
                country={'us'}
                value={guest.phone}
                onChange={(value) => { setGuest({ ...guest, phone: value }); setError(''); }}
                inputClass={`phone-input ${error && !guest.phone ? 'error' : ''}`}
                containerClass="phone-container"
              />
              {error && !guest.phone && <p className="error-text">{error}</p>}
              <p className="subtext">You will receive a text message to verify your account. Message & data rates may apply.</p>
              <button className="link-button" onClick={() => setUseEmail(true)}>Use email instead</button>
            </>
          )}
        </>
      )}

      <div className="field-row">
        <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
          <option value="">Select an occasion (optional)</option>
          <option value="Birthday">Birthday</option>
          <option value="Anniversary">Anniversary</option>
        </select>
        <input placeholder="Add a special request (optional)" value={specialRequest}
          onChange={(e) => setSpecialRequest(e.target.value)} />
      </div>

      <label className="terms-checkbox">
        <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
        I agree to the restaurant's terms and conditions
      </label>

      <button className="submit-button" onClick={handleReservation}>
        Complete Reservation
      </button>

      <p className="legal-text">
        By clicking “Complete reservation” you agree to the OpenTable Terms of Use and Privacy Policy.
      </p>
    </div>
  );
}

export default BookingConfirmationPage;
