package com.example.restaurant_api.controller;

import com.example.restaurant_api.dto.ReviewDTO;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @GetMapping("/restaurant/{restaurantId}")
    public List<ReviewDTO> getReviews(@PathVariable Long restaurantId) {
        // Return same hardcoded reviews for any restaurant
        return Arrays.asList(
            new ReviewDTO("Alice", "Amazing food and service!", 5, LocalDate.of(2025, 5, 1)),
            new ReviewDTO("Bob", "Great ambiance and tasty dishes.", 4, LocalDate.of(2025, 5, 2)),
            new ReviewDTO("Charlie", "Service was a bit slow.", 3, LocalDate.of(2025, 5, 3))
        );
    }
}
