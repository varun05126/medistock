package com.medistock.dto.response;

import java.math.BigDecimal;
import java.util.Map;

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

    public DashboardAnalyticsResponse() {}

    public DashboardAnalyticsResponse(long totalMedicines, long lowStockCount, long outOfStockCount, long expiringSoonCount, long expiredCount, long totalSuppliers, long pendingPurchaseOrders, BigDecimal totalInventoryValuation, Map<String, Long> stockByCategory, Map<String, Long> monthlyMovementStats) {
        this.totalMedicines = totalMedicines;
        this.lowStockCount = lowStockCount;
        this.outOfStockCount = outOfStockCount;
        this.expiringSoonCount = expiringSoonCount;
        this.expiredCount = expiredCount;
        this.totalSuppliers = totalSuppliers;
        this.pendingPurchaseOrders = pendingPurchaseOrders;
        this.totalInventoryValuation = totalInventoryValuation;
        this.stockByCategory = stockByCategory;
        this.monthlyMovementStats = monthlyMovementStats;
    }

    public long getTotalMedicines() { return totalMedicines; }
    public void setTotalMedicines(long totalMedicines) { this.totalMedicines = totalMedicines; }
    public long getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; }
    public long getOutOfStockCount() { return outOfStockCount; }
    public void setOutOfStockCount(long outOfStockCount) { this.outOfStockCount = outOfStockCount; }
    public long getExpiringSoonCount() { return expiringSoonCount; }
    public void setExpiringSoonCount(long expiringSoonCount) { this.expiringSoonCount = expiringSoonCount; }
    public long getExpiredCount() { return expiredCount; }
    public void setExpiredCount(long expiredCount) { this.expiredCount = expiredCount; }
    public long getTotalSuppliers() { return totalSuppliers; }
    public void setTotalSuppliers(long totalSuppliers) { this.totalSuppliers = totalSuppliers; }
    public long getPendingPurchaseOrders() { return pendingPurchaseOrders; }
    public void setPendingPurchaseOrders(long pendingPurchaseOrders) { this.pendingPurchaseOrders = pendingPurchaseOrders; }
    public BigDecimal getTotalInventoryValuation() { return totalInventoryValuation; }
    public void setTotalInventoryValuation(BigDecimal totalInventoryValuation) { this.totalInventoryValuation = totalInventoryValuation; }
    public Map<String, Long> getStockByCategory() { return stockByCategory; }
    public void setStockByCategory(Map<String, Long> stockByCategory) { this.stockByCategory = stockByCategory; }
    public Map<String, Long> getMonthlyMovementStats() { return monthlyMovementStats; }
    public void setMonthlyMovementStats(Map<String, Long> monthlyMovementStats) { this.monthlyMovementStats = monthlyMovementStats; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
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

        public Builder totalMedicines(long totalMedicines) { this.totalMedicines = totalMedicines; return this; }
        public Builder lowStockCount(long lowStockCount) { this.lowStockCount = lowStockCount; return this; }
        public Builder outOfStockCount(long outOfStockCount) { this.outOfStockCount = outOfStockCount; return this; }
        public Builder expiringSoonCount(long expiringSoonCount) { this.expiringSoonCount = expiringSoonCount; return this; }
        public Builder expiredCount(long expiredCount) { this.expiredCount = expiredCount; return this; }
        public Builder totalSuppliers(long totalSuppliers) { this.totalSuppliers = totalSuppliers; return this; }
        public Builder pendingPurchaseOrders(long pendingPurchaseOrders) { this.pendingPurchaseOrders = pendingPurchaseOrders; return this; }
        public Builder totalInventoryValuation(BigDecimal totalInventoryValuation) { this.totalInventoryValuation = totalInventoryValuation; return this; }
        public Builder stockByCategory(Map<String, Long> stockByCategory) { this.stockByCategory = stockByCategory; return this; }
        public Builder monthlyMovementStats(Map<String, Long> monthlyMovementStats) { this.monthlyMovementStats = monthlyMovementStats; return this; }
        public DashboardAnalyticsResponse build() {
            return new DashboardAnalyticsResponse(totalMedicines, lowStockCount, outOfStockCount, expiringSoonCount, expiredCount, totalSuppliers, pendingPurchaseOrders, totalInventoryValuation, stockByCategory, monthlyMovementStats);
        }
    }
}
