package com.medistock.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_items")
public class PurchaseOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    @JsonBackReference
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    public PurchaseOrderItem() {}

    public PurchaseOrderItem(Long id, PurchaseOrder purchaseOrder, Medicine medicine, Integer quantity, BigDecimal unitPrice) {
        this.id = id;
        this.purchaseOrder = purchaseOrder;
        this.medicine = medicine;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public PurchaseOrder getPurchaseOrder() { return purchaseOrder; }
    public void setPurchaseOrder(PurchaseOrder purchaseOrder) { this.purchaseOrder = purchaseOrder; }
    public Medicine getMedicine() { return medicine; }
    public void setMedicine(Medicine medicine) { this.medicine = medicine; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private PurchaseOrder purchaseOrder;
        private Medicine medicine;
        private Integer quantity;
        private BigDecimal unitPrice;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder purchaseOrder(PurchaseOrder purchaseOrder) { this.purchaseOrder = purchaseOrder; return this; }
        public Builder medicine(Medicine medicine) { this.medicine = medicine; return this; }
        public Builder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public Builder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
        public PurchaseOrderItem build() {
            return new PurchaseOrderItem(id, purchaseOrder, medicine, quantity, unitPrice);
        }
    }
}
