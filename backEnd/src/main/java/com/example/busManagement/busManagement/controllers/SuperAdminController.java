package com.example.busManagement.busManagement.controllers;

import com.example.busManagement.busManagement.entities.Admin;
import com.example.busManagement.busManagement.entities.Bus;
import com.example.busManagement.busManagement.entities.SuperAdmin;
import com.example.busManagement.busManagement.models.BusDTO;
import com.example.busManagement.busManagement.respository.AdminRepository;
import com.example.busManagement.busManagement.respository.BusRepository;
import com.example.busManagement.busManagement.respository.SuperAdminRepository;
import com.example.busManagement.busManagement.services.BusService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/superadmin")
public class SuperAdminController {

    private final SuperAdminRepository superAdminRepository;
    private final AdminRepository adminRepository;
    private final BusRepository busRepository;
    private final BusService busService;
    private final PasswordEncoder passwordEncoder;

    public SuperAdminController(SuperAdminRepository superAdminRepository,
                                AdminRepository adminRepository,
                                BusRepository busRepository,
                                BusService busService, PasswordEncoder passwordEncoder) {
        this.superAdminRepository = superAdminRepository;
        this.adminRepository = adminRepository;
        this.busRepository = busRepository;
        this.busService = busService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<SuperAdmin> signup(@RequestBody SuperAdmin superAdmin) {
        if (superAdminRepository.findByCity(superAdmin.getCity()).isPresent()){
            return ResponseEntity.status(400).body(null);
        }
        superAdmin.setPassword(passwordEncoder.encode(superAdmin.getPassword()));
        superAdmin.setRole("ROLE_SUPER_ADMIN");
        return ResponseEntity.ok(superAdminRepository.save(superAdmin));
    }


    // Create Admin Account
//    @PostMapping("/admins")
//    public ResponseEntity<Admin> createAdmin(
//            @RequestBody Admin admin,
//            Authentication authentication) {
//
//        // Get current SuperAdmin
//        String username = authentication.getName();
//        SuperAdmin superAdmin = superAdminRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("SuperAdmin not found"));
//
//        // Link admin to SuperAdmin's city
//        admin.setCity(superAdmin.getCity());
//        admin.setManagingSuperAdmin(superAdmin);
//        admin.setRole("ROLE_ADMIN");
//
//        return ResponseEntity.ok(adminRepository.save(admin));
//    }

    @PostMapping("/admins")
    public ResponseEntity<Admin> createAdmin(
            @RequestBody Admin adminDetails,
            Authentication authentication) {

        // Check if username exists
        if (adminRepository.findByUsername(adminDetails.getUsername()).isPresent() ||
                superAdminRepository.findByUsername(adminDetails.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Get superadmin
        String username = authentication.getName();
        SuperAdmin superAdmin = superAdminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("SuperAdmin not found"));

        // Create admin with encoded password
        Admin newAdmin = new Admin(
                adminDetails.getUsername(),
                passwordEncoder.encode(adminDetails.getPassword()), // Encode here
                adminDetails.getCompanyName(),
                adminDetails.getLicenseNumber(),
                superAdmin.getCity(),
                superAdmin
        );
        newAdmin.setRole("ROLE_ADMIN");

        return ResponseEntity.ok(adminRepository.save(newAdmin));
    }

    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> listAdmins(Authentication authentication) {
        String username = authentication.getName();
        SuperAdmin superAdmin = superAdminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("SuperAdmin not found"));

        List<Admin> admins = adminRepository.findByCity(superAdmin.getCity());
        return ResponseEntity.ok(admins);
    }

//    @PutMapping("/admins/{adminId}")
//    public ResponseEntity<Admin> updateAdmin(
//            @PathVariable String adminId,
//            @RequestBody Admin updatedAdmin,
//            Authentication authentication) {
//
//        // Get current SuperAdmin
//        String username = authentication.getName();
//        SuperAdmin superAdmin = superAdminRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("SuperAdmin not found"));
//
//        // Find and validate admin
//        Admin admin = adminRepository.findById(adminId)
//                .orElseThrow(() -> new RuntimeException("Admin not found"));
//
//        if (!admin.getCity().equals(superAdmin.getCity())) {
//            throw new RuntimeException("Admin not in your city");
//        }
//
//        // Check if username is being changed
//        if (updatedAdmin.getUsername() != null &&
//                !updatedAdmin.getUsername().equals(admin.getUsername())) {
//
//            // Check if new username is available
//            if (adminRepository.findByUsername(updatedAdmin.getUsername()).isPresent() ||
//                    superAdminRepository.findByUsername(updatedAdmin.getUsername()).isPresent()) {
//                throw new RuntimeException("Username already exists");
//            }
//        }
//
//        // Update fields
//        if (updatedAdmin.getUsername() != null) {
//            admin.setUsername(updatedAdmin.getUsername());
//        }
//        if (updatedAdmin.getPassword() != null) {
//            // Encode the new password
//            admin.setPassword(passwordEncoder.encode(updatedAdmin.getPassword()));
//        }
//        if (updatedAdmin.getCompanyName() != null) {
//            admin.setCompanyName(updatedAdmin.getCompanyName());
//        }
//        if (updatedAdmin.getLicenseNumber() != null) {
//            admin.setLicenseNumber(updatedAdmin.getLicenseNumber());
//        }
//
//        return ResponseEntity.ok(adminRepository.save(admin));
//    }

    @PutMapping("/admins/{adminId}")
    public ResponseEntity<Admin> updateAdmin(
            @PathVariable String adminId,
            @RequestBody Admin updatedAdmin,
            Authentication authentication) {

        // Get current SuperAdmin
        String username = authentication.getName();
        SuperAdmin superAdmin = superAdminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("SuperAdmin not found"));

        // Find and validate admin
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!admin.getCity().equals(superAdmin.getCity())) {
            throw new RuntimeException("Admin not in your city");
        }

        // Check if username is being changed
        if (updatedAdmin.getUsername() != null &&
                !updatedAdmin.getUsername().equals(admin.getUsername())) {

            // Check if new username is available
            if (adminRepository.findByUsername(updatedAdmin.getUsername()).isPresent() ||
                    superAdminRepository.findByUsername(updatedAdmin.getUsername()).isPresent()) {
                throw new RuntimeException("Username already exists");
            }
            admin.setUsername(updatedAdmin.getUsername());
        }

        // Update password with proper encoding
        if (updatedAdmin.getPassword() != null && !updatedAdmin.getPassword().isEmpty()) {
            admin.setPassword(passwordEncoder.encode(updatedAdmin.getPassword()));
        }

        // Update other fields
        if (updatedAdmin.getCompanyName() != null) {
            admin.setCompanyName(updatedAdmin.getCompanyName());
        }
        if (updatedAdmin.getLicenseNumber() != null) {
            admin.setLicenseNumber(updatedAdmin.getLicenseNumber());
        }

        return ResponseEntity.ok(adminRepository.save(admin));
    }

    // Delete Admin Account
    @DeleteMapping("/admins/{adminId}")
    public ResponseEntity<?> deleteAdmin(
            @PathVariable String adminId,
            Authentication authentication) {

        String username = authentication.getName();
        SuperAdmin superAdmin = superAdminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("SuperAdmin not found"));

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!admin.getCity().equals(superAdmin.getCity())) {
            throw new RuntimeException("Admin not in your city");
        }

        adminRepository.delete(admin);
        return ResponseEntity.ok().build();
    }

    // View Buses (Read-Only)
    @GetMapping("/buses")
    public ResponseEntity<List<BusDTO>> viewBuses(Authentication authentication) {
        String username = authentication.getName();
        SuperAdmin superAdmin = superAdminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("SuperAdmin not found"));

        List<Bus> buses = busRepository.findByCity(superAdmin.getCity());

        List<BusDTO> busDTOs = buses.stream()
                .map(bus -> new BusDTO(
                        bus.getId(),
                        bus.getBusNumber(),
                        bus.getBusName(),
                        bus.getCity(),
                        bus.getAdmin().getCompanyName(),
                        bus.getStops()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(busDTOs);
    }
}