import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ReservationBox.css';

// Move this helper function OUTSIDE the component to avoid useEffect warning
const formatTime = (dateObj) => {
  return dateObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const generateTimeSlots = (baseTime) => {
  const base = new Date();
  const [hour, minute] = baseTime.split(':').map(Number);
  base.setHours(hour);
  base.setMinutes(minute);

  const slots = [-30, -15, 0, 15, 30].map((offset) => {
    const copy = new Date(base);
    copy.setMinutes(copy.getMinutes() + offset);
    return formatTime(copy);
  });

  return slots;
};

const ReservationBox = () => {
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);

  const navigate = useNavigate();
  const { id: restaurantId } = useParams();

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toTimeString().split(':').slice(0, 2).join(':');

    setDate(formattedDate);
    setTime(formattedTime);
    setAvailableTimes(generateTimeSlots(formattedTime));
  }, []);

  useEffect(() => {
    if (time) {
      setAvailableTimes(generateTimeSlots(time));
    }
  }, [time]);

  const handleTimeClick = (selectedTime) => {
    navigate(`/booking/${restaurantId}/${selectedTime}/${partySize}`);
  };

  return (
    <div className="reservation-box">
      <h3 className="box-heading">Make a reservation</h3>

      <div className="input-group">
        <span role="img" aria-label="party size">👤</span>
        <select value={partySize} onChange={(e) => setPartySize(e.target.value)}>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1} people</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <span role="img" aria-label="calendar">📅</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="input-group">
        <span role="img" aria-label="clock">⏰</span>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="select-time-heading">Select a time</div>
      <div className="time-buttons">
        {availableTimes.map((t, i) => (
          <button
            key={t}
            className={`time-button ${i === availableTimes.length - 1 ? 'notify' : ''}`}
            onClick={() => handleTimeClick(t)}
          >
            {i === availableTimes.length - 1 ? '🔔 Notify me' : t}
          </button>
        ))}
      </div>

      <p className="booking-note">📈 Booked 2 times today</p>
    </div>
  );
};

export default ReservationBox;
