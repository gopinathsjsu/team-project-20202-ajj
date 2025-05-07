package com.example.restaurant_api.dto;

import java.util.List;

public class RestaurantDTO {
    private Long id;
    private String name;
    private String cuisine;
    private String location;
    private double rating;
    private String imageUrl;
    private int bookedCount;
    private String time;
    private int partySize;
    private List<String> availableTimeSlots;

    // ✅ New fields for location coordinates
    private Double lat;
    private Double lng;

    // Default constructor
    public RestaurantDTO() {}

    // Constructor for basic restaurant info
    public RestaurantDTO(Long id, String name, String cuisine, String location, double rating, String imageUrl, int bookedCount) {
        this.id = id;
        this.name = name;
        this.cuisine = cuisine;
        this.location = location;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.bookedCount = bookedCount;
    }

    // Constructor with time and party size
    public RestaurantDTO(Long id, String name, String cuisine, String location, double rating, String imageUrl, int bookedCount, String time, int partySize) {
        this.id = id;
        this.name = name;
        this.cuisine = cuisine;
        this.location = location;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.bookedCount = bookedCount;
        this.time = time;
        this.partySize = partySize;
    }

    // Constructor with available slots
    public RestaurantDTO(Long id, String name, String cuisine, String location, double rating, String imageUrl, int bookedCount, List<String> availableTimeSlots) {
        this.id = id;
        this.name = name;
        this.cuisine = cuisine;
        this.location = location;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.bookedCount = bookedCount;
        this.availableTimeSlots = availableTimeSlots;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public int getBookedCount() { return bookedCount; }
    public void setBookedCount(int bookedCount) { this.bookedCount = bookedCount; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public int getPartySize() { return partySize; }
    public void setPartySize(int partySize) { this.partySize = partySize; }

    public List<String> getAvailableTimeSlots() { return availableTimeSlots; }
    public void setAvailableTimeSlots(List<String> availableTimeSlots) { this.availableTimeSlots = availableTimeSlots; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
}
