package com.medistock.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "Health", description = "Application and database health monitoring")
public class HealthController {

    private final JdbcOperations jdbcOperations;

    public HealthController(JdbcOperations jdbcOperations) {
        this.jdbcOperations = jdbcOperations;
    }

    @GetMapping
    @Operation(summary = "Application Health Status")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", Instant.now().toString());
        response.put("service", "medistock-backend");

        // Safe database liveness check
        try {
            jdbcOperations.queryForObject("SELECT 1", Integer.class);
            response.put("database", "CONNECTED");
        } catch (Exception e) {
            response.put("database", "DOWN");
            response.put("status", "DEGRADED");
        }

        return ResponseEntity.ok(response);
    }
}
