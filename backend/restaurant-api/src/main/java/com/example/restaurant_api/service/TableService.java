package com.example.restaurant_api.service;

import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.entity.RestaurantTable;
import com.example.restaurant_api.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TableService {

    @Autowired
    private TableRepository tableRepository;

    @Transactional(readOnly = true)
    public boolean isTableAvailable(Restaurant restaurant, String date, String time, int partySize) {
        // Find all tables that can accommodate the party size
        List<RestaurantTable> suitableTables = tableRepository.findAvailableTablesByRestaurantAndMinCapacity(restaurant, partySize);
        if (suitableTables.isEmpty()) {
            return false;
        }

        // Find all tables that are already booked for this time slot
        List<RestaurantTable> bookedTables = tableRepository.findBookedTables(restaurant, date, time);
        
        // Remove booked tables from suitable tables
        suitableTables.removeAll(bookedTables);
        
        return !suitableTables.isEmpty();
    }

    @Transactional(readOnly = true)
    public Optional<RestaurantTable> findAvailableTable(Restaurant restaurant, String date, String time, int partySize) {
        // Find all tables that can accommodate the party size
        List<RestaurantTable> suitableTables = tableRepository.findAvailableTablesByRestaurantAndMinCapacity(restaurant, partySize);
        if (suitableTables.isEmpty()) {
            return Optional.empty();
        }

        // Find all tables that are already booked for this time slot
        List<RestaurantTable> bookedTables = tableRepository.findBookedTables(restaurant, date, time);
        
        // Remove booked tables from suitable tables
        suitableTables.removeAll(bookedTables);
        
        // Return the smallest available table that can accommodate the party
        return suitableTables.stream().findFirst();
    }

    public RestaurantTable createTable(Restaurant restaurant, int capacity, String tableNumber) {
        RestaurantTable table = new RestaurantTable(restaurant, capacity, tableNumber);
        return tableRepository.save(table);
    }

    public List<RestaurantTable> getRestaurantTables(Restaurant restaurant) {
        return tableRepository.findByRestaurant(restaurant);
    }
} 