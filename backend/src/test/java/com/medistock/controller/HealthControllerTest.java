package com.medistock.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcOperations;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HealthControllerTest {

    @Mock
    private JdbcOperations jdbcOperations;

    @InjectMocks
    private HealthController healthController;

    @Test
    @DisplayName("Health check returns UP when database is reachable")
    void testCheckHealthUp() {
        when(jdbcOperations.queryForObject(anyString(), eq(Integer.class))).thenReturn(1);

        ResponseEntity<Map<String, Object>> response = healthController.checkHealth();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
        assertEquals("CONNECTED", response.getBody().get("database"));
        assertEquals("medistock-backend", response.getBody().get("service"));
    }

    @Test
    @DisplayName("Health check returns DEGRADED when database fails")
    void testCheckHealthDatabaseDegraded() {
        when(jdbcOperations.queryForObject(anyString(), eq(Integer.class))).thenThrow(new RuntimeException("Connection failed"));

        ResponseEntity<Map<String, Object>> response = healthController.checkHealth();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("DEGRADED", response.getBody().get("status"));
        assertEquals("DOWN", response.getBody().get("database"));
    }
}
