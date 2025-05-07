package com.example.restaurant_api.service;

import com.example.restaurant_api.entity.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendBookingConfirmation(Booking booking) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(booking.getUser().getEmail());
        message.setSubject("Booking Confirmation - " + booking.getRestaurant().getName());
        
        String emailContent = String.format(
            "Dear %s,\n\n" +
            "Your reservation at %s has been confirmed!\n\n" +
            "Details:\n" +
            "Date: %s\n" +
            "Time: %s\n" +
            "Party Size: %d\n" +
            "Table Number: %s\n\n" +
            "Special Requests: %s\n\n" +
            "Thank you for choosing our service!\n\n" +
            "Best regards,\n" +
            "Restaurant Booking Team",
            booking.getUser().getName(),
            booking.getRestaurant().getName(),
            booking.getDate(),
            booking.getTime(),
            booking.getPartySize(),
            booking.getTable().getTableNumber(),
            booking.getSpecialRequest() != null ? booking.getSpecialRequest() : "None"
        );
        
        message.setText(emailContent);
        emailSender.send(message);
    }

    public void sendCancellationConfirmation(Booking booking) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(booking.getUser().getEmail());
        message.setSubject("Booking Cancellation - " + booking.getRestaurant().getName());
        
        String emailContent = String.format(
            "Dear %s,\n\n" +
            "Your reservation at %s has been cancelled.\n\n" +
            "Cancelled Booking Details:\n" +
            "Date: %s\n" +
            "Time: %s\n" +
            "Party Size: %d\n\n" +
            "If you did not request this cancellation, please contact us immediately.\n\n" +
            "Best regards,\n" +
            "Restaurant Booking Team",
            booking.getUser().getName(),
            booking.getRestaurant().getName(),
            booking.getDate(),
            booking.getTime(),
            booking.getPartySize()
        );
        
        message.setText(emailContent);
        emailSender.send(message);
    }
} 