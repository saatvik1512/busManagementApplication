package com.example.busManagement.busManagement.respository;

import com.example.busManagement.busManagement.entities.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByPassengerId(String passengerId);
    List<Booking> findByBusId(String busId);
    Optional<Booking> findByBusIdAndSeatNumbersContaining(String busId, int seatNumber);
    List<Booking> findByPassenger_Username(String username);
}