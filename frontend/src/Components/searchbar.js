import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SearchBar.css';

function SearchBar() {
  // Get today's date in YYYY-MM-DD format in local timezone
  const today = new Date().toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format
  
  // Get next hour in local timezone
  const getNextHour = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    const hour = now.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  const [date, setDate] = useState(today);
  const [time, setTime] = useState(getNextHour());
  const [people, setPeople] = useState(1);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Hide search bar if user is admin or if we're on the login page
  if (user?.role === 'ADMIN' || location.pathname === '/login') {
    return null;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      search: query,
      date,
      time,
      people: String(people)
    });
    navigate(`/reservations?${params.toString()}`);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          aria-label="Select a date"
          min={today}
          className="search-input date-input"
        />

        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          aria-label="Select time"
          className="search-input time-select"
        >
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i % 12 || 12;
            const ampm = i < 12 ? 'AM' : 'PM';
            const label = `${hour}:00 ${ampm}`;
            return <option key={i} value={label}>{label}</option>;
          })}
        </select>

        <select
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          required
          aria-label="Select number of people"
          className="search-input people-select"
        >
          {Array.from({ length: 20 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i === 0 ? 'person' : 'people'}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Location, Restaurant, or Cuisine"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
          aria-label="Search by location or cuisine"
          className="search-input location-input"
        />

        <button type="submit" className="search-input search-button">
          Let's go
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
