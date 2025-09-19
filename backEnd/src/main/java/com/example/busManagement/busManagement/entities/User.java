package com.example.busManagement.busManagement.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users") // Consider a common collection or separate ones
public abstract class User { // Changed to abstract

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private String password; // Stored securely (hashed)

    private String city; // Applicable to both Admin and SuperAdmin

    private String role;
}
