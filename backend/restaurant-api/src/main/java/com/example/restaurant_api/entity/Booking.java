package com.example.restaurant_api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long restaurantId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String date;
    private String time;
    
    @Column(nullable = false)
    private int partySize = 1; // Using primitive int with default value
    
    private String specialRequest;

    // Getters and Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getRestaurantId() { return restaurantId; }

    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public String getCustomerName() { return customerName; }

    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }

    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerEmail() { return customerEmail; }

    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getDate() { return date; }

    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }

    public void setTime(String time) { this.time = time; }

    public Integer getPartySize() { return partySize; }

    public void setPartySize(Integer partySize) { this.partySize = partySize != null ? partySize : 1; }

    public String getSpecialRequest() { return specialRequest; }

    public void setSpecialRequest(String specialRequest) { this.specialRequest = specialRequest; }
}
