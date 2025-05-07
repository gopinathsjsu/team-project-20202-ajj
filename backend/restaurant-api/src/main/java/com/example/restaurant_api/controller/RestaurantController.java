package com.example.restaurant_api.controller;

import com.example.restaurant_api.dto.RestaurantDTO;
import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.RestaurantReview;
import com.example.restaurant_api.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<List<RestaurantDTO>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/search")
    public ResponseEntity<List<RestaurantDTO>> searchRestaurants(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String time,
            @RequestParam(required = false) Integer partySize,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(restaurantService.searchRestaurants(date, time, partySize, location, null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDTO> getRestaurantById(@PathVariable Long id) {
        RestaurantDTO restaurant = restaurantService.getRestaurantById(id);
        if (restaurant != null) {
            return ResponseEntity.ok(restaurant);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<RestaurantReview>> getRestaurantReviews(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantReviews(id));
    }

    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.saveRestaurant(restaurant));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok().build();
    }
}
