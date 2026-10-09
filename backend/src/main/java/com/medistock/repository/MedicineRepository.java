package com.medistock.repository;

import com.medistock.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    Optional<Medicine> findBySku(String sku);
    List<Medicine> findByNameContainingIgnoreCaseOrGenericNameContainingIgnoreCase(String name, String genericName);
    List<Medicine> findByCategoryId(Long categoryId);
    List<Medicine> findBySupplierId(Long supplierId);

    @Query("SELECT m FROM Medicine m WHERE " +
           "(:search IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(m.genericName) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:categoryId IS NULL OR m.category.id = :categoryId) AND " +
           "(:supplierId IS NULL OR m.supplier.id = :supplierId)")
    List<Medicine> searchMedicines(@Param("search") String search,
                                  @Param("categoryId") Long categoryId,
                                  @Param("supplierId") Long supplierId);
}
