package com.example.restaurant_api.repository;

import com.example.restaurant_api.entity.AvailabilitySlot;
import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    
    @Query("SELECT a FROM AvailabilitySlot a " +
           "WHERE a.table.restaurant = :restaurant " +
           "AND a.table.capacity >= :partySize " +
           "AND a.availableAt BETWEEN :startTime AND :endTime " +
           "AND a.isBooked = false " +
           "ORDER BY a.availableAt")
    List<AvailabilitySlot> findAvailableSlots(
        @Param("restaurant") Restaurant restaurant,
        @Param("partySize") int partySize,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT DISTINCT a.availableAt FROM AvailabilitySlot a " +
           "WHERE a.table.restaurant = :restaurant " +
           "AND a.table.capacity >= :partySize " +
           "AND a.availableAt BETWEEN :startTime AND :endTime " +
           "AND a.isBooked = false " +
           "ORDER BY a.availableAt")
    List<LocalDateTime> findAvailableTimes(
        @Param("restaurant") Restaurant restaurant,
        @Param("partySize") int partySize,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    // Delete slots before a given date/time
    void deleteByAvailableAtBefore(LocalDateTime cutoff);

    // Check if slots exist for a table within a time range
    boolean existsByTableAndAvailableAtBetween(RestaurantTable table, LocalDateTime startTime, LocalDateTime endTime);

    // Find slots for a specific table and time
    List<AvailabilitySlot> findByTableAndAvailableAt(RestaurantTable table, LocalDateTime availableAt);

    // For debugging: find all slots for a table
    @Query("SELECT a FROM AvailabilitySlot a WHERE a.table = :table ORDER BY a.availableAt")
    List<AvailabilitySlot> findAllByTable(@Param("table") RestaurantTable table);
} 