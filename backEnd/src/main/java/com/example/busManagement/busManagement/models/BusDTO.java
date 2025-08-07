package com.example.busManagement.busManagement.models;


import com.example.busManagement.busManagement.entities.Stop;
import lombok.Data;

import java.util.List;

@Data
public class BusDTO {
    private String id;
    private String busNumber;
    private String busName;
    private String city;
    private String companyName; // Admin's company name
    private List<Stop> stops;

    public BusDTO(String id, String busNumber, String busName,
                  String city, String companyName, List<Stop> stops) {
        this.id = id;
        this.busNumber = busNumber;
        this.busName = busName;
        this.city = city;
        this.companyName = companyName;
        this.stops = stops;
    }
}
