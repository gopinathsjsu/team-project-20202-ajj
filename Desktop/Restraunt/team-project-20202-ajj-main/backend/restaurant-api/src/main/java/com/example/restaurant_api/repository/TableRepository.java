package com.example.restaurant_api.repository;

import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<RestaurantTable, Long> {
    
    // Find all tables for a restaurant that can accommodate the party size
    @Query("SELECT t FROM RestaurantTable t WHERE t.restaurant = :restaurant AND t.capacity >= :partySize ORDER BY t.capacity ASC")
    List<RestaurantTable> findAvailableTablesByRestaurantAndMinCapacity(
        @Param("restaurant") Restaurant restaurant,
        @Param("partySize") int partySize
    );

    // Find all tables for a restaurant
    List<RestaurantTable> findByRestaurant(Restaurant restaurant);

    // Find tables that are already booked for a specific date and time
    @Query("SELECT t FROM RestaurantTable t WHERE t.restaurant = :restaurant AND t.id IN " +
           "(SELECT b.table.id FROM Booking b WHERE b.restaurant = :restaurant AND b.date = :date AND b.time = :time)")
    List<RestaurantTable> findBookedTables(
        @Param("restaurant") Restaurant restaurant,
        @Param("date") String date,
        @Param("time") String time
    );
} 