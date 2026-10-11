package com.medistock.service;

import com.medistock.config.JwtTokenProvider;
import com.medistock.config.UserDetailsImpl;
import com.medistock.dto.request.LoginRequest;
import com.medistock.dto.request.SignupRequest;
import com.medistock.dto.response.JwtResponse;
import com.medistock.entity.Role;
import com.medistock.entity.User;
import com.medistock.exception.BadRequestException;
import com.medistock.exception.ConflictException;
import com.medistock.repository.RoleRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private SupplierRepository supplierRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    private JwtTokenProvider jwtTokenProvider;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(
                "9a618248b64db62d15b300a07b0058fe073d715019f499b7528f4920c14151d7",
                86400000
        );
        authService = new AuthService(authenticationManager, userRepository, roleRepository, supplierRepository, passwordEncoder, jwtTokenProvider);
    }

    @Test
    @DisplayName("Successful authentication with matching role returns JWT and user roles")
    void testAuthenticateUserSuccess() {
        LoginRequest loginRequest = new LoginRequest("admin", "admin123", "ADMIN");
        UserDetailsImpl userDetails = new UserDetailsImpl(
                1L, "Varun Admin", "admin", "admin@medistock.com", "hashed", null, "ADMIN",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);

        JwtResponse response = authService.authenticateUser(loginRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertTrue(jwtTokenProvider.validateToken(response.getToken()));
        assertEquals("admin", response.getUsername());
        assertEquals("ADMIN", response.getRole());
        assertTrue(response.getRoles().contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Authentication with mismatched role is rejected with clear error message")
    void testAuthenticateUserRoleMismatch() {
        LoginRequest loginRequest = new LoginRequest("admin", "admin123", "PHARMACIST");
        UserDetailsImpl userDetails = new UserDetailsImpl(
                1L, "Varun Admin", "admin", "admin@medistock.com", "hashed", null, "ADMIN",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.authenticateUser(loginRequest));
        assertEquals("The selected role does not match your account.", ex.getMessage());
    }

    @Test
    @DisplayName("Authentication without role is rejected")
    void testAuthenticateUserMissingRole() {
        LoginRequest loginRequest = new LoginRequest("admin", "admin123", null);
        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.authenticateUser(loginRequest));
        assertEquals("Role selection is required.", ex.getMessage());
    }

    @Test
    @DisplayName("Invalid credentials throws BadCredentialsException")
    void testAuthenticateUserInvalidCredentials() {
        LoginRequest loginRequest = new LoginRequest("admin", "wrongpassword", "ADMIN");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.authenticateUser(loginRequest));
    }

    @Test
    @DisplayName("Public registration cannot grant Admin role")
    void testRegisterAdminRejected() {
        SignupRequest request = new SignupRequest("New Admin", "newadmin", "newadmin@medistock.com", "pass123", "ADMIN", null);
        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.registerUser(request));
        assertEquals("Public registration cannot assign Admin privileges.", ex.getMessage());
    }

    @Test
    @DisplayName("Registration rejects missing name or empty required fields")
    void testRegisterMissingRequiredFields() {
        SignupRequest request = new SignupRequest("", "validuser", "valid@medistock.com", "pass123", "STAFF", null);
        assertThrows(BadRequestException.class, () -> authService.registerUser(request));
    }

    @Test
    @DisplayName("Registration rejects invalid email format")
    void testRegisterInvalidEmail() {
        SignupRequest request = new SignupRequest("Jane Doe", "janedoe", "not-an-email", "pass123", "STAFF", null);
        assertThrows(BadRequestException.class, () -> authService.registerUser(request));
    }

    @Test
    @DisplayName("Registration rejects duplicate username with ConflictException")
    void testRegisterDuplicateUsername() {
        SignupRequest request = new SignupRequest("John Doe", "existinguser", "john@medistock.com", "pass123", "STAFF", null);
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class, () -> authService.registerUser(request));
        assertTrue(ex.getMessage().contains("Username is already taken"));
    }

    @Test
    @DisplayName("Registration rejects duplicate email with ConflictException")
    void testRegisterDuplicateEmail() {
        SignupRequest request = new SignupRequest("John Doe", "newuser", "existing@medistock.com", "pass123", "STAFF", null);
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@medistock.com")).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class, () -> authService.registerUser(request));
        assertTrue(ex.getMessage().contains("Email is already in use"));
    }

    @Test
    @DisplayName("Supplier registration requires valid supplier ID")
    void testRegisterSupplierRequiresSupplierId() {
        SignupRequest request = new SignupRequest("Supplier Rep", "sup1", "sup1@medistock.com", "pass123", "SUPPLIER", null);
        when(userRepository.existsByUsername("sup1")).thenReturn(false);
        when(userRepository.existsByEmail("sup1@medistock.com")).thenReturn(false);
        when(roleRepository.findByName("SUPPLIER")).thenReturn(Optional.of(new Role(4L, "SUPPLIER")));

        assertThrows(BadRequestException.class, () -> authService.registerUser(request));
    }

    @Test
    @DisplayName("Successful staff registration encodes password and saves user")
    void testRegisterStaffSuccess() {
        SignupRequest request = new SignupRequest("Staff Member", "staffmember", "staffmember@medistock.com", "password123", "STAFF", null);
        Role staffRole = new Role(3L, "STAFF");

        when(userRepository.existsByUsername("staffmember")).thenReturn(false);
        when(userRepository.existsByEmail("staffmember@medistock.com")).thenReturn(false);
        when(roleRepository.findByName("STAFF")).thenReturn(Optional.of(staffRole));
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        String result = authService.registerUser(request);

        assertEquals("User registered successfully", result);
        verify(userRepository, times(1)).save(any(User.class));
    }
}
