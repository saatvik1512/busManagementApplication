package com.example.busManagement.busManagement.respository;

import com.example.busManagement.busManagement.entities.SuperAdmin;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface SuperAdminRepository extends MongoRepository<SuperAdmin, String> {
    Optional<SuperAdmin> findByUsername(String username);
    Optional<SuperAdmin> findByCity(String city); // Crucial for finding the city's SuperAdmin
}
