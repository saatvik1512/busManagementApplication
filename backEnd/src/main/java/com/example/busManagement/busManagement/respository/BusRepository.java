package com.example.busManagement.busManagement.respository;

import com.example.busManagement.busManagement.entities.Bus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BusRepository extends MongoRepository<Bus, String> {
    List<Bus> findByCity(String city);
    List<Bus> findByAdminId(String adminId);
}
