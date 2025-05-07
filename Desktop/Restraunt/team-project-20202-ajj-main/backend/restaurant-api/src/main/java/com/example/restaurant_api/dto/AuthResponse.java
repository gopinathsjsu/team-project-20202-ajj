package com.example.restaurant_api.dto;

import com.example.restaurant_api.security.Role;

public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String phoneNumber;
    private Role role;

    // Default constructor
    public AuthResponse() {}

    // All-args constructor
    public AuthResponse(String token, String email, String name, String phoneNumber, Role role) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
} 