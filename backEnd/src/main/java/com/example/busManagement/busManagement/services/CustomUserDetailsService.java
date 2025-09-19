//package com.example.busManagement.busManagement.services;
//
//import com.example.busManagement.busManagement.entities.Admin;
//import com.example.busManagement.busManagement.respository.AdminRepository;
//import org.springframework.security.core.userdetails.User;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.Collections;
//
//@Service
//public class CustomUserDetailsService implements UserDetailsService {
//    private final AdminRepository adminRepository;
//
//    public CustomUserDetailsService(AdminRepository adminRepository) {
//        this.adminRepository = adminRepository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        Admin admin = adminRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
//        return new User(
//                admin.getUsername(),
//                admin.getPassword(),
//                Collections.emptyList()
//        );
//    }
//}

package com.example.busManagement.busManagement.services;

import com.example.busManagement.busManagement.entities.Admin;
import com.example.busManagement.busManagement.entities.Passenger;
import com.example.busManagement.busManagement.entities.SuperAdmin;
import com.example.busManagement.busManagement.respository.AdminRepository;
import com.example.busManagement.busManagement.respository.PassengerRepository;
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
    private final PassengerRepository passengerRepository;

    public CustomUserDetailsService(AdminRepository adminRepository, SuperAdminRepository superAdminRepository, PassengerRepository passengerRepository) {
        this.adminRepository = adminRepository;
        this.superAdminRepository = superAdminRepository;
        this.passengerRepository = passengerRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Check SuperAdmin first
        SuperAdmin superAdmin = superAdminRepository.findByUsername(username).orElse(null);
        if (superAdmin != null) {
            List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(superAdmin.getRole()));
            return new User(
                    superAdmin.getUsername(),
                    superAdmin.getPassword(),
                    authorities
            );
        }

        // Check Admin next
        Admin admin = adminRepository.findByUsername(username).orElse(null);
        if (admin != null) {
            List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(admin.getRole()));
            return new User(
                    admin.getUsername(),
                    admin.getPassword(),
                    authorities
            );
        }

        // Check Passenger last
        Passenger passenger = passengerRepository.findByUsername(username).orElse(null);
        if (passenger != null) {
            List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(passenger.getRole()));
            return new User(
                    passenger.getUsername(),
                    passenger.getPassword(),
                    authorities
            );
        }

        throw new UsernameNotFoundException("User not found: " + username);
    }
}