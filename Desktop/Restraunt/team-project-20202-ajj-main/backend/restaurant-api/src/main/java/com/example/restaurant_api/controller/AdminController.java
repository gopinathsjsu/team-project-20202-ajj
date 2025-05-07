package com.example.restaurant_api.controller;

import com.example.restaurant_api.dto.ReservationAnalytics;
import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.RestaurantStatus;
import com.example.restaurant_api.service.AnalyticsService;
import com.example.restaurant_api.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/analytics")
    public ResponseEntity<ReservationAnalytics> getReservationAnalytics() {
        return ResponseEntity.ok(analyticsService.getLastMonthAnalytics());
    }

    @PutMapping("/restaurants/{id}/approve")
    public ResponseEntity<Restaurant> approveRestaurant(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.updateRestaurantStatus(id, RestaurantStatus.APPROVED);
        return ResponseEntity.ok(restaurant);
    }

    @PutMapping("/restaurants/{id}/archive")
    public ResponseEntity<Restaurant> archiveRestaurant(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.updateRestaurantStatus(id, RestaurantStatus.ARCHIVED);
        return ResponseEntity.ok(restaurant);
    }

    @PutMapping("/restaurants/{id}/restore")
    public ResponseEntity<Restaurant> restoreRestaurant(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.updateRestaurantStatus(id, RestaurantStatus.APPROVED);
        return ResponseEntity.ok(restaurant);
    }

    @GetMapping("/restaurants/approved")
    public ResponseEntity<Iterable<Restaurant>> getApprovedRestaurants() {
        return ResponseEntity.ok(restaurantService.findByStatus(RestaurantStatus.APPROVED));
    }

    @GetMapping("/restaurants/pending")
    public ResponseEntity<Iterable<Restaurant>> getPendingRestaurants() {
        return ResponseEntity.ok(restaurantService.findByStatus(RestaurantStatus.PENDING_APPROVAL));
    }

    @GetMapping("/restaurants/archived")
    public ResponseEntity<Iterable<Restaurant>> getArchivedRestaurants() {
        return ResponseEntity.ok(restaurantService.findByStatus(RestaurantStatus.ARCHIVED));
    }
}
