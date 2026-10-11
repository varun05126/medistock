package com.medistock.controller;

import com.medistock.dto.response.ApiResponse;
import com.medistock.dto.response.DashboardAnalyticsResponse;
import com.medistock.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
@Tag(name = "Analytics", description = "Operational dashboards and summary metrics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get high-level inventory metrics and dashboard alerts")
    public ResponseEntity<ApiResponse<DashboardAnalyticsResponse>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success("Analytics retrieved", analyticsService.getDashboardSummary()));
    }
}
