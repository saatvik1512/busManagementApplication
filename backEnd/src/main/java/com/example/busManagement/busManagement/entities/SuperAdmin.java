package com.example.busManagement.busManagement.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "super_admins") // Specific collection for SuperAdmins
public class SuperAdmin extends User { // Extend User

    public SuperAdmin(String username, String password, String city) {
        this.setUsername(username); // Set inherited field
        this.setPassword(password); // Set inherited field
        this.setCity(city);         // Set inherited field
        this.setRole("ROLE_SUPER_ADMIN"); // Set inherited role
    }

    // Override role getter/setter if needed for strict control, optional
    // public String getRole() { return "ROLE_SUPER_ADMIN"; } // Force role
}