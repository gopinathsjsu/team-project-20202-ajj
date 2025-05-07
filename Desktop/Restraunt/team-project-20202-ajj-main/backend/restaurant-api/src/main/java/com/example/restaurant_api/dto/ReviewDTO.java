package com.example.restaurant_api.dto;

import java.time.LocalDate;

public class ReviewDTO {
    private String customerName;
    private String comment;
    private int rating;
    private LocalDate createdAt;

    // constructor
    public ReviewDTO(String customerName, String comment, int rating, LocalDate createdAt) {
        this.customerName = customerName;
        this.comment = comment;
        this.rating = rating;
        this.createdAt = createdAt;
    }

    // getters
    public String getCustomerName() { return customerName; }
    public String getComment() { return comment; }
    public int getRating() { return rating; }
    public LocalDate getCreatedAt() { return createdAt; }
}
