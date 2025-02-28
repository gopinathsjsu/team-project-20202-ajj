import React, { useState } from 'react';
import Header from './Components/header';
import SearchBar from './Components/searchbar';
import RestaurantList from './Components/RestaurantList';
import Tabs from './Components/Tabs';
import SignInModal from './Components/SignInModal';

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="App">
      <Header onSignInClick={() => setModalIsOpen(true)} />
      <SearchBar />
      <Tabs />
      <RestaurantList />
      <SignInModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
    </div>
  );
}

export default App;