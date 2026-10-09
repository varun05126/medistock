package com.medistock.repository;

import com.medistock.entity.MedicineBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineBatchRepository extends JpaRepository<MedicineBatch, Long> {
    Optional<MedicineBatch> findByBatchNumber(String batchNumber);
    List<MedicineBatch> findByMedicineId(Long medicineId);

    // Near expiry queries
    List<MedicineBatch> findByExpiryDateBetween(LocalDate startDate, LocalDate endDate);

    // Already expired batches with stock
    List<MedicineBatch> findByExpiryDateBeforeAndQuantityGreaterThan(LocalDate date, Integer quantity);

    @Query("SELECT SUM(b.quantity) FROM MedicineBatch b WHERE b.medicine.id = :medicineId AND b.expiryDate > CURRENT_DATE")
    Integer getTotalActiveStockByMedicineId(@Param("medicineId") Long medicineId);
}
