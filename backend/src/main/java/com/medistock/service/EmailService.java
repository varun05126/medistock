package com.medistock.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@medistock.com}")
    private String mailFrom;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String recipientName, String resetLink) {
        if (!mailEnabled || mailSender == null) {
            logger.info("Mail delivery is not active (app.mail.enabled={}). Password reset link safely generated for: {}",
                    mailEnabled, toEmail);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(toEmail);
            message.setSubject("MediStock - Password Reset Request");
            message.setText("Hello " + (recipientName != null ? recipientName : "User") + ",\n\n"
                    + "We received a request to reset your MediStock password.\n\n"
                    + "Please click the link below to set a new password:\n"
                    + resetLink + "\n\n"
                    + "This link will expire in 15 minutes.\n"
                    + "If you did not request a password reset, please ignore this email.\n\n"
                    + "Best regards,\n"
                    + "MediStock Security Team");

            mailSender.send(message);
            logger.info("Password reset email dispatched to {}", toEmail);
        } catch (Exception ex) {
            logger.warn("Failed to dispatch password reset email via SMTP: {}", ex.getMessage());
        }
    }
}
