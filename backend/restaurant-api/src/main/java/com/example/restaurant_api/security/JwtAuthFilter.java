package com.example.restaurant_api.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        System.out.println("=== JwtAuthFilter START ===");
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Request Method: " + request.getMethod());

        final String authHeader = request.getHeader("Authorization");
        System.out.println("Auth Header: " + authHeader);
        final String token;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No valid auth header found, proceeding with chain");
            chain.doFilter(request, response);
            return;
        }

        token = authHeader.substring(7);
        if (!jwtService.validateToken(token)) {
            System.out.println("Invalid token, proceeding with chain");
            chain.doFilter(request, response);
            return;
        }

        System.out.println("Token validated successfully");
        String email = jwtService.extractEmail(token);
        String role = jwtService.extractRole(token);

        // Create authentication with proper role prefix
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                email, 
                null, 
                Collections.singleton(authority)
        );

        // For debugging
        System.out.println("User: " + email);
        System.out.println("Role: " + authority.getAuthority());
        System.out.println("Setting authentication in SecurityContext");
        
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        System.out.println("Authentication set, proceeding with chain");
        System.out.println("=== JwtAuthFilter END ===");
        
        chain.doFilter(request, response);
    }
}
