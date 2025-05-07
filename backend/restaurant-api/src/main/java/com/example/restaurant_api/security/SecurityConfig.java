package com.example.restaurant_api.security;

import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/").permitAll()                                  // Home page
                .requestMatchers("/auth/**").permitAll()                          // Authentication endpoints
                .requestMatchers("/api/restaurants/**").permitAll()               // Restaurant endpoints
                .requestMatchers("/api/otp/**").permitAll()                       // OTP endpoints
                
                // Protected endpoints
                .requestMatchers("/api/bookings/**").hasAnyRole("CUSTOMER", "ADMIN", "MANAGER")  // Booking endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")                // Admin endpoints
                .requestMatchers("/api/manager/**").hasAnyRole("MANAGER", "ADMIN") // Manager endpoints
                .requestMatchers("/api/customer/**").hasRole("CUSTOMER")           // Customer endpoints
                
                // Default: require authentication for any other endpoint
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            // Add debug handler for access denied
            .exceptionHandling(handling -> handling
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    System.out.println("Access denied for request: " + request.getRequestURI());
                    System.out.println("Authentication: " + SecurityContextHolder.getContext().getAuthentication());
                    System.out.println("Exception: " + accessDeniedException.getMessage());
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: " + accessDeniedException.getMessage());
                })
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // 1 hour

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
