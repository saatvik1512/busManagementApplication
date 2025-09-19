package com.example.busManagement.busManagement.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

// ... existing code ...

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "buses")
public class Bus {
    @Id
    private String id;
    private String busNumber;
    private String busName;
    private String city;
    private int totalSeats;
    private List<Seat> seats;

    @DBRef
    private Admin admin;

    @JsonIgnoreProperties({"buses", "password"})
    private List<Stop> stops;

    // Make Seat class public and static
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Seat {
        private int seatNumber;
        private boolean isAvailable;
        private String passengerId; // Will be null if available
    }
}