package com.example.busManagement.busManagement.services;


import com.example.busManagement.busManagement.entities.*;
import com.example.busManagement.busManagement.models.BusDTO;
import com.example.busManagement.busManagement.respository.AdminRepository;
import com.example.busManagement.busManagement.respository.BusRepository;
import com.example.busManagement.busManagement.respository.SuperAdminRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication; // Add import
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Add import

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BusService {

    private final BusRepository busRepository;
    private final AdminRepository adminRepository;
    private final SuperAdminRepository superAdminRepository; // Add dependency if you created it

    // Update constructor to include SuperAdminRepository if needed
    public BusService(BusRepository busRepository, AdminRepository adminRepository, SuperAdminRepository superAdminRepository) {
        this.busRepository = busRepository;
        this.adminRepository = adminRepository;
        this.superAdminRepository = superAdminRepository; // Assign dependency
    }
    // If you haven't created SuperAdminRepository yet, use this simpler constructor temporarily:
    // public BusService(BusRepository busRepository, AdminRepository adminRepository) {
    //     this.busRepository = busRepository;
    //     this.adminRepository = adminRepository;
    //     this.superAdminRepository = null; // Or handle appropriately
    // }


    public List<BusDTO> getBusesForAdmin(Authentication authentication) {
        String username = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String userRole = authorities.stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_UNKNOWN");

        if ("ROLE_ADMIN".equals(userRole)) {
            // 1. Find the admin
            Admin admin = adminRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Admin not found: " + username));

            // 2. Explicitly find buses associated with this admin's ID
            // This requires a method in your BusRepository
            List<Bus> adminBuses = busRepository.findByAdminId(admin.getId());

            // 3. Convert Bus entities to BusDTOs
            // Use the admin object we already have for the company name
            return adminBuses.stream()
                    .map(bus -> new BusDTO(
                            bus.getId(),
                            bus.getBusNumber(),
                            bus.getBusName(),
                            bus.getCity(),
                            admin.getCompanyName(), // Use company name from the loaded admin
                            bus.getStops()
                    ))
                    .collect(Collectors.toList());
        } else if ("ROLE_SUPER_ADMIN".equals(userRole)) {
            // Handle SuperAdmin case if needed, or throw an exception
            // As discussed before, maybe restrict endpoint access instead
            throw new SecurityException("SuperAdmins should use /api/superadmin/buses endpoint.");
        } else {
            throw new SecurityException("Unauthorized access to get buses.");
        }
    }



    // Add this method to the BusService class
    private void initializeSeats(Bus bus) {
        int totalSeats = bus.getTotalSeats();
        List<Bus.Seat> seats = new ArrayList<>();

        for (int i = 1; i <= totalSeats; i++) {
            Bus.Seat seat = new Bus.Seat();
            seat.setSeatNumber(i);
            seat.setAvailable(true);
            seat.setPassengerId(null);
            seats.add(seat);
        }

        bus.setSeats(seats);
    }

    // Updated method signature to accept Authentication
    public Bus addBus(Bus bus, Authentication authentication) {
        String username = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String userRole = authorities.stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_UNKNOWN");

        Admin admin = null;
        SuperAdmin superAdmin = null; // If applicable

        if ("ROLE_ADMIN".equals(userRole)) {
            admin = adminRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            // Current logic: Bus is associated with the Admin who creates it
            if (!admin.getCity().equalsIgnoreCase(bus.getCity())){
                throw new SecurityException("Cannot add bus. Admin city (" + admin.getCity() + ") does not match bus city (" + bus.getCity() + ").");
            }

            bus.setAdmin(admin);
        } else if ("ROLE_SUPER_ADMIN".equals(userRole) && superAdminRepository != null) {
            superAdmin = superAdminRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("SuperAdmin not found"));
            if (!bus.getCity().equalsIgnoreCase(superAdmin.getCity())) {
                throw new SecurityException("SuperAdmin can only add buses in their own city.");
            }
            admin = adminRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Associated Admin account not found for SuperAdmin: " + username + ". SuperAdmins should manage via Admin accounts or specific endpoints."));
            if (!admin.getCity().equalsIgnoreCase(superAdmin.getCity())) {
                throw new IllegalStateException("Associated Admin city does not match SuperAdmin city. Data inconsistency.");
            }
            bus.setAdmin(admin);
            // Alternatively, if SuperAdmins create buses without direct Admin ownership,
            // you'd need a different approach, perhaps a placeholder Admin or direct SuperAdmin link.
            // This requires more design decision. For now, treat like Admin.
        } else {
            throw new SecurityException("Unauthorized: User role not permitted to add buses.");
        }

        initializeSeats(bus);
        Bus savedBus = busRepository.save(bus);
        if (admin != null) { // Add bus to admin's list only if admin is involved
            // Add bus to admin's list
            admin.addBus(savedBus);
            adminRepository.save(admin);
        }
        return savedBus;
    }


    public List<BusDTO> searchBuses(String start, String end, String city) {
        List<Bus> cityBuses = busRepository.findByCity(city);
        return cityBuses.stream()
                .filter(bus -> hasValidRoute(bus, start, end))
                .map(bus -> new BusDTO(
                        bus.getId(),
                        bus.getBusNumber(),
                        bus.getBusName(),
                        bus.getCity(),
                        bus.getAdmin().getCompanyName(), // Get company name
                        bus.getStops()
                ))
                .collect(Collectors.toList());
    }

    private boolean hasValidRoute(Bus bus, String start, String end) {
        List<Stop> stops = bus.getStops();
        int startIndex = -1;
        int endIndex = -1;
        for (int i = 0; i < stops.size(); i++) {
            if (stops.get(i).getStopName().equalsIgnoreCase(start)) {
                startIndex = i;
            }
            if (stops.get(i).getStopName().equalsIgnoreCase(end) && startIndex != -1) {
                endIndex = i;
                break;
            }
        }
        return startIndex != -1 && endIndex != -1 && startIndex < endIndex;
    }

    // Updated method signature to accept Authentication
    public Bus updateBus(String busId, Bus updatedBus, Authentication authentication) {
        String username = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String userRole = authorities.stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_UNKNOWN");

        Bus existingBus = busRepository.findById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found"));

        boolean isAuthorized = false;

        if ("ROLE_ADMIN".equals(userRole)) {
            // Verify admin owns the bus (existing logic)
            if (existingBus.getAdmin().getUsername().equals(username)) {
                isAuthorized = true;
            } else {
                throw new RuntimeException("Unauthorized: You don't own this bus");
            }
        } else if ("ROLE_SUPER_ADMIN".equals(userRole)) {
            // Future logic: Allow SuperAdmin to update any bus in their city
            // Requires SuperAdminRepository and SuperAdmin entity
            if (superAdminRepository != null) {
                SuperAdmin superAdmin = superAdminRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("SuperAdmin not found"));
                if (existingBus.getCity().equalsIgnoreCase(superAdmin.getCity())) {
                    isAuthorized = true;
                    // Optionally log or handle SuperAdmin override
                } else {
                    throw new RuntimeException("Unauthorized: SuperAdmin can only manage buses in their city.");
                }
            } else {
                // If SuperAdminRepository not available, deny or fallback logic needed
                throw new RuntimeException("SuperAdmin functionality not fully configured.");
            }
        } else {
            throw new SecurityException("Unauthorized: User role not permitted to update buses.");
        }

        if (isAuthorized) {
            validateBusUpdate(updatedBus);
            // Update fields if provided
            if (updatedBus.getBusNumber() != null) {
                existingBus.setBusNumber(updatedBus.getBusNumber());
            }
            if (updatedBus.getBusName() != null) {
                existingBus.setBusName(updatedBus.getBusName());
            }
            if (updatedBus.getCity() != null) {
                existingBus.setCity(updatedBus.getCity());
            }
            if (updatedBus.getStops() != null) {
                existingBus.setStops(updatedBus.getStops());
            }
            return busRepository.save(existingBus);
        } else {
            // This case should ideally be covered by throws above, but added for safety
            throw new SecurityException("Unauthorized access to update bus.");
        }
    }


    private void validateBusUpdate(Bus updatedBus) {
        if (updatedBus.getStops() != null) {
            Set<String> stopNames = new HashSet<>();
            for (Stop stop : updatedBus.getStops()) {
                if (stopNames.contains(stop.getStopName())) {
                    throw new RuntimeException("Duplicate stop name: " + stop.getStopName());
                }
                stopNames.add(stop.getStopName());
            }
        }
    }

    // Updated method signature to accept Authentication
    public String deleteBusById(String busId, Authentication authentication) {
        String username = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String userRole = authorities.stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_UNKNOWN");

        Optional<Admin> adminOptional = adminRepository.findByUsername(username);
        Optional<SuperAdmin> superAdminOptional = Optional.empty();
        if (superAdminRepository != null) {
            superAdminOptional = superAdminRepository.findByUsername(username);
        }


        Optional<Bus> busOptional = busRepository.findById(busId);
        if (busOptional.isEmpty()) {
            throw new NoSuchElementException("Bus with ID " + busId + " not found");
        }
        Bus bus = busOptional.get();

        boolean isAuthorized = false;

        if ("ROLE_ADMIN".equals(userRole) && adminOptional.isPresent()) {
            Admin admin = adminOptional.get();
            // Optional: Check if this bus belongs to the same city as the admin
            if (!bus.getCity().equalsIgnoreCase(admin.getCity())) {
                throw new SecurityException("You are not authorized to delete this bus (city mismatch).");
            }
            // Check if this admin owns the bus
            if (!bus.getAdmin().getId().equals(admin.getId())) {
                throw new SecurityException("You are not authorized to delete this bus (not owner).");
            }
            isAuthorized = true;

        } else if ("ROLE_SUPER_ADMIN".equals(userRole) && superAdminOptional.isPresent() && superAdminRepository != null) {
            SuperAdmin superAdmin = superAdminOptional.get();
            // Allow SuperAdmin to delete any bus in their city
            if (!bus.getCity().equalsIgnoreCase(superAdmin.getCity())) {
                throw new SecurityException("SuperAdmin can only manage buses in their city.");
            }
            isAuthorized = true;
            // Optionally log or handle SuperAdmin override

        } else {
            if("ROLE_ADMIN".equals(userRole)) {
                throw new UsernameNotFoundException("Admin not found");
            } else if ("ROLE_SUPER_ADMIN".equals(userRole)) {
                throw new UsernameNotFoundException("SuperAdmin not found");
            } else {
                throw new SecurityException("Unauthorized access.");
            }
        }

        if (isAuthorized) {
            Admin admin = bus.getAdmin();
            admin.getBuses().remove(bus);
            adminRepository.save(admin);
            busRepository.deleteById(busId);
            return "Bus with ID " + busId + " has been deleted successfully";
        } else {
            // Should be caught above, but safety net
            throw new SecurityException("Unauthorized access to delete bus.");
        }
    }

    public List<BusDTO> getAllBusesInCity(String city) {
        List<Bus> cityBuses = busRepository.findByCity(city);

        // Map Bus entities to BusDTOs (similar to searchBuses)
        return cityBuses.stream()
                .map(bus -> new BusDTO(
                        bus.getId(),
                        bus.getBusNumber(),
                        bus.getBusName(),
                        bus.getCity(),
                        bus.getAdmin().getCompanyName(), // Get company name
                        bus.getStops()
                ))
                .collect(Collectors.toList());
    }

}