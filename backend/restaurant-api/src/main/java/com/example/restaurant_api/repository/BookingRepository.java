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

    // Check if a booking already exists for the same restaurant, date, and time
    Optional<Booking> findByRestaurantAndDateAndTime(Restaurant restaurant, String date, String time);

    List<Booking> findByUser(User user);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.restaurant = :restaurant AND b.date = :date")
    int countBookingsByRestaurantAndDate(@Param("restaurant") Restaurant restaurant, @Param("date") String date);

    List<Booking> findByDateBetween(String startDate, String endDate);
}
