package com.example.restaurant_api.controller;

import com.example.restaurant_api.dto.AuthResponse;
import com.example.restaurant_api.entity.User;
import com.example.restaurant_api.repository.UserRepository;
import com.example.restaurant_api.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") // ✅ Enable frontend to call this
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        
        user.setPassword(encoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        
        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole());
        AuthResponse response = new AuthResponse(
            token,
            savedUser.getEmail(),
            savedUser.getName(),
            savedUser.getPhoneNumber(),
            savedUser.getRole()
        );
                
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body("User not found");
        }

        User user = userOpt.get();
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(403).body("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        AuthResponse response = new AuthResponse(
            token,
            user.getEmail(),
            user.getName(),
            user.getPhoneNumber(),
            user.getRole()
        );

        return ResponseEntity.ok(response);
    }
}
