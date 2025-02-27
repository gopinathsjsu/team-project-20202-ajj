import React from 'react';

function SearchBar() {
  return (
    <div className="search-bar">
      <input type="date" />
      <select>
        {Array.from({ length: 24 }, (_, i) => {
          const hour = i % 12 || 12;
          const ampm = i < 12 ? 'AM' : 'PM';
          const time = `${hour}:00 ${ampm}`;
          return <option key={i} value={time}>{time}</option>;
        })}
      </select>
      <select>
        {Array.from({ length: 20 }, (_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1} people</option>
        ))}
      </select>
      <input type="text" placeholder="Location, Restaurant, or Cuisine" />
      <button>Let's go</button>
    </div>
  );
}

export default SearchBar;