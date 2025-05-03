package com.example.restaurant_api.dto;

import java.util.Map;
import java.util.List;

public class ReservationAnalytics {
    private int totalReservations;
    private Map<String, Integer> reservationsByRestaurant;
    private Map<String, Integer> reservationsByDate;
    private Map<String, Integer> reservationsByTimeSlot;
    private double averagePartySize;
    private List<Map<String, Object>> topRestaurants;

    public ReservationAnalytics() {}

    public int getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(int totalReservations) {
        this.totalReservations = totalReservations;
    }

    public Map<String, Integer> getReservationsByRestaurant() {
        return reservationsByRestaurant;
    }

    public void setReservationsByRestaurant(Map<String, Integer> reservationsByRestaurant) {
        this.reservationsByRestaurant = reservationsByRestaurant;
    }

    public Map<String, Integer> getReservationsByDate() {
        return reservationsByDate;
    }

    public void setReservationsByDate(Map<String, Integer> reservationsByDate) {
        this.reservationsByDate = reservationsByDate;
    }

    public Map<String, Integer> getReservationsByTimeSlot() {
        return reservationsByTimeSlot;
    }

    public void setReservationsByTimeSlot(Map<String, Integer> reservationsByTimeSlot) {
        this.reservationsByTimeSlot = reservationsByTimeSlot;
    }

    public double getAveragePartySize() {
        return averagePartySize;
    }

    public void setAveragePartySize(double averagePartySize) {
        this.averagePartySize = averagePartySize;
    }

    public List<Map<String, Object>> getTopRestaurants() {
        return topRestaurants;
    }

    public void setTopRestaurants(List<Map<String, Object>> topRestaurants) {
        this.topRestaurants = topRestaurants;
    }
} 