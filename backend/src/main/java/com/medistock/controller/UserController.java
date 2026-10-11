package com.medistock.controller;

import com.medistock.dto.request.SignupRequest;
import com.medistock.dto.response.ApiResponse;
import com.medistock.dto.response.UserResponse;
import com.medistock.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "Users", description = "Administrative endpoints for managing application users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users (Admin only)")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create user (Admin only)")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody SignupRequest request) {
        UserResponse created = userService.createUser(request);
        return ResponseEntity.ok(ApiResponse.success("User created successfully", created));
    }
}
