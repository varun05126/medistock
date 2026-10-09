package com.medistock.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAnalyticsResponse {
    private long totalMedicines;
    private long lowStockCount;
    private long outOfStockCount;
    private long expiringSoonCount;
    private long expiredCount;
    private long totalSuppliers;
    private long pendingPurchaseOrders;
    private BigDecimal totalInventoryValuation;
    private Map<String, Long> stockByCategory;
    private Map<String, Long> monthlyMovementStats;
}
