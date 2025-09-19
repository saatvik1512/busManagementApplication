package com.example.busManagement.busManagement.models;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class BookingDTO {
    private String id;
    private String busId;
    private String busNumber;
    private String busName;
    private String city;
    private List<Integer> seatNumbers;
    private Date bookingDate;
    private String status;
    // Only include the passenger details stored at booking time
    private String passengerName;
    private String passengerEmail;
    private String passengerPhone;
    // Add any other relevant information you want to display
}