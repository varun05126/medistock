package com.medistock.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_logs")
public class StockLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, length = 30)
    private String operation;

    @Column(name = "previous_quantity")
    private Integer previousQuantity;

    @Column(name = "new_quantity")
    private Integer newQuantity;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public StockLog() {}

    public StockLog(Long id, Medicine medicine, Integer quantity, String operation, Integer previousQuantity, Integer newQuantity, LocalDateTime createdAt) {
        this.id = id;
        this.medicine = medicine;
        this.quantity = quantity;
        this.operation = operation;
        this.previousQuantity = previousQuantity;
        this.newQuantity = newQuantity;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Medicine getMedicine() { return medicine; }
    public void setMedicine(Medicine medicine) { this.medicine = medicine; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }
    public Integer getPreviousQuantity() { return previousQuantity; }
    public void setPreviousQuantity(Integer previousQuantity) { this.previousQuantity = previousQuantity; }
    public Integer getNewQuantity() { return newQuantity; }
    public void setNewQuantity(Integer newQuantity) { this.newQuantity = newQuantity; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Medicine medicine;
        private Integer quantity;
        private String operation;
        private Integer previousQuantity;
        private Integer newQuantity;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder medicine(Medicine medicine) { this.medicine = medicine; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder operation(String operation) { this.operation = operation; return this; }
        public Builder previousQuantity(Integer previousQuantity) { this.previousQuantity = previousQuantity; return this; }
        public Builder newQuantity(Integer newQuantity) { this.newQuantity = newQuantity; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public StockLog build() {
            return new StockLog(id, medicine, quantity, operation, previousQuantity, newQuantity, createdAt);
        }
    }
}
