package com.medistock.service;

import com.medistock.dto.request.SignupRequest;
import com.medistock.dto.response.UserResponse;
import com.medistock.entity.Role;
import com.medistock.entity.Supplier;
import com.medistock.entity.User;
import com.medistock.exception.BadRequestException;
import com.medistock.exception.ConflictException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.RoleRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SupplierRepository supplierRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       SupplierRepository supplierRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.supplierRepository = supplierRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse createUser(SignupRequest request) {
        String username = request.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = request.getEmail().split("@")[0];
        }

        if (userRepository.existsByUsername(username)) {
            throw new ConflictException("Username already exists: " + username);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already exists: " + request.getEmail());
        }

        String rawRole = request.getRole() != null ? request.getRole().trim().toUpperCase() : "STAFF";
        String roleName = rawRole.replace("ROLE_", "");
        if (!java.util.List.of("ADMIN", "PHARMACIST", "STAFF", "SUPPLIER").contains(roleName)) {
            throw new BadRequestException("Invalid role: " + rawRole + ". Allowed roles are ADMIN, PHARMACIST, STAFF, SUPPLIER.");
        }

        Role role = roleRepository.findByName(roleName)
                .or(() -> roleRepository.findByName("ROLE_" + roleName))
                .orElseGet(() -> roleRepository.save(new Role(null, roleName)));

        Supplier supplier = null;
        if (roleName.equals("SUPPLIER")) {
            if (request.getSupplierId() == null) {
                throw new BadRequestException("Supplier account must be linked to an existing supplier.");
            }
            supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + request.getSupplierId()));
        }

        String name = request.getName();
        if (name == null || name.trim().isEmpty()) {
            name = username;
        }

        User user = User.builder()
                .name(name.trim())
                .username(username)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .supplier(supplier)
                .build();

        User saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    private UserResponse mapToUserResponse(User user) {
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
