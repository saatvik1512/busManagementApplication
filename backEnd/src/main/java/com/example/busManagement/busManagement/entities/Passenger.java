package com.example.busManagement.busManagement.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "passengers")
public class Passenger extends User {

    private String name;
    private String phoneNumber;
    private String email;

    @DBRef
    private List<Booking> bookings = new ArrayList<>();

    public Passenger(String username, String password, String name, String phoneNumber, String email) {
        this.setUsername(username);
        this.setPassword(password);
        this.setRole("ROLE_PASSENGER");
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }
}