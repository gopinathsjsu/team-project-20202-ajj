package com.example.restaurant_api.repository;

import com.example.restaurant_api.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Check if a booking already exists for the same restaurant, date, and time
    Optional<Booking> findByRestaurantIdAndDateAndTime(Long restaurantId, String date, String time);
}
