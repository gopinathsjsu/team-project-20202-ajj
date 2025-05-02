package com.example.restaurant_api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "restaurant_table") // Using "restaurant_table" since "table" is a reserved word in SQL
public class RestaurantTable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(nullable = false)
    @Min(1)
    private int capacity;

    @Column(nullable = false)
    private String tableNumber;

    // Default constructor
    public RestaurantTable() {}

    // Constructor with fields
    public RestaurantTable(Restaurant restaurant, int capacity, String tableNumber) {
        this.restaurant = restaurant;
        this.capacity = capacity;
        this.tableNumber = tableNumber;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }
} 