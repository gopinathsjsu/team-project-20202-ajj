package com.example.restaurant_api.service;

import com.example.restaurant_api.entity.AvailabilitySlot;
import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.RestaurantTable;
import com.example.restaurant_api.repository.AvailabilitySlotRepository;
import com.example.restaurant_api.repository.RestaurantRepository;
import com.example.restaurant_api.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AvailabilityService {
    private static final Logger logger = LoggerFactory.getLogger(AvailabilityService.class);

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private TableRepository tableRepository;

    @Value("${availability.populate-on-startup:false}")
    private boolean populateOnStartup;

    private static final LocalTime OPENING_TIME = LocalTime.of(11, 0);
    private static final LocalTime CLOSING_TIME = LocalTime.of(22, 0);
    private static final LocalTime LAST_BOOKING_TIME = LocalTime.of(21, 0);
    private static final int DAYS_TO_POPULATE = 7;

    @PostConstruct
    public void init() {
        if (populateOnStartup) {
            logger.info("Populating availability slots on startup...");
            populateAvailabilitySlots();
            logger.info("Finished populating availability slots.");
        } else {
            logger.info("Skipping availability population on startup (disabled by configuration).");
        }
    }

    @Scheduled(cron = "0 0 1 * * *") // Run at 1 AM every day
    @Transactional
    public void populateAvailabilitySlots() {
        // First, clean up old slots
        cleanupOldSlots();
        
        // Then populate new slots
        LocalDate today = LocalDate.now();
        LocalDate lastDay = today.plusDays(DAYS_TO_POPULATE);

        List<Restaurant> restaurants = restaurantRepository.findAll();
        for (Restaurant restaurant : restaurants) {
            List<RestaurantTable> tables = tableRepository.findByRestaurant(restaurant);
            
            for (RestaurantTable table : tables) {
                // Only populate slots for dates that don't have slots yet
                for (LocalDate date = today; date.isBefore(lastDay); date = date.plusDays(1)) {
                    if (!hasExistingSlotsForDate(table, date)) {
                        populateSlotsForTableAndDate(table, date);
                    }
                }
            }
        }
    }

    @Transactional
    public void cleanupOldSlots() {
        LocalDateTime cutoff = LocalDate.now().atTime(LocalTime.MIN);
        availabilitySlotRepository.deleteByAvailableAtBefore(cutoff);
    }

    private boolean hasExistingSlotsForDate(RestaurantTable table, LocalDate date) {
        LocalDateTime startOfDay = date.atTime(LocalTime.MIN);
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return availabilitySlotRepository.existsByTableAndAvailableAtBetween(table, startOfDay, endOfDay);
    }

    private void populateSlotsForTableAndDate(RestaurantTable table, LocalDate date) {
        LocalDateTime currentSlot = date.atTime(OPENING_TIME);
        LocalDateTime endTime = date.atTime(LAST_BOOKING_TIME);

        List<AvailabilitySlot> slots = new ArrayList<>();
        while (!currentSlot.isAfter(endTime)) {
            slots.add(new AvailabilitySlot(table, currentSlot));
            currentSlot = currentSlot.plusHours(1);
        }
        
        // Batch save all slots for better performance
        availabilitySlotRepository.saveAll(slots);
    }

    @Transactional(readOnly = true)
    public List<LocalDateTime> getAvailableTimesForRestaurant(Restaurant restaurant, LocalDate date, int partySize) {
        LocalDateTime startOfDay = date.atTime(OPENING_TIME);
        LocalDateTime endOfDay = date.atTime(CLOSING_TIME);

        return availabilitySlotRepository.findAvailableTimes(
            restaurant,
            partySize,
            startOfDay,
            endOfDay
        );
    }

    @Transactional
    public void markSlotAsBooked(AvailabilitySlot slot) {
        slot.setBooked(true);
        availabilitySlotRepository.save(slot);
    }

    @Transactional
    public void markSlotAsAvailable(AvailabilitySlot slot) {
        slot.setBooked(false);
        availabilitySlotRepository.save(slot);
    }

    // Method to manually trigger population (useful for initial setup)
    @Transactional
    public void populateInitialAvailability() {
        populateAvailabilitySlots();
    }
} 