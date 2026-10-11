package com.medistock.dto.response;

import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String role;
    private Long supplierId;
    private String supplierName;
    private LocalDateTime createdAt;

    public UserResponse() {}

    public UserResponse(Long id, String name, String username, String email, String role, Long supplierId, String supplierName, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.role = role;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String username;
        private String email;
        private String role;
        private Long supplierId;
        private String supplierName;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder supplierId(Long supplierId) { this.supplierId = supplierId; return this; }
        public Builder supplierName(String supplierName) { this.supplierName = supplierName; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserResponse build() {
            return new UserResponse(id, name, username, email, role, supplierId, supplierName, createdAt);
        }
    }
}
