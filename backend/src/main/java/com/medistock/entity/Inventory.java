package com.medistock.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medicine_id", nullable = false, unique = true)
    private Medicine medicine;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(name = "minimum_stock", nullable = false)
    private Integer minimumStock = 10;

    @Column(name = "stock_status", nullable = false, length = 30)
    private String stockStatus = "AVAILABLE";

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    public Inventory() {}

    public Inventory(Long id, Medicine medicine, Integer quantity, Integer minimumStock, String stockStatus, LocalDateTime lastUpdated) {
        this.id = id;
        this.medicine = medicine;
        this.quantity = quantity != null ? quantity : 0;
        this.minimumStock = minimumStock != null ? minimumStock : 10;
        this.stockStatus = stockStatus != null ? stockStatus : "AVAILABLE";
        this.lastUpdated = lastUpdated;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Medicine getMedicine() { return medicine; }
    public void setMedicine(Medicine medicine) { this.medicine = medicine; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Integer getMinimumStock() { return minimumStock; }
    public void setMinimumStock(Integer minimumStock) { this.minimumStock = minimumStock; }
    public String getStockStatus() { return stockStatus; }
    public void setStockStatus(String stockStatus) { this.stockStatus = stockStatus; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Medicine medicine;
        private Integer quantity = 0;
        private Integer minimumStock = 10;
        private String stockStatus = "AVAILABLE";
        private LocalDateTime lastUpdated;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder medicine(Medicine medicine) { this.medicine = medicine; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder minimumStock(Integer minimumStock) { this.minimumStock = minimumStock; return this; }
        public Builder stockStatus(String stockStatus) { this.stockStatus = stockStatus; return this; }
        public Builder lastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; return this; }
        public Inventory build() {
            return new Inventory(id, medicine, quantity, minimumStock, stockStatus, lastUpdated);
        }
    }
}
