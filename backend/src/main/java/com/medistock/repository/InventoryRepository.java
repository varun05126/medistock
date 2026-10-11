package com.medistock.repository;

import com.medistock.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByMedicineId(Long medicineId);

    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.minimumStock OR i.stockStatus = 'LOW_STOCK'")
    List<Inventory> findLowStockItems();

    long countByStockStatus(String stockStatus);

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.quantity <= i.minimumStock OR i.stockStatus = 'LOW_STOCK'")
    long countLowStock();
}
