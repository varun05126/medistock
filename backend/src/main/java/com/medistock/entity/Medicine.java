package com.medistock.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "batch_number", nullable = false, length = 100)
    private String batchNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(name = "manufacturing_date")
    private LocalDate manufacturingDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Medicine() {}

    public Medicine(Long id, String name, String batchNumber, Category category, Supplier supplier, Integer quantity, LocalDate manufacturingDate, LocalDate expiryDate, BigDecimal price, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.batchNumber = batchNumber;
        this.category = category;
        this.supplier = supplier;
        this.quantity = quantity != null ? quantity : 0;
        this.manufacturingDate = manufacturingDate;
        this.expiryDate = expiryDate;
        this.price = price;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public LocalDate getManufacturingDate() { return manufacturingDate; }
    public void setManufacturingDate(LocalDate manufacturingDate) { this.manufacturingDate = manufacturingDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String batchNumber;
        private Category category;
        private Supplier supplier;
        private Integer quantity = 0;
        private LocalDate manufacturingDate;
        private LocalDate expiryDate;
        private BigDecimal price;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder batchNumber(String batchNumber) { this.batchNumber = batchNumber; return this; }
        public Builder category(Category category) { this.category = category; return this; }
        public Builder supplier(Supplier supplier) { this.supplier = supplier; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder manufacturingDate(LocalDate manufacturingDate) { this.manufacturingDate = manufacturingDate; return this; }
        public Builder expiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Medicine build() {
            return new Medicine(id, name, batchNumber, category, supplier, quantity, manufacturingDate, expiryDate, price, createdAt);
        }
    }
}
