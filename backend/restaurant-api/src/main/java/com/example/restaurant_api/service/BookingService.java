package com.example.restaurant_api.service;

import com.example.restaurant_api.Request.BookingRequest;
import com.example.restaurant_api.entity.Booking;
import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.User;
import com.example.restaurant_api.repository.BookingRepository;
import com.example.restaurant_api.repository.RestaurantRepository;
import com.example.restaurant_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public List<Booking> getAllBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalStateException("User not found"));

        // Only return bookings for the authenticated user
        return bookingRepository.findByUser(user);
    }

    public Booking createBooking(BookingRequest request) {
        // Get authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalStateException("User not found"));

        // Get restaurant
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
            .orElseThrow(() -> new IllegalStateException("Restaurant not found"));

        // Check if time slot is already taken
        boolean alreadyBooked = bookingRepository
                .findByRestaurantAndDateAndTime(
                        restaurant,
                        request.getDate(),
                        request.getTime()
                ).isPresent();

        if (alreadyBooked) {
            throw new IllegalStateException("This time slot is already booked.");
        }

        // Create new booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRestaurant(restaurant);
        booking.setDate(request.getDate());
        booking.setTime(request.getTime());
        booking.setPartySize(request.getPartySize());
        booking.setSpecialRequest(request.getSpecialRequest());

        return bookingRepository.save(booking);
    }

    public void cancelBooking(Long id) {
        // Get authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new IllegalStateException("User not found"));

        // Find booking and verify ownership
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new IllegalStateException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Not authorized to cancel this booking");
        }

        bookingRepository.deleteById(id);
    }
}
