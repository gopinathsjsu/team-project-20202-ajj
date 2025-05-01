package com.example.restaurant_api.controller;

import com.example.restaurant_api.Request.BookingRequest;
import com.example.restaurant_api.entity.Booking;
import com.example.restaurant_api.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Frontend origin
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            Booking created = bookingService.createBooking(request);
            return ResponseEntity.ok(created);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body("This time slot is already booked.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid booking request.");
        }
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}
