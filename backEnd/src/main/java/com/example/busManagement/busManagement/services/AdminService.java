package com.example.busManagement.busManagement.services;

import com.example.busManagement.busManagement.entities.Admin;
import com.example.busManagement.busManagement.respository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AdminService {

    private AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Admin signup(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRole("ROLE_ADMIN");
        return adminRepository.save(admin);
    }

    public Admin login(String username, String password) {
        return adminRepository.findByUsername(username)
                .filter(admin -> passwordEncoder.matches(password, admin.getPassword()))
                .orElse(null);
    }
}
