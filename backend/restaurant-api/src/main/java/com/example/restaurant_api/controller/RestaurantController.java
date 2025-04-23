package com.example.restaurant_api.controller;

import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class RestaurantController {

    @Autowired
    private final RestaurantRepository restaurantRepository;

    public RestaurantController(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    @GetMapping("/restaurants")
    public List<Restaurant> getRestaurants(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return restaurantRepository.findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCaseOrLocationContainingIgnoreCase(
                search, search, search);
        }
        return restaurantRepository.findAll();
    }

    @GetMapping("/restaurants/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        return restaurantRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ NEW: Smart Search API
    @GetMapping("/restaurants/search")
    public ResponseEntity<List<Restaurant>> searchRestaurants(
            @RequestParam String date,
            @RequestParam String time,
            @RequestParam int partySize,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String cuisine
    ) {
        List<Restaurant> results = restaurantRepository.searchAvailable(date, time, partySize, location, cuisine);
        return ResponseEntity.ok(results);
    }
}
