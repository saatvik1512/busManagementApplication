package com.example.busManagement.busManagement.respository;

import com.example.busManagement.busManagement.entities.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

//public interface AdminRepository extends MongoRepository<Admin, String> {
//    Optional<Admin> findByUsername(String username);
//}

public interface AdminRepository extends MongoRepository<Admin, String> {
    Optional<Admin> findByUsername(String username);
    // Add methods specific to Admin if needed
     List<Admin> findByCity(String city); // Useful for SuperAdmin
    // List<Admin> findByManagingSuperAdminId(String superAdminId); // If needed
}