package com.example.restaurant_api.controller;

import com.example.restaurant_api.Request.BookingRequest;
import com.example.restaurant_api.entity.AvailabilitySlot;
import com.example.restaurant_api.entity.Booking;
import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.RestaurantTable;
import com.example.restaurant_api.entity.User;
import com.example.restaurant_api.repository.AvailabilitySlotRepository;
import com.example.restaurant_api.repository.RestaurantRepository;
import com.example.restaurant_api.repository.TableRepository;
import com.example.restaurant_api.repository.UserRepository;
import com.example.restaurant_api.service.AvailabilityService;
import com.example.restaurant_api.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private AvailabilityService availabilityService;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("h:mm a");

    @GetMapping
    public ResponseEntity<List<Booking>> getUserBookings() {
        User user = getCurrentUser();
        return ResponseEntity.ok(bookingService.findByUser(user));
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request) {
        User user = getCurrentUser();
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Booking booking = bookingService.createBooking(
            user,
            restaurant,
            request.getDate(),
            request.getTime(),
            request.getPartySize(),
            request.getSpecialRequest()
        );

        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        User user = getCurrentUser();
        bookingService.cancelBooking(id, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/availability")
    public ResponseEntity<List<String>> getAvailableSlots(
            @RequestParam Long restaurantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam int partySize
    ) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        List<LocalDateTime> availableTimes = availabilityService.getAvailableTimesForRestaurant(
                restaurant,
                date,
                partySize
        );

        List<String> formattedTimes = availableTimes.stream()
                .map(time -> time.format(TIME_FORMATTER))
                .collect(Collectors.toList());

        return ResponseEntity.ok(formattedTimes);
    }

    @PostMapping("/availability/populate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> populateAvailability() {
        availabilityService.populateInitialAvailability();
        return ResponseEntity.ok("Availability slots populated successfully");
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
