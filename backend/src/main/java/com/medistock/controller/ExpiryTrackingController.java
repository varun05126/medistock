package com.medistock.controller;

import com.medistock.dto.response.ApiResponse;
import com.medistock.entity.ExpiryTracking;
import com.medistock.service.ExpiryTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expiry")
@Tag(name = "Expiry Tracking", description = "Monitor near-expiry and expired medicine batches")
public class ExpiryTrackingController {

    private final ExpiryTrackingService expiryTrackingService;

    public ExpiryTrackingController(ExpiryTrackingService expiryTrackingService) {
        this.expiryTrackingService = expiryTrackingService;
    }

    @GetMapping
    @Operation(summary = "Get all expiry records")
    public ResponseEntity<ApiResponse<List<ExpiryTracking>>> getAllExpiryTracking() {
        return ResponseEntity.ok(ApiResponse.success("Expiry records retrieved", expiryTrackingService.getAllExpiryTracking()));
    }

    @GetMapping("/near-expiry")
    @Operation(summary = "Get medicines expiring within specified days (default 30 days)")
    public ResponseEntity<ApiResponse<List<ExpiryTracking>>> getNearExpiryBatches(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.success("Near-expiry medicines", expiryTrackingService.getExpiringSoonBatches(days)));
    }

    @GetMapping("/expired")
    @Operation(summary = "Get already expired medicines")
    public ResponseEntity<ApiResponse<List<ExpiryTracking>>> getExpiredBatches() {
        return ResponseEntity.ok(ApiResponse.success("Expired medicines", expiryTrackingService.getExpiredBatches()));
    }
}
