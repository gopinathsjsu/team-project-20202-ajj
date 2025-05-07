package com.example.restaurant_api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant_review")
public class RestaurantReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(name = "reviewer_name", nullable = false)
    private String reviewerName;

    @Column(nullable = false)
    private float rating;

    @Column(name = "review_text", nullable = false)
    private String reviewText;

    @Column(name = "review_date")
    private LocalDateTime reviewDate;

    // Default constructor
    public RestaurantReview() {}

    // Constructor with fields
    public RestaurantReview(Restaurant restaurant, String reviewerName, float rating, String reviewText) {
        this.restaurant = restaurant;
        this.reviewerName = reviewerName;
        this.rating = rating;
        this.reviewText = reviewText;
        this.reviewDate = LocalDateTime.now();
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

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public LocalDateTime getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }
} 