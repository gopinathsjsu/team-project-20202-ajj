import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/header';
import SearchBar from './Components/searchbar';
import RestaurantList from './Components/RestaurantList';
import Tabs from './Components/Tabs';
import BookingList from './Components/BookingList';
import ReservationPage from './Components/ReservationPage';
import RestaurantDetail from './Components/RestaurantDetail';
import BookingConfirmationPage from './Components/BookingConfirmationPage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage'; // ✅ NEW

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <SearchBar />
        <Tabs />
        <Routes>
          <Route path="/" element={<RestaurantList />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* ✅ NEW */}
          <Route path="/reservations" element={<ReservationPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/booking/:restaurantId/:time/:partySize" element={<BookingConfirmationPage />} />
        </Routes>
        <BookingList />
      </div>
    </Router>
  );
}

export default App;
