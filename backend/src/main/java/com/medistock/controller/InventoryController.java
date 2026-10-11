package com.medistock.controller;

import com.medistock.dto.response.ApiResponse;
import com.medistock.entity.Inventory;
import com.medistock.service.StockMonitoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@Tag(name = "Inventory", description = "Current stock inventory levels")
public class InventoryController {

    private final StockMonitoringService stockMonitoringService;

    public InventoryController(StockMonitoringService stockMonitoringService) {
        this.stockMonitoringService = stockMonitoringService;
    }

    @GetMapping
    @Operation(summary = "Get all inventory items")
    public ResponseEntity<ApiResponse<List<Inventory>>> getAllInventory() {
        return ResponseEntity.ok(ApiResponse.success("Inventory items retrieved", stockMonitoringService.getAllInventory()));
    }
}
