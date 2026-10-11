package com.medistock.service;

import com.medistock.dto.request.ForgotPasswordRequest;
import com.medistock.dto.request.ResetPasswordRequest;
import com.medistock.entity.PasswordResetToken;
import com.medistock.entity.Role;
import com.medistock.entity.User;
import com.medistock.exception.BadRequestException;
import com.medistock.repository.PasswordResetTokenRepository;
import com.medistock.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    private EmailService emailService;
    private PasswordEncoder passwordEncoder;
    private PasswordResetService resetService;

    private User sampleUser;
    private Role staffRole;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        emailService = new EmailService(null);
        resetService = new PasswordResetService(userRepository, tokenRepository, passwordEncoder, emailService);

        staffRole = new Role(1L, "STAFF");
        sampleUser = User.builder()
                .id(10L)
                .name("Alice Test")
                .username("alicetest")
                .email("alice@medistock.com")
                .password(passwordEncoder.encode("oldPassword123"))
                .role(staffRole)
                .build();
    }

    @Test
    @DisplayName("Request reset for registered email creates token, sends email, and returns generic message")
    void testRequestReset_RegisteredEmail() {
        when(userRepository.findByEmail("alice@medistock.com")).thenReturn(Optional.of(sampleUser));
        when(tokenRepository.findAllByUserAndUsedFalse(sampleUser)).thenReturn(Collections.emptyList());

        String result = resetService.requestPasswordReset(new ForgotPasswordRequest("alice@medistock.com"));

        assertEquals("If an account with that email exists, password reset instructions have been sent.", result);
        verify(tokenRepository).save(any(PasswordResetToken.class));
    }

    @Test
    @DisplayName("Request reset for unknown email returns same generic message without error")
    void testRequestReset_UnknownEmail() {
        when(userRepository.findByEmail("unknown@medistock.com")).thenReturn(Optional.empty());

        String result = resetService.requestPasswordReset(new ForgotPasswordRequest("unknown@medistock.com"));

        assertEquals("If an account with that email exists, password reset instructions have been sent.", result);
        verify(tokenRepository, never()).save(any());
    }

    @Test
    @DisplayName("Reset password with valid token updates encoded password and marks token used")
    void testResetPassword_Success() {
        String rawToken = "mySecretResetToken1234567890abcdef";
        String tokenHash = PasswordResetService.hashToken(rawToken);

        PasswordResetToken token = new PasswordResetToken(
                1L,
                tokenHash,
                sampleUser,
                LocalDateTime.now().plusMinutes(15),
                false,
                LocalDateTime.now()
        );

        when(tokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));

        String result = resetService.resetPassword(new ResetPasswordRequest(rawToken, "brandNewPassword999"));

        assertTrue(result.contains("Password has been reset successfully"));
        assertTrue(token.isUsed());
        verify(tokenRepository).save(token);
        verify(userRepository).save(sampleUser);

        // Verify password changed and matches new password
        assertTrue(passwordEncoder.matches("brandNewPassword999", sampleUser.getPassword()));
        assertFalse(passwordEncoder.matches("oldPassword123", sampleUser.getPassword()));
    }

    @Test
    @DisplayName("Reset password with invalid token throws BadRequestException")
    void testResetPassword_InvalidToken() {
        String invalidToken = "nonExistentToken";
        String hash = PasswordResetService.hashToken(invalidToken);
        when(tokenRepository.findByTokenHash(hash)).thenReturn(Optional.empty());

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                resetService.resetPassword(new ResetPasswordRequest(invalidToken, "newPassword123")));

        assertTrue(ex.getMessage().contains("Invalid or expired"));
    }

    @Test
    @DisplayName("Reset password with expired token throws BadRequestException")
    void testResetPassword_ExpiredToken() {
        String rawToken = "expiredToken123";
        String tokenHash = PasswordResetService.hashToken(rawToken);

        PasswordResetToken expiredToken = new PasswordResetToken(
                2L,
                tokenHash,
                sampleUser,
                LocalDateTime.now().minusMinutes(5), // Expired 5 mins ago
                false,
                LocalDateTime.now().minusMinutes(20)
        );

        when(tokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(expiredToken));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                resetService.resetPassword(new ResetPasswordRequest(rawToken, "newPassword123")));

        assertTrue(ex.getMessage().contains("expired"));
    }

    @Test
    @DisplayName("Reset password with already used token throws BadRequestException")
    void testResetPassword_AlreadyUsedToken() {
        String rawToken = "alreadyUsedToken123";
        String tokenHash = PasswordResetService.hashToken(rawToken);

        PasswordResetToken usedToken = new PasswordResetToken(
                3L,
                tokenHash,
                sampleUser,
                LocalDateTime.now().plusMinutes(10),
                true, // Already used
                LocalDateTime.now()
        );

        when(tokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(usedToken));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                resetService.resetPassword(new ResetPasswordRequest(rawToken, "newPassword123")));

        assertTrue(ex.getMessage().contains("already been used"));
    }

    @Test
    @DisplayName("Reset password with short password throws BadRequestException")
    void testResetPassword_ShortPassword() {
        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                resetService.resetPassword(new ResetPasswordRequest("someToken", "123")));

        assertTrue(ex.getMessage().contains("at least 6 characters"));
    }
}
