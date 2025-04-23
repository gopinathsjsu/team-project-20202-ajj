import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(1);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

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
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        aria-label="Select a date"
      />

      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        aria-label="Select time"
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
      />

      <button type="submit">Let's go</button>
    </form>
  );
}

export default SearchBar;
