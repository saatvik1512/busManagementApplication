package com.example.busManagement.busManagement.controllers;


import com.example.busManagement.busManagement.entities.Admin;
import com.example.busManagement.busManagement.services.AdminService;
import com.example.busManagement.busManagement.services.CustomUserDetailsService;
import com.example.busManagement.busManagement.util.JwtTokenUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    public AdminController(AdminService adminService,
                           CustomUserDetailsService customUserDetailsService,
                           JwtTokenUtil jwtTokenUtil, PasswordEncoder passwordEncoder) {
        this.adminService = adminService;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
    }

//    @PostMapping("/signup")
//    public ResponseEntity<Admin> signup(@RequestBody Admin admin) {
//        return ResponseEntity.ok(adminService.signup(admin));
//    }

    @Data
    private static class LoginRequest {
        private String username;
        private String password;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String rawPassword = loginRequest.getPassword();

        System.out.println("Login attempt for: " + username);

        try {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            System.out.println("User found: " + userDetails.getUsername());

            // Check if password matches
            boolean matches = passwordEncoder.matches(rawPassword, userDetails.getPassword());
            System.out.println("Password matches: " + matches);

            if (matches) {
                String token = jwtTokenUtil.generateToken(userDetails);
                return ResponseEntity.ok(new JwtResponse(token));
            } else {
                System.out.println("Password mismatch for: " + username);
                System.out.println("Input password: " + rawPassword);
                System.out.println("Stored hash: " + userDetails.getPassword());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (UsernameNotFoundException e) {
            System.out.println("User not found: " + username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
    }

//    @PutMapping("/profile")
//    public ResponseEntity<Admin> updateAdminProfile(
//            @RequestBody Admin updatedAdmin,
//            Authentication authentication) {
//        String username = authentication.getName();
//        return ResponseEntity.ok(adminService.updateAdminProfile(username, updatedAdmin));
//    }

    @Data
    @AllArgsConstructor
    private static class JwtResponse {
        private String token;
    }
}
