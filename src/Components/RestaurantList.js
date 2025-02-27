import React from 'react';

function RestaurantList() {
  const restaurants = [
    { name: 'Broadmoor Bistro', cuisine: 'Contemporary American', rating: 5 },
    { name: 'Cafe Provence', cuisine: 'French American', rating: 4.9 },
    { name: 'Renaissance Cafe', cuisine: 'Italian', rating: 4.8 },
  ];

  return (
    <div className="restaurant-list">
      {restaurants.map((restaurant, index) => (
        <div key={index} className="restaurant-card">
          <h2>{restaurant.name}</h2>
          <p>{restaurant.cuisine}</p>
          <p>Rating: {restaurant.rating}</p>
          <button>Find next available</button>
        </div>
      ))}
    </div>
  );
}

export default RestaurantList;