package com.example.busManagement.busManagement.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;

    @DBRef
    private Bus bus;

    @DBRef
    private Passenger passenger;

    private List<Integer> seatNumbers;
    private Date bookingDate;
    private String status; // CONFIRMED, CANCELLED, etc.

    // Passenger details at time of booking
    private String passengerName;
    private String passengerEmail;
    private String passengerPhone;
}