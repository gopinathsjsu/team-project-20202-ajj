package com.example.restaurant_api.service;

import com.example.restaurant_api.dto.ReservationAnalytics;
import com.example.restaurant_api.entity.Booking;
import com.example.restaurant_api.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private BookingRepository bookingRepository;

    public ReservationAnalytics getLastMonthAnalytics() {
        // Get date range for last month
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(1);

        // Fetch all bookings for the last month
        List<Booking> bookings = bookingRepository.findByDateBetween(
            startDate.format(DateTimeFormatter.ISO_DATE),
            endDate.format(DateTimeFormatter.ISO_DATE)
        );

        ReservationAnalytics analytics = new ReservationAnalytics();

        // Total reservations
        analytics.setTotalReservations(bookings.size());

        // Reservations by restaurant
        Map<String, Integer> byRestaurant = bookings.stream()
            .collect(Collectors.groupingBy(
                booking -> booking.getRestaurant().getName(),
                Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
            ));
        analytics.setReservationsByRestaurant(byRestaurant);

        // Reservations by date
        Map<String, Integer> byDate = bookings.stream()
            .collect(Collectors.groupingBy(
                Booking::getDate,
                Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
            ));
        analytics.setReservationsByDate(byDate);

        // Reservations by time slot
        Map<String, Integer> byTimeSlot = bookings.stream()
            .collect(Collectors.groupingBy(
                Booking::getTime,
                Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
            ));
        analytics.setReservationsByTimeSlot(byTimeSlot);

        // Average party size
        double avgPartySize = bookings.stream()
            .mapToInt(booking -> booking.getTable().getCapacity())
            .average()
            .orElse(0.0);
        analytics.setAveragePartySize(avgPartySize);

        // Top restaurants with additional metrics
        List<Map<String, Object>> topRestaurants = byRestaurant.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(5)
            .map(entry -> {
                Map<String, Object> restaurantStats = new HashMap<>();
                restaurantStats.put("name", entry.getKey());
                restaurantStats.put("bookings", entry.getValue());
                
                // Calculate average party size for this restaurant
                double restaurantAvgPartySize = bookings.stream()
                    .filter(b -> b.getRestaurant().getName().equals(entry.getKey()))
                    .mapToInt(b -> b.getTable().getCapacity())
                    .average()
                    .orElse(0.0);
                restaurantStats.put("averagePartySize", restaurantAvgPartySize);
                
                // Most popular time slot for this restaurant
                Map<String, Long> timeSlotCounts = bookings.stream()
                    .filter(b -> b.getRestaurant().getName().equals(entry.getKey()))
                    .collect(Collectors.groupingBy(Booking::getTime, Collectors.counting()));
                
                String popularTimeSlot = timeSlotCounts.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse("N/A");
                restaurantStats.put("popularTimeSlot", popularTimeSlot);
                
                return restaurantStats;
            })
            .collect(Collectors.toList());
        
        analytics.setTopRestaurants(topRestaurants);

        return analytics;
    }
} 