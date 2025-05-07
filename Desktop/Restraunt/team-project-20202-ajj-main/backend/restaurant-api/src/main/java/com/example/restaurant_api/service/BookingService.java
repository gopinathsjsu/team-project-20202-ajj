package com.example.restaurant_api.service;

import com.example.restaurant_api.entity.AvailabilitySlot;
import com.example.restaurant_api.entity.Booking;
import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.RestaurantTable;
import com.example.restaurant_api.entity.User;
import com.example.restaurant_api.repository.AvailabilitySlotRepository;
import com.example.restaurant_api.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TableService tableService;

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private EmailService emailService;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("h:mm a");

    public List<Booking> findByUser(User user) {
        return bookingRepository.findByUser(user);
    }

    @Transactional
    public Booking createBooking(User user, Restaurant restaurant, String date, String time, int partySize, String specialRequest) {
        logger.info("Creating booking for restaurant {} on {} at {} for {} people", 
            restaurant.getId(), date, time, partySize);

        Optional<RestaurantTable> availableTable = tableService.findAvailableTable(restaurant, date, time, partySize);
        
        if (availableTable.isEmpty()) {
            logger.error("No available tables found for the requested time slot");
            throw new RuntimeException("No available tables for the requested time slot");
        }

        logger.info("Found available table: {} with capacity {}", 
            availableTable.get().getTableNumber(), availableTable.get().getCapacity());

        try {
            LocalDateTime bookingDateTime = LocalDate.parse(date)
                .atTime(LocalTime.parse(time, TIME_FORMATTER));
            
            logger.info("Looking for availability slot at: {}", bookingDateTime);

            List<AvailabilitySlot> availableSlots = availabilitySlotRepository.findAvailableSlots(
                restaurant,
                partySize,
                bookingDateTime,
                bookingDateTime
            );

            logger.info("Found {} available slots", availableSlots.size());
            availableSlots.forEach(s -> logger.info("Slot: table={}, time={}, isBooked={}", 
                s.getTable().getTableNumber(), s.getAvailableAt(), s.isBooked()));

            Optional<AvailabilitySlot> slot = availableSlots.stream()
                .filter(s -> s.getTable().equals(availableTable.get()))
                .findFirst();

            if (slot.isEmpty()) {
                logger.error("No availability slot found for table {} at {}", 
                    availableTable.get().getTableNumber(), bookingDateTime);
                throw new RuntimeException("No availability slot found for the selected time");
            }

            AvailabilitySlot slotToBook = slot.get();
            logger.info("Found slot to book: table={}, time={}, isBooked={}", 
                slotToBook.getTable().getTableNumber(), slotToBook.getAvailableAt(), slotToBook.isBooked());

            slotToBook.setBooked(true);
            slotToBook = availabilitySlotRepository.save(slotToBook);

            logger.info("Saved slot with isBooked={}", slotToBook.isBooked());

            Booking booking = new Booking(user, restaurant, availableTable.get(), date, time, partySize, specialRequest);
            booking = bookingRepository.save(booking);

            try {
                emailService.sendBookingConfirmation(booking);
                logger.info("Confirmation email sent for booking {}", booking.getId());
            } catch (Exception e) {
                logger.error("Failed to send confirmation email: {}", e.getMessage());
            }

            logger.info("Created booking with ID: {}", booking.getId());
            return booking;

        } catch (Exception e) {
            logger.error("Error creating booking: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create booking: " + e.getMessage());
        }
    }

    @Transactional
    public void cancelBooking(Long id, User user) {
        logger.info("Canceling booking {} for user {}", id, user.getId());

        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            logger.error("Booking {} not found", id);
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();
        if (!booking.getUser().getId().equals(user.getId())) {
            logger.error("User {} not authorized to cancel booking {}", user.getId(), id);
            throw new RuntimeException("Not authorized to cancel this booking");
        }

        try {
            LocalDateTime bookingDateTime = LocalDate.parse(booking.getDate())
                .atTime(LocalTime.parse(booking.getTime(), TIME_FORMATTER));

            logger.info("Looking for availability slot at: {}", bookingDateTime);

            List<AvailabilitySlot> slots = availabilitySlotRepository.findByTableAndAvailableAt(
                booking.getTable(),
                bookingDateTime
            );

            logger.info("Found {} slots to update", slots.size());

            if (!slots.isEmpty()) {
                AvailabilitySlot slot = slots.get(0);
                logger.info("Found slot: table={}, time={}, isBooked={}", 
                    slot.getTable().getTableNumber(), slot.getAvailableAt(), slot.isBooked());

                slot.setBooked(false);
                slot = availabilitySlotRepository.save(slot);
                logger.info("Updated slot isBooked to {}", slot.isBooked());
            }

            try {
                emailService.sendCancellationConfirmation(booking);
                logger.info("Cancellation confirmation email sent for booking {}", booking.getId());
            } catch (Exception e) {
                logger.error("Failed to send cancellation confirmation email: {}", e.getMessage());
            }

            bookingRepository.deleteById(id);
            logger.info("Successfully deleted booking {}", id);

        } catch (Exception e) {
            logger.error("Error canceling booking: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to cancel booking: " + e.getMessage());
        }
    }

    public boolean isTimeSlotAvailable(Restaurant restaurant, String date, String time, int partySize) {
        return tableService.isTableAvailable(restaurant, date, time, partySize);
    }

    // ✅ NEW METHOD: Return count of today's bookings by restaurant
    public Map<Long, Long> getTodayBookingCounts(LocalDate date) {
        List<Object[]> results = bookingRepository.countBookingsByDate(date.toString());
        return results.stream()
            .collect(Collectors.toMap(
                row -> (Long) row[0],  // restaurant ID
                row -> (Long) row[1]   // booking count
            ));
    }
}
