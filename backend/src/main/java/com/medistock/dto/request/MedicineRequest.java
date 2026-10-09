package com.medistock.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class MedicineRequest {
    @NotBlank
    private String name;

    private String genericName;

    private String sku;

    private Long categoryId;

    private Long supplierId;

    private String description;

    private String dosageForm;

    private String strength;

    @NotNull
    @Positive
    private BigDecimal price;

    private Integer reorderLevel = 10;
}
