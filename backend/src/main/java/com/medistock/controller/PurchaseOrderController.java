package com.medistock.controller;

import com.medistock.dto.request.PurchaseOrderRequest;
import com.medistock.dto.response.ApiResponse;
import com.medistock.entity.PurchaseOrder;
import com.medistock.service.PurchaseOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Purchase Orders", description = "Purchase order lifecycle management")
public class PurchaseOrderController {

    private final PurchaseOrderService orderService;

    @GetMapping
    @Operation(summary = "Get list of all purchase orders")
    public ResponseEntity<ApiResponse<List<PurchaseOrder>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("Purchase orders retrieved", orderService.getAllOrders()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get purchase order by ID")
    public ResponseEntity<ApiResponse<PurchaseOrder>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order details", orderService.getOrderById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Create a purchase order")
    public ResponseEntity<ApiResponse<PurchaseOrder>> createOrder(@Valid @RequestBody PurchaseOrderRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Purchase order created", orderService.createOrder(request)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Update order status (PENDING, APPROVED, SHIPPED, RECEIVED, CANCELLED)")
    public ResponseEntity<ApiResponse<PurchaseOrder>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Order status updated", orderService.updateStatus(id, status)));
    }
}
