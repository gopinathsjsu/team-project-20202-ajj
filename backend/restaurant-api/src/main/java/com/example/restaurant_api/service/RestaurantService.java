package com.example.restaurant_api.service;

import com.example.restaurant_api.dto.RestaurantDTO;
import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.RestaurantStatus;
import com.example.restaurant_api.entity.RestaurantReview;
import com.example.restaurant_api.repository.BookingRepository;
import com.example.restaurant_api.repository.RestaurantRepository;
import com.example.restaurant_api.repository.RestaurantReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TableService tableService;

    @Autowired
    private AvailabilityService availabilityService;

    @Autowired
    private RestaurantReviewRepository reviewRepository;

    public List<RestaurantDTO> getAllRestaurants() {
        String today = LocalDate.now().toString();
        return restaurantRepository.findByStatus(RestaurantStatus.APPROVED).stream()
                .map(restaurant -> convertToDTO(restaurant, today, null, 1))
                .collect(Collectors.toList());
    }

    public List<RestaurantDTO> searchRestaurants(String date, String time, Integer partySize, String location, String cuisine) {
        String searchDate = date != null ? date : LocalDate.now().toString();
        String searchTime = time != null ? time : "7:00 PM";
        int searchPartySize = partySize != null ? partySize : 1;
        
        // Combine location and cuisine into a single search term
        String searchTerm = location; // Since frontend sends the search text in location parameter
        
        // Get all approved restaurants that match the search criteria
        List<Restaurant> restaurants = restaurantRepository.searchAvailable(
            searchDate,
            searchTime,
            searchPartySize,
            searchTerm
        );

        // Convert to DTOs with booking counts and available time slots
        return restaurants.stream()
                .map(restaurant -> {
                    // Get available slots for this restaurant
                    List<String> slots = availabilityService.getAvailableTimesForRestaurant(
                        restaurant,
                        LocalDate.parse(searchDate),
                        searchTime,
                        searchPartySize
                    ).stream()
                    .map(slotTime -> slotTime.format(DateTimeFormatter.ofPattern("h:mm a")))
                    .collect(Collectors.toList());

                    // Create DTO with available slots
                    return convertToDTO(restaurant, searchDate, searchTime, searchPartySize);
                })
                .filter(dto -> dto.getAvailableTimeSlots() != null && !dto.getAvailableTimeSlots().isEmpty())
                .collect(Collectors.toList());
    }

    public RestaurantDTO getRestaurantById(Long id) {
        String today = LocalDate.now().toString();
        return restaurantRepository.findById(id)
                .map(restaurant -> convertToDTO(restaurant, today, null, 1))
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

    public List<RestaurantReview> getRestaurantReviews(Long restaurantId) {
        return reviewRepository.findByRestaurantId(restaurantId);
    }

    public Restaurant saveRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }

    private RestaurantDTO convertToDTO(Restaurant restaurant, String date, String baseTime, int partySize) {
        System.out.println("Counting bookings for restaurant: " + restaurant.getId() + " on date: " + date);
        int bookedCount = bookingRepository.countBookingsByRestaurantAndDate(restaurant.getId(), date);
        System.out.println("Found " + bookedCount + " bookings");
        
        // Get available time slots if baseTime is provided
        List<String> availableSlots = null;
        if (baseTime != null) {
            availableSlots = availabilityService.getAvailableTimesForRestaurant(
                restaurant,
                LocalDate.parse(date),
                baseTime,
                partySize
            ).stream()
            .map(time -> time.format(DateTimeFormatter.ofPattern("h:mm a")))
            .collect(Collectors.toList());
        }
        
        return new RestaurantDTO(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getCuisine(),
                restaurant.getLocation(),
                restaurant.getRating(),
                restaurant.getImageUrl(),
                bookedCount,
                availableSlots,
                restaurant.getLat(),
                restaurant.getLng()
        );
    }
} 