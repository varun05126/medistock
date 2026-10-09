package com.medistock.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BatchRequest {
    @NotNull
    private Long medicineId;

    @NotBlank
    private String batchNumber;

    @NotNull
    @PositiveOrZero
    private Integer quantity;

    @NotNull
    private LocalDate manufacturingDate;

    @NotNull
    private LocalDate expiryDate;

    private BigDecimal purchasePrice;

    private BigDecimal sellingPrice;
}
