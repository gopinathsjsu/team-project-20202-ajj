package com.example.restaurant_api.dto;

public class RestaurantDTO {
    private Long id;
    private String name;
    private String cuisine;
    private String location;
    private double rating;
    private String imageUrl;
    private int bookedCountToday;

    // Default constructor
    public RestaurantDTO() {}

    // Constructor with all fields
    public RestaurantDTO(Long id, String name, String cuisine, String location, double rating, String imageUrl, int bookedCountToday) {
        this.id = id;
        this.name = name;
        this.cuisine = cuisine;
        this.location = location;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.bookedCountToday = bookedCountToday;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getBookedCountToday() {
        return bookedCountToday;
    }

    public void setBookedCountToday(int bookedCountToday) {
        this.bookedCountToday = bookedCountToday;
    }
} 