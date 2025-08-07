package com.example.busManagement.busManagement.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Stop {
    private String stopName;
    private String arrivalTime;
    private String departureTime;
}