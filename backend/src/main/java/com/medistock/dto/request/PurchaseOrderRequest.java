package com.medistock.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PurchaseOrderRequest {
    @NotNull
    private Long supplierId;

    private LocalDate expectedDeliveryDate;

    @NotEmpty
    private List<PurchaseOrderItemRequest> items;

    @Data
    public static class PurchaseOrderItemRequest {
        @NotNull
        private Long medicineId;

        @NotNull
        private Integer quantity;

        @NotNull
        private java.math.BigDecimal unitPrice;
    }
}
