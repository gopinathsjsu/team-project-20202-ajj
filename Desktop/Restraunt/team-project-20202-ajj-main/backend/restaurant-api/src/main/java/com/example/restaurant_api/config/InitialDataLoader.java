package com.example.restaurant_api.config;

import com.example.restaurant_api.entity.Restaurant;
import com.example.restaurant_api.repository.RestaurantRepository;
import com.example.restaurant_api.service.TableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class InitialDataLoader implements CommandLineRunner {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private TableService tableService;

    @Override
    public void run(String... args) {
        // Initialize tables for each restaurant
        restaurantRepository.findAll().forEach(restaurant -> {
            initializeTablesForRestaurant(restaurant);
        });
    }

    private void initializeTablesForRestaurant(Restaurant restaurant) {
        // Skip if restaurant already has tables
        if (!tableService.getRestaurantTables(restaurant).isEmpty()) {
            return;
        }

        // Create a mix of table sizes
        // 2 small tables (2 seats)
        tableService.createTable(restaurant, 2, "S1");
        tableService.createTable(restaurant, 2, "S2");

        // 3 medium tables (4 seats)
        tableService.createTable(restaurant, 4, "M1");
        tableService.createTable(restaurant, 4, "M2");
        tableService.createTable(restaurant, 4, "M3");

        // 2 large tables (6 seats)
        tableService.createTable(restaurant, 6, "L1");
        tableService.createTable(restaurant, 6, "L2");

        // 1 extra large table (8 seats)
        tableService.createTable(restaurant, 8, "XL1");
    }
} 