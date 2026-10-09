package com.medistock.controller;

import com.medistock.dto.response.ApiResponse;
import com.medistock.entity.Medicine;
import com.medistock.entity.StockLog;
import com.medistock.service.StockMonitoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
@Tag(name = "Stock Monitoring", description = "Real-time stock alerts and movement log endpoints")
public class StockMonitoringController {

    private final StockMonitoringService stockMonitoringService;

    @GetMapping("/low")
    @Operation(summary = "Get low stock medicines")
    public ResponseEntity<ApiResponse<List<Medicine>>> getLowStockMedicines() {
        return ResponseEntity.ok(ApiResponse.success("Low stock items", stockMonitoringService.getLowStockMedicines()));
    }

    @GetMapping("/out-of-stock")
    @Operation(summary = "Get out of stock medicines")
    public ResponseEntity<ApiResponse<List<Medicine>>> getOutOfStockMedicines() {
        return ResponseEntity.ok(ApiResponse.success("Out of stock items", stockMonitoringService.getOutOfStockMedicines()));
    }

    @GetMapping("/logs")
    @Operation(summary = "Get recent stock movement logs")
    public ResponseEntity<ApiResponse<List<StockLog>>> getRecentStockLogs() {
        return ResponseEntity.ok(ApiResponse.success("Stock movement logs", stockMonitoringService.getRecentStockLogs()));
    }
}
