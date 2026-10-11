
package com.medistock.repository;

import com.medistock.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    Optional<Medicine> findByBatchNumber(String batchNumber);

    List<Medicine> findByNameContainingIgnoreCase(String name);

    List<Medicine> findByCategoryId(Long categoryId);

    List<Medicine> findBySupplierId(Long supplierId);

    @Query("""
        SELECT m
        FROM Medicine m
        WHERE (
            COALESCE(:search, '') = ''
            OR LOWER(m.name) LIKE LOWER(CONCAT('%', COALESCE(:search, ''), '%'))
            OR LOWER(m.batchNumber) LIKE LOWER(CONCAT('%', COALESCE(:search, ''), '%'))
        )
        AND (:categoryId IS NULL OR m.category.id = :categoryId)
        AND (:supplierId IS NULL OR m.supplier.id = :supplierId)
        """)
    List<Medicine> searchMedicines(
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            @Param("supplierId") Long supplierId
    );

    List<Medicine> findByExpiryDateBefore(LocalDate date);

    List<Medicine> findByExpiryDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );
}
