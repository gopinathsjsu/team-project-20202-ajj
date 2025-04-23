package com.example.restaurant_api.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    private final Map<String, String> otpStore = new HashMap<>();
    private final Random random = new Random();

    @Value("${twilio.account.sid}")
    private String twilioSid;

    @Value("${twilio.auth.token}")
    private String twilioAuthToken;

    @Value("${twilio.phone.number}")
    private String fromPhone;

    public String sendOtp(String phoneNumber) {
        try {
            if (phoneNumber.equals(fromPhone.replace("+", ""))) {
                throw new IllegalArgumentException("❌ Cannot send OTP to the same number as the Twilio sender.");
            }

            String otp = String.format("%06d", random.nextInt(999999));
            otpStore.put(phoneNumber, otp);

            Twilio.init(twilioSid, twilioAuthToken);

            System.out.println("📤 Sending OTP to: +" + phoneNumber + " from: " + fromPhone);

            Message.creator(
                    new PhoneNumber("+" + phoneNumber),
                    new PhoneNumber(fromPhone),
                    "Your BookTable OTP is: " + otp
            ).create();

            System.out.println("✅ OTP sent successfully: " + otp);
            return otp;

        } catch (Exception e) {
            System.err.println("❌ Failed to send OTP to +" + phoneNumber);
            e.printStackTrace();
            throw new RuntimeException("OTP send failed", e);
        }
    }

    public boolean verifyOtp(String phoneNumber, String otp) {
        return otpStore.containsKey(phoneNumber) && otpStore.get(phoneNumber).equals(otp);
    }
}
