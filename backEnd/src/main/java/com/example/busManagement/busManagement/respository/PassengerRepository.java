package com.example.busManagement.busManagement.respository;

import com.example.busManagement.busManagement.entities.Passenger;
import org.springframework.data.mongodb.repository.MongoRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface PassengerRepository extends MongoRepository<Passenger, String> {
    Optional<Passenger> findByUsername(String username);
    Optional<Passenger> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
