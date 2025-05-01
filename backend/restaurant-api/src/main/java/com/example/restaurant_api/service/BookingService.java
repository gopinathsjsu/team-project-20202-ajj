package com.example.restaurant_api.service;

import com.example.restaurant_api.Request.BookingRequest;
import com.example.restaurant_api.entity.Booking;
import com.example.restaurant_api.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getAllBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Current user: " + auth.getName());
        System.out.println("User authorities: " + auth.getAuthorities());
        return bookingRepository.findAll();
    }

    public void cancelBooking(Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
        }
    }
    

    public Booking createBooking(BookingRequest request) {
        // Validation: Check if the time slot is already taken
        boolean alreadyBooked = bookingRepository
                .findByRestaurantIdAndDateAndTime(
                        request.getRestaurantId(),
                        request.getDate(),
                        request.getTime()
                ).isPresent();

        if (alreadyBooked) {
            throw new IllegalStateException("This time slot is already booked.");
        }

        // Save new booking
        Booking booking = new Booking();
        booking.setRestaurantId(request.getRestaurantId());
        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setCustomerEmail(request.getCustomerEmail());
        booking.setDate(request.getDate());
        booking.setTime(request.getTime());
        booking.setPartySize(request.getPartySize() > 0 ? request.getPartySize() : 1);
        booking.setSpecialRequest(request.getSpecialRequest());

        System.out.println("Creating booking with party size: " + booking.getPartySize());
        return bookingRepository.save(booking);
    }
}
