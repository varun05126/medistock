package com.medistock.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SupplierRequest {
    @NotBlank
    private String name;

    private String contactPerson;

    @NotBlank
    private String contactNumber;

    @Email
    private String email;

    private String address;
}
