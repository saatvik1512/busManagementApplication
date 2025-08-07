package com.example.busManagement.busManagement.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
@EqualsAndHashCode(callSuper = true) // Important for inheritance
@Document(collection = "admins") // Keep specific collection for Admin
public class Admin extends User { // Extend User

    // Inherit id, username, password, city, role from User

    private String companyName;
    private String licenseNumber;

    // Link to the managing SuperAdmin
    @DBRef
    @JsonIgnore
    private SuperAdmin managingSuperAdmin; // Add this field

    @DBRef
    @JsonIgnore
    private List<Bus> buses = new ArrayList<>();

    // Constructor to initialize role
    public Admin(String username, String password, String companyName, String licenseNumber, String city, SuperAdmin managingSuperAdmin) {
        this.setUsername(username); // Set inherited field
        this.setPassword(password); // Set inherited field
        this.setCity(city);         // Set inherited field
        this.setRole("ROLE_ADMIN"); // Set inherited role
        this.companyName = companyName;
        this.licenseNumber = licenseNumber;
        this.managingSuperAdmin = managingSuperAdmin;
        // buses initialized above or in constructor body if needed
    }

    public void addBus(Bus bus) {
        this.buses.add(bus);
    }
}