package com.medistock.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expiry_tracking")
public class ExpiryTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(nullable = false, length = 30)
    private String status = "VALID";

    @Column(name = "notification_sent")
    private Boolean notificationSent = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ExpiryTracking() {}

    public ExpiryTracking(Long id, Medicine medicine, LocalDate expiryDate, String status, Boolean notificationSent, LocalDateTime createdAt) {
        this.id = id;
        this.medicine = medicine;
        this.expiryDate = expiryDate;
        this.status = status != null ? status : "VALID";
        this.notificationSent = notificationSent != null ? notificationSent : false;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Medicine getMedicine() { return medicine; }
    public void setMedicine(Medicine medicine) { this.medicine = medicine; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Boolean getNotificationSent() { return notificationSent; }
    public void setNotificationSent(Boolean notificationSent) { this.notificationSent = notificationSent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Medicine medicine;
        private LocalDate expiryDate;
        private String status = "VALID";
        private Boolean notificationSent = false;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder medicine(Medicine medicine) { this.medicine = medicine; return this; }
        public Builder expiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder notificationSent(Boolean notificationSent) { this.notificationSent = notificationSent; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ExpiryTracking build() {
            return new ExpiryTracking(id, medicine, expiryDate, status, notificationSent, createdAt);
        }
    }
}
