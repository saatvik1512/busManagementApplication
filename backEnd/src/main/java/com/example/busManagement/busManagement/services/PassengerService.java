package com.example.busManagement.busManagement.services;

import com.example.busManagement.busManagement.entities.Passenger;
import com.example.busManagement.busManagement.respository.PassengerRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PassengerService {

    private final PassengerRepository passengerRepository;
    private final PasswordEncoder passwordEncoder;

    public PassengerService(PassengerRepository passengerRepository, PasswordEncoder passwordEncoder) {
        this.passengerRepository = passengerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Passenger signup(Passenger passenger) {
        if (passengerRepository.existsByUsername(passenger.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (passengerRepository.existsByEmail(passenger.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        passenger.setPassword(passwordEncoder.encode(passenger.getPassword()));
        passenger.setRole("ROLE_PASSENGER");
        return passengerRepository.save(passenger);
    }

    public Passenger login(String username, String password) {
        return passengerRepository.findByUsername(username)
                .filter(passenger -> passwordEncoder.matches(password, passenger.getPassword()))
                .orElse(null);
    }
}