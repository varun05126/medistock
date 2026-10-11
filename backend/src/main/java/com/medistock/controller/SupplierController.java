package com.medistock.controller;

import com.medistock.dto.request.SupplierRequest;
import com.medistock.dto.response.ApiResponse;
import com.medistock.entity.PurchaseOrder;
import com.medistock.entity.Supplier;
import com.medistock.service.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
@Tag(name = "Suppliers", description = "Supplier relationship management APIs")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('SUPPLIER')")
    @Operation(summary = "Get current authenticated supplier's profile")
    public ResponseEntity<ApiResponse<Supplier>> getMySupplierProfile(Authentication authentication) {
        Supplier supplier = supplierService.getAuthenticatedSupplier(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Supplier profile retrieved", supplier));
    }

    @GetMapping("/me/orders")
    @PreAuthorize("hasRole('SUPPLIER')")
    @Operation(summary = "Get purchase orders assigned to the authenticated supplier")
    public ResponseEntity<ApiResponse<List<PurchaseOrder>>> getMyOrders(Authentication authentication) {
        List<PurchaseOrder> orders = supplierService.getOrdersForAuthenticatedSupplier(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Purchase orders retrieved", orders));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('SUPPLIER')")
    @Operation(summary = "Update authenticated supplier profile")
    public ResponseEntity<ApiResponse<Supplier>> updateMySupplierProfile(
            Authentication authentication,
            @Valid @RequestBody SupplierRequest request) {
        Supplier updated = supplierService.updateAuthenticatedSupplier(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Supplier profile updated", updated));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "List all suppliers")
    public ResponseEntity<ApiResponse<List<Supplier>>> getAllSuppliers() {
        return ResponseEntity.ok(ApiResponse.success("Suppliers retrieved", supplierService.getAllSuppliers()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Get supplier by ID")
    public ResponseEntity<ApiResponse<Supplier>> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Supplier details", supplierService.getSupplierById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Create supplier")
    public ResponseEntity<ApiResponse<Supplier>> createSupplier(@Valid @RequestBody SupplierRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Supplier registered", supplierService.createSupplier(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Update supplier")
    public ResponseEntity<ApiResponse<Supplier>> updateSupplier(@PathVariable Long id, @Valid @RequestBody SupplierRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Supplier updated", supplierService.updateSupplier(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete supplier")
    public ResponseEntity<ApiResponse<String>> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.ok(ApiResponse.success("Supplier deleted", null));
    }
}
