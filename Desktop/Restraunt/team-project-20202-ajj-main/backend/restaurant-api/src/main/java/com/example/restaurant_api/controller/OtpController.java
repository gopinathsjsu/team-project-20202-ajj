package com.example.restaurant_api.controller;

import com.example.restaurant_api.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "http://localhost:3000")
public class OtpController {

    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService = otpService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@RequestParam String phoneNumber) {
        otpService.sendOtp(phoneNumber);
        return ResponseEntity.ok("OTP sent to " + phoneNumber);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@RequestParam String phoneNumber, @RequestParam String otp) {
        boolean isValid = otpService.verifyOtp(phoneNumber, otp);
        return isValid
                ? ResponseEntity.ok("OTP verified successfully!")
                : ResponseEntity.status(401).body("Invalid OTP");
    }
}
