import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './Components/PrivateRoute';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <SearchBar />
          <Tabs />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RestaurantList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            
            {/* Protected Routes */}
            <Route 
              path="/bookings" 
              element={
                <PrivateRoute>
                  <BookingList />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reservations" 
              element={
                <PrivateRoute>
                  <ReservationPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/booking/:restaurantId/:time/:partySize" 
              element={
                <PrivateRoute>
                  <BookingConfirmationPage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
