import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './Components/header';
import SearchBar from './Components/searchbar';
import RestaurantList from './Components/RestaurantList';
import Tabs from './Components/Tabs';
import BookingList from './Components/BookingList';
import ReservationPage from './Components/ReservationPage';
import RestaurantDetail from './Components/RestaurantDetail';
import BookingConfirmationPage from './Components/BookingConfirmationPage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import AdminDashboard from './Components/AdminDashboard';

function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const hideSearch = location.pathname.startsWith('/restaurant/') || location.pathname.startsWith('/booking/');

  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {!hideSearch && (
        <>
          <SearchBar />
          <Tabs />
        </>
      )}

      <Routes>
        <Route path="/" element={<RestaurantList />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reservations" element={<ReservationPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/booking/:restaurantId/:time/:partySize" element={<BookingConfirmationPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      <BookingList />
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('jwt'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

export default App;
