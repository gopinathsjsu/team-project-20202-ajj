package com.example.restaurant_api.repository;

import com.example.restaurant_api.entity.Booking;
import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find a booking by restaurant, date, and time
    Optional<Booking> findByRestaurantAndDateAndTime(Restaurant restaurant, String date, String time);

    // Get all bookings for a user
    List<Booking> findByUser(User user);

    // Count bookings for a specific restaurant and date
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.restaurant = :restaurant AND b.date = :date")
    int countBookingsByRestaurantAndDate(@Param("restaurant") Restaurant restaurant, @Param("date") String date);

    // Find bookings within a date range (as strings)
    List<Booking> findByDateBetween(String startDate, String endDate);

    // ✅ New: Count bookings for all restaurants for a given date
    @Query("SELECT b.restaurant.id, COUNT(b) FROM Booking b WHERE b.date = :date GROUP BY b.restaurant.id")
    List<Object[]> countBookingsByDate(@Param("date") String date);
}
