package com.medistock.controller;

import com.medistock.dto.request.LoginRequest;
import com.medistock.dto.request.SignupRequest;
import com.medistock.dto.response.ApiResponse;
import com.medistock.dto.response.JwtResponse;
import com.medistock.dto.response.UserResponse;
import com.medistock.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Endpoints for user login, registration, and tokens")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping({"/login", "/signin"})
    @Operation(summary = "User Login")
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("User logged in successfully", jwtResponse));
    }

    @PostMapping({"/register", "/signup"})
    @Operation(summary = "User Registration")
    public ResponseEntity<ApiResponse<String>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        String result = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(ApiResponse.success(result, null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(ApiResponse.error(401, "Unauthorized"));
        }
        UserResponse profile = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", profile));
    }
}
