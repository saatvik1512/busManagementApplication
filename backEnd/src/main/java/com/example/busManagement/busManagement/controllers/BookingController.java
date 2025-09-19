package com.example.busManagement.busManagement.controllers;

import com.example.busManagement.busManagement.entities.Booking;
import com.example.busManagement.busManagement.models.BookingDTO;
import com.example.busManagement.busManagement.services.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> bookingRequest,
                                           Authentication authentication) {
        try {
            String busId = (String) bookingRequest.get("busId");
            List<Integer> seatNumbers = (List<Integer>) bookingRequest.get("seatNumbers");
            String passengerName = (String) bookingRequest.get("passengerName");
            String passengerEmail = (String) bookingRequest.get("passengerEmail");
            String passengerPhone = (String) bookingRequest.get("passengerPhone");

            String passengerId = authentication.getName(); // Get logged-in passenger ID

            Booking booking = bookingService.createBooking(busId, passengerId, seatNumbers,
                    passengerName, passengerEmail, passengerPhone);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

//    @GetMapping("/my-bookings")
//    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
//        String passengerId = authentication.getName();
//        List<Booking> bookings = bookingService.getBookingsByPassenger(passengerId);
//        return ResponseEntity.ok(bookings);
//    }
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDTO>> getMyBookings(Authentication authentication) {
        String passengerUsername = authentication.getName();
        List<BookingDTO> bookings = bookingService.getBookingsByPassengerAsDTO(passengerUsername);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/bus/{busId}")
    public ResponseEntity<List<Booking>> getBookingsByBus(@PathVariable String busId) {
        List<Booking> bookings = bookingService.getBookingsByBus(busId);
        return ResponseEntity.ok(bookings);
    }

//    @DeleteMapping("/{bookingId}")
//    public ResponseEntity<?> cancelBooking(@PathVariable String bookingId) {
//        try {
//            bookingService.cancelBooking(bookingId);
//            return ResponseEntity.ok("Booking cancelled successfully");
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> cancelBooking(@PathVariable String bookingId, Authentication authentication) {
        try {
            String passengerUsername = authentication.getName();
            bookingService.cancelBooking(bookingId, passengerUsername);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/bus/{busId}/available-seats")
    public ResponseEntity<Integer> getAvailableSeats(@PathVariable String busId) {
        try {
            int availableSeats = bookingService.getAvailableSeatsCount(busId);
            return ResponseEntity.ok(availableSeats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(-1);
        }
    }
}