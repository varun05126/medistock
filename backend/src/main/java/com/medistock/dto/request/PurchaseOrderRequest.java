package com.medistock.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderRequest {
    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    private LocalDate orderDate;

    @NotEmpty(message = "Order must contain at least one item")
    private List<PurchaseOrderItemRequest> items;

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }
    public List<PurchaseOrderItemRequest> getItems() { return items; }
    public void setItems(List<PurchaseOrderItemRequest> items) { this.items = items; }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurchaseOrderItemRequest {
        @NotNull(message = "Medicine ID is required")
        private Long medicineId;

        @NotNull(message = "Quantity is required")
        private Integer quantity;

        @NotNull(message = "Unit price is required")
        private BigDecimal unitPrice;

        public Long getMedicineId() { return medicineId; }
        public void setMedicineId(Long medicineId) { this.medicineId = medicineId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    }
}
