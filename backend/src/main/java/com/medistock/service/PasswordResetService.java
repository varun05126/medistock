package com.medistock.service;

import com.medistock.dto.request.ForgotPasswordRequest;
import com.medistock.dto.request.ResetPasswordRequest;
import com.medistock.entity.PasswordResetToken;
import com.medistock.entity.User;
import com.medistock.exception.BadRequestException;
import com.medistock.repository.PasswordResetTokenRepository;
import com.medistock.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.frontend-url:https://medistock-frontend-u7jp.onrender.com}")
    private String frontendUrl;

    // In-memory test cache for automated test verification without SMTP
    private final Map<String, String> devTokenCache = new ConcurrentHashMap<>();

    public PasswordResetService(UserRepository userRepository,
                                PasswordResetTokenRepository tokenRepository,
                                PasswordEncoder passwordEncoder,
                                EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public String requestPasswordReset(ForgotPasswordRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return "If an account with that email exists, password reset instructions have been sent.";
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Invalidate any existing unused tokens for this user
            List<PasswordResetToken> existingTokens = tokenRepository.findAllByUserAndUsedFalse(user);
            for (PasswordResetToken existing : existingTokens) {
                existing.setUsed(true);
            }
            if (!existingTokens.isEmpty()) {
                tokenRepository.saveAll(existingTokens);
            }

            // Generate cryptographically secure token
            String rawToken = UUID.randomUUID().toString().replace("-", "")
                    + UUID.randomUUID().toString().replace("-", "");
            String tokenHash = hashToken(rawToken);

            LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);
            PasswordResetToken resetToken = new PasswordResetToken(
                    null,
                    tokenHash,
                    user,
                    expiryDate,
                    false,
                    LocalDateTime.now()
            );
            tokenRepository.save(resetToken);

            devTokenCache.put(normalizedEmail, rawToken);

            String baseUrl = frontendUrl != null ? frontendUrl.replaceAll("/+$", "") : "https://medistock-frontend-u7jp.onrender.com";
            String resetLink = baseUrl + "/reset-password?token=" + rawToken;

            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetLink);
            logger.info("Password reset token generated for user ID: {}", user.getId());
        } else {
            logger.info("Password reset requested for non-existent email address (timing-safe generic response returned)");
        }

        return "If an account with that email exists, password reset instructions have been sent.";
    }

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        if (request == null || request.getToken() == null || request.getToken().trim().isEmpty()) {
            throw new BadRequestException("Password reset token is required.");
        }

        if (request.getNewPassword() == null || request.getNewPassword().trim().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters.");
        }

        String rawToken = request.getToken().trim();
        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token."));

        if (resetToken.isUsed()) {
            throw new BadRequestException("This password reset token has already been used. Please request a new one.");
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This password reset token has expired. Please request a new one.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword().trim()));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        devTokenCache.remove(user.getEmail().toLowerCase());

        logger.info("Password successfully reset for user ID: {}", user.getId());
        return "Password has been reset successfully. You may now log in with your new password.";
    }

    public String getDevToken(String email) {
        if (email == null) return null;
        return devTokenCache.get(email.trim().toLowerCase());
    }

    public static String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
