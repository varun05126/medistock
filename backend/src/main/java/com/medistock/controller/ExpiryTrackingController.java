package com.medistock.controller;

import com.medistock.dto.response.ApiResponse;
import com.medistock.entity.MedicineBatch;
import com.medistock.service.ExpiryTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expiry")
@RequiredArgsConstructor
@Tag(name = "Expiry Tracking", description = "Monitor near-expiry and expired medicine batches")
public class ExpiryTrackingController {

    private final ExpiryTrackingService expiryTrackingService;

    @GetMapping("/near-expiry")
    @Operation(summary = "Get medicine batches expiring within specified days (default 30 days)")
    public ResponseEntity<ApiResponse<List<MedicineBatch>>> getNearExpiryBatches(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.success("Near-expiry batches", expiryTrackingService.getExpiringSoonBatches(days)));
    }

    @GetMapping("/expired")
    @Operation(summary = "Get already expired medicine batches with remaining stock")
    public ResponseEntity<ApiResponse<List<MedicineBatch>>> getExpiredBatches() {
        return ResponseEntity.ok(ApiResponse.success("Expired batches", expiryTrackingService.getExpiredBatches()));
    }
}
