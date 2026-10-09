package com.medistock.controller;

import com.medistock.dto.response.ApiResponse;
import com.medistock.dto.response.DashboardAnalyticsResponse;
import com.medistock.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics & Reports", description = "Endpoints for inventory metrics, valuation, and stats")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get high-level dashboard analytics summary")
    public ResponseEntity<ApiResponse<DashboardAnalyticsResponse>> getDashboardSummary() {
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved", analyticsService.getDashboardSummary()));
    }
}
