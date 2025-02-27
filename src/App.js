import React from 'react';
import Header from './Components/header';
import SearchBar from './Components/searchbar';
import RestaurantList from './Components/RestaurantList';
import Tabs from './Components/Tabs';

function App() {
  return (
    <div className="App">
      <Header />
      <SearchBar />
      <Tabs />
      <RestaurantList />
    </div>
  );
}

export default App;