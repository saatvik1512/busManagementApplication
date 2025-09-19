package com.example.busManagement.busManagement.services;

import com.example.busManagement.busManagement.entities.Booking;
import com.example.busManagement.busManagement.entities.Bus;
import com.example.busManagement.busManagement.entities.Passenger;
import com.example.busManagement.busManagement.entities.Bus.Seat;
import com.example.busManagement.busManagement.models.BookingDTO;
import com.example.busManagement.busManagement.respository.BookingRepository;
import com.example.busManagement.busManagement.respository.BusRepository;
import com.example.busManagement.busManagement.respository.PassengerRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BusRepository busRepository;
    private final PassengerRepository passengerRepository;

    public BookingService(BookingRepository bookingRepository,
                          BusRepository busRepository,
                          PassengerRepository passengerRepository) {
        this.bookingRepository = bookingRepository;
        this.busRepository = busRepository;
        this.passengerRepository = passengerRepository;
    }

    public Booking createBooking(String busId, String passengerUsername, List<Integer> seatNumbers,
                                String passengerName, String passengerEmail, String passengerPhone) {
        // Check if bus exists
        Optional<Bus> busOptional = busRepository.findById(busId);
        if (busOptional.isEmpty()) {
            throw new RuntimeException("Bus not found");
        }

        // Get passenger by username
        Optional<Passenger> passengerOptional = passengerRepository.findByUsername(passengerUsername);
        if (passengerOptional.isEmpty()) {
            throw new RuntimeException("Passenger not found");
        }

        Bus bus = busOptional.get();
        Passenger passenger = passengerOptional.get();

        // CRITICAL FIX: Store the actual MongoDB ID, not the username
        String passengerMongoId = passenger.getId();

        // Check if seats are available
        for (int seatNumber : seatNumbers) {
            if (seatNumber < 1 || seatNumber > bus.getTotalSeats()) {
                throw new RuntimeException("Invalid seat number: " + seatNumber);
            }
            Seat seat = bus.getSeats().get(seatNumber - 1);
            if (!seat.isAvailable()) {
                throw new RuntimeException("Seat " + seatNumber + " is already booked");
            }
        }

        // Create booking
        Booking booking = new Booking();
        booking.setBus(bus);
        booking.setPassenger(passenger);
        booking.setSeatNumbers(seatNumbers);
        booking.setBookingDate(new Date());
        booking.setStatus("CONFIRMED");
        booking.setPassengerName(passengerName);
        booking.setPassengerEmail(passengerEmail);
        booking.setPassengerPhone(passengerPhone);

        // Update seat availability - STORE MONGODB ID HERE
        for (int seatNumber : seatNumbers) {
            Seat seat = bus.getSeats().get(seatNumber - 1);
            seat.setAvailable(false);
            seat.setPassengerId(passengerMongoId); // CRITICAL FIX
        }

        // Save bus with updated seats
        busRepository.save(bus);
        // Save booking
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByPassenger(String passengerUsername) {
        Passenger passenger = passengerRepository.findByUsername(passengerUsername)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        // Then find bookings by the actual MongoDB ID
        return bookingRepository.findByPassengerId(passenger.getId());
    }

    public List<Booking> getBookingsByBus(String busId) {
        return bookingRepository.findByBusId(busId);
    }

    public void cancelBooking(String bookingId) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOptional.get();
        Bus bus = booking.getBus();

        // Update seat availability
        for (int seatNumber : booking.getSeatNumbers()) {
            Seat seat = bus.getSeats().get(seatNumber - 1);
            seat.setAvailable(true);
            seat.setPassengerId(null);
        }

        // Update booking status
        booking.setStatus("CANCELLED");

        // Save changes
        busRepository.save(bus);
        bookingRepository.save(booking);
    }

    public int getAvailableSeatsCount(String busId) {
        Optional<Bus> busOptional = busRepository.findById(busId);
        if (busOptional.isEmpty()) {
            throw new RuntimeException("Bus not found");
        }

        Bus bus = busOptional.get();
        int count = 0;
        for (Seat seat : bus.getSeats()) {
            if (seat.isAvailable()) {
                count++;
            }
        }
        return count;
    }
    // Add this method to convert Booking to BookingDTO
    public BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setBusId(booking.getBus().getId());
        dto.setBusNumber(booking.getBus().getBusNumber());
        dto.setBusName(booking.getBus().getBusName());
        dto.setCity(booking.getBus().getCity());
        dto.setSeatNumbers(booking.getSeatNumbers());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStatus(booking.getStatus());
        dto.setPassengerName(booking.getPassengerName());
        dto.setPassengerEmail(booking.getPassengerEmail());
        dto.setPassengerPhone(booking.getPassengerPhone());
        return dto;
    }

    // Add this method to get bookings as DTOs
    public List<BookingDTO> getBookingsByPassengerAsDTO(String passengerUsername) {
        List<Booking> bookings = getBookingsByPassenger(passengerUsername);
        return bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void cancelBooking(String bookingId, String passengerUsername) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOptional.get();

        // Verify the booking belongs to the passenger
        if (!booking.getPassenger().getUsername().equals(passengerUsername)) {
            throw new RuntimeException("You can only cancel your own bookings");
        }

        Bus bus = booking.getBus();

        // Update seat availability
        for (int seatNumber : booking.getSeatNumbers()) {
            Seat seat = bus.getSeats().get(seatNumber - 1);
            seat.setAvailable(true);
            seat.setPassengerId(null);
        }

        // Update booking status
        booking.setStatus("CANCELLED");

        // Save changes
        busRepository.save(bus);
        bookingRepository.save(booking);
    }
}