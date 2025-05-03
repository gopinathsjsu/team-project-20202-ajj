package com.example.restaurant_api.repository;

import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.RestaurantStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    List<Restaurant> findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCaseOrLocationContainingIgnoreCase(
        String name, String cuisine, String location);

    List<Restaurant> findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCaseOrLocationContainingIgnoreCaseAndStatus(
        String name, String cuisine, String location, RestaurantStatus status);

    // ✅ New: Flexible search method for filters
    @Query("SELECT r FROM Restaurant r " +
           "WHERE (:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:cuisine IS NULL OR LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :cuisine, '%'))) " +
           "AND r.status = 'APPROVED'")
    List<Restaurant> searchAvailable(
        @Param("date") String date,
        @Param("time") String time,
        @Param("partySize") int partySize,
        @Param("location") String location,
        @Param("cuisine") String cuisine
    );

    List<Restaurant> findByStatus(RestaurantStatus status);
    List<Restaurant> findByCuisineAndStatus(String cuisine, RestaurantStatus status);
    List<Restaurant> findByLocationAndStatus(String location, RestaurantStatus status);
}
