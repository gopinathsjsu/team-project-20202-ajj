package com.example.restaurant_api.service;

import com.example.restaurant_api.dto.RestaurantDTO;
import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.RestaurantStatus;
import com.example.restaurant_api.repository.BookingRepository;
import com.example.restaurant_api.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<RestaurantDTO> getAllRestaurants() {
        String today = LocalDate.now().toString();
        return restaurantRepository.findByStatus(RestaurantStatus.APPROVED).stream()
                .map(restaurant -> convertToDTO(restaurant, today))
                .collect(Collectors.toList());
    }

    public List<RestaurantDTO> searchRestaurants(String search) {
        String today = LocalDate.now().toString();
        return restaurantRepository
                .findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCaseOrLocationContainingIgnoreCaseAndStatus(
                        search, search, search, RestaurantStatus.APPROVED)
                .stream()
                .map(restaurant -> convertToDTO(restaurant, today))
                .collect(Collectors.toList());
    }

    public RestaurantDTO getRestaurantById(Long id) {
        String today = LocalDate.now().toString();
        return restaurantRepository.findById(id)
                .map(restaurant -> convertToDTO(restaurant, today))
                .orElse(null);
    }

    public Restaurant updateRestaurantStatus(Long id, RestaurantStatus status) {
        Restaurant restaurant = restaurantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        restaurant.setStatus(status);
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> findByStatus(RestaurantStatus status) {
        return restaurantRepository.findByStatus(status);
    }

    public List<Restaurant> findAllActive() {
        return restaurantRepository.findByStatus(RestaurantStatus.APPROVED);
    }

    private RestaurantDTO convertToDTO(Restaurant restaurant, String date) {
        int bookedCount = bookingRepository.countBookingsByRestaurantAndDate(restaurant, date);
        
        return new RestaurantDTO(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getCuisine(),
                restaurant.getLocation(),
                restaurant.getRating(),
                restaurant.getImageUrl(),
                bookedCount
        );
    }
} 