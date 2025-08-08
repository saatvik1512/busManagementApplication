package com.example.busManagement.busManagement.services;

import com.example.busManagement.busManagement.entities.Admin;
import com.example.busManagement.busManagement.entities.SuperAdmin;
import com.example.busManagement.busManagement.respository.AdminRepository;
import com.example.busManagement.busManagement.respository.SuperAdminRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final SuperAdminRepository superAdminRepository; // Add dependency

    public CustomUserDetailsService(AdminRepository adminRepository, SuperAdminRepository superAdminRepository) {
        this.adminRepository = adminRepository;
        this.superAdminRepository = superAdminRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Check SuperAdmin first (or Admin first, order matters if usernames can clash)
        // Assuming unique usernames across roles for simplicity
        SuperAdmin superAdmin = superAdminRepository.findByUsername(username).orElse(null);
        if (superAdmin != null) {
            // Use the role from the entity
            List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(superAdmin.getRole()));
            return new User(
                    superAdmin.getUsername(),
                    superAdmin.getPassword(),
                    authorities
            );
        }
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User (Admin/SuperAdmin) not found: " + username));

        // Use the role from the entity
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(admin.getRole()));
        return new User(
                admin.getUsername(),
                admin.getPassword(),
                authorities // Pass the role as authority
        );
    }
}