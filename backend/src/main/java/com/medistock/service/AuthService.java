package com.medistock.service;

import com.medistock.config.JwtTokenProvider;
import com.medistock.config.UserDetailsImpl;
import com.medistock.dto.request.LoginRequest;
import com.medistock.dto.request.SignupRequest;
import com.medistock.dto.response.JwtResponse;
import com.medistock.dto.response.UserResponse;
import com.medistock.entity.Role;
import com.medistock.entity.Supplier;
import com.medistock.entity.User;
import com.medistock.exception.BadRequestException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.RoleRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SupplierRepository supplierRepository;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       RoleRepository roleRepository,
                       SupplierRepository supplierRepository,
                       PasswordEncoder encoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.supplierRepository = supplierRepository;
        this.encoder = encoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        if (loginRequest.getRole() == null || loginRequest.getRole().trim().isEmpty()) {
            throw new BadRequestException("Role selection is required.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String selectedRole = loginRequest.getRole().trim().toUpperCase().replace("ROLE_", "");
        String actualUserRole = userDetails.getRoleName() != null
                ? userDetails.getRoleName().trim().toUpperCase().replace("ROLE_", "")
                : "";

        boolean roleMatches = actualUserRole.equals(selectedRole) ||
                userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch(auth -> auth.toUpperCase().replace("ROLE_", "").equals(selectedRole));

        if (!roleMatches) {
            throw new BadRequestException("The selected role does not match your account.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .name(userDetails.getName())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .role(userDetails.getRoleName())
                .supplierId(userDetails.getSupplierId())
                .roles(roles)
                .build();
    }

    @Transactional
    public String registerUser(SignupRequest signUpRequest) {
        String username = signUpRequest.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = signUpRequest.getEmail().split("@")[0];
        }

        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Username is already taken: " + username);
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email is already in use: " + signUpRequest.getEmail());
        }

        String requestedRole = signUpRequest.getRole() != null ? signUpRequest.getRole().toUpperCase().replace("ROLE_", "") : "STAFF";
        if (requestedRole.equals("ADMIN")) {
            throw new BadRequestException("Public registration cannot assign Admin privileges.");
        }

        Role role;
        Supplier supplier = null;

        if (requestedRole.equals("SUPPLIER")) {
            role = roleRepository.findByName("SUPPLIER")
                    .orElseThrow(() -> new ResourceNotFoundException("Role SUPPLIER not found"));
            if (signUpRequest.getSupplierId() == null) {
                throw new BadRequestException("Supplier account must be associated with a valid supplier ID.");
            }
            supplier = supplierRepository.findById(signUpRequest.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + signUpRequest.getSupplierId()));
        } else if (requestedRole.equals("PHARMACIST")) {
            role = roleRepository.findByName("PHARMACIST")
                    .orElseThrow(() -> new ResourceNotFoundException("Role PHARMACIST not found"));
        } else {
            role = roleRepository.findByName("STAFF")
                    .orElseThrow(() -> new ResourceNotFoundException("Role STAFF not found"));
        }

        User user = User.builder()
                .name(signUpRequest.getName())
                .username(username)
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(role)
                .supplier(supplier)
                .build();

        userRepository.save(user);
        return "User registered successfully";
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String usernameOrEmail) {
        User user = userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + usernameOrEmail));

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().getName() : "STAFF")
                .supplierId(user.getSupplier() != null ? user.getSupplier().getId() : null)
                .supplierName(user.getSupplier() != null ? user.getSupplier().getName() : null)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
