package com.example.busManagement.busManagement.controllers;

import com.example.busManagement.busManagement.entities.Passenger;
import com.example.busManagement.busManagement.services.PassengerService;
import com.example.busManagement.busManagement.services.CustomUserDetailsService;
import com.example.busManagement.busManagement.util.JwtTokenUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/passenger")
public class PassengerController {

    private final PassengerService passengerService;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    public PassengerController(PassengerService passengerService,
                               CustomUserDetailsService customUserDetailsService,
                               JwtTokenUtil jwtTokenUtil, PasswordEncoder passwordEncoder) {
        this.passengerService = passengerService;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Passenger passenger) {
        try {
            Passenger savedPassenger = passengerService.signup(passenger);
            return ResponseEntity.ok(savedPassenger);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @Data
    private static class LoginRequest {
        private String username;
        private String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String rawPassword = loginRequest.getPassword();

        try {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

            if (passwordEncoder.matches(rawPassword, userDetails.getPassword())) {
                String token = jwtTokenUtil.generateToken(userDetails);
                return ResponseEntity.ok(new JwtResponse(token));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
    }

    @Data
    @AllArgsConstructor
    private static class JwtResponse {
        private String token;
    }
}