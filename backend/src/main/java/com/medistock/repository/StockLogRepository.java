package com.medistock.repository;

import com.medistock.entity.StockLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockLogRepository extends JpaRepository<StockLog, Long> {
    List<StockLog> findByMedicineIdOrderByTimestampDesc(Long medicineId);
    List<StockLog> findTop50ByOrderByTimestampDesc();
}
