package com.example.busManagement.busManagement.controllers;

import com.example.busManagement.busManagement.entities.Bus;
import com.example.busManagement.busManagement.models.BusDTO;
import com.example.busManagement.busManagement.services.BusService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }


    @GetMapping // This maps to GET /api/buses (relative to the class's @RequestMapping)
    public ResponseEntity<List<BusDTO>> getBusesForAdmin(Authentication authentication) {
        // Extract username/role if needed, but the service can handle it
        // Pass authentication to the service layer
        List<BusDTO> adminBuses = busService.getBusesForAdmin(authentication);
        return ResponseEntity.ok(adminBuses);
    }
    // Updated to accept Authentication
    @PostMapping
    public ResponseEntity<Bus> addBus(@RequestBody Bus bus,
                                      Authentication authentication) { // Add Authentication
        // String username = authentication.getName(); // Extract username if still needed internally
        // Pass Authentication instead of just username
        return ResponseEntity.ok(busService.addBus(bus, authentication));
    }

    @GetMapping("/search")
    public ResponseEntity<List<BusDTO>> searchBuses(
            @RequestParam String start,
            @RequestParam String end,
            @RequestParam String city) {
        return ResponseEntity.ok(busService.searchBuses(start, end, city));
    }

    // Updated to accept Authentication
    @PutMapping("/{id}")
    public ResponseEntity<Bus> updateBus(
            @PathVariable String id,
            @RequestBody Bus updatedBus,
            Authentication authentication) { // Add Authentication
        // String username = authentication.getName(); // Extract username if still needed internally
        // Pass Authentication instead of just username
        return ResponseEntity.ok(busService.updateBus(id, updatedBus, authentication));
    }

    @GetMapping("/by-city") // Or choose a different path like "/in-city" or "/list"
    public ResponseEntity<List<BusDTO>> getBusesByCity(
            @RequestParam String city) { // Takes 'city' as a query parameter
        // Call the new service method
        List<BusDTO> busesInCity = busService.getAllBusesInCity(city);
        // Return the list of BusDTOs with 200 OK status
        return ResponseEntity.ok(busesInCity);
    }

    // Already updated in previous instructions
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBus(
            @PathVariable String id,
            Authentication authentication
    ) {
        // String username = authentication.getName(); // Extract username if still needed internally
        // Pass Authentication instead of just username
        return ResponseEntity.ok(busService.deleteBusById(id, authentication));
    }
}