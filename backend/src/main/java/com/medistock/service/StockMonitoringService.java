package com.medistock.service;

import com.medistock.entity.Medicine;
import com.medistock.entity.MedicineBatch;
import com.medistock.entity.StockLog;
import com.medistock.entity.User;
import com.medistock.repository.MedicineBatchRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.StockLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockMonitoringService {

    private final MedicineRepository medicineRepository;
    private final MedicineBatchRepository batchRepository;
    private final StockLogRepository stockLogRepository;

    public List<Medicine> getLowStockMedicines() {
        List<Medicine> allMedicines = medicineRepository.findAll();
        List<Medicine> lowStock = new ArrayList<>();

        for (Medicine med : allMedicines) {
            Integer totalStock = batchRepository.getTotalActiveStockByMedicineId(med.getId());
            if (totalStock == null || totalStock <= med.getReorderLevel()) {
                lowStock.add(med);
            }
        }
        return lowStock;
    }

    public List<Medicine> getOutOfStockMedicines() {
        List<Medicine> allMedicines = medicineRepository.findAll();
        List<Medicine> outOfStock = new ArrayList<>();

        for (Medicine med : allMedicines) {
            Integer totalStock = batchRepository.getTotalActiveStockByMedicineId(med.getId());
            if (totalStock == null || totalStock == 0) {
                outOfStock.add(med);
            }
        }
        return outOfStock;
    }

    @Transactional
    public void recordStockMovement(Long medicineId, Long batchId, int quantityChanged, String type, String reason, User user) {
        Medicine medicine = medicineRepository.findById(medicineId).orElse(null);
        MedicineBatch batch = batchId != null ? batchRepository.findById(batchId).orElse(null) : null;

        StockLog log = StockLog.builder()
                .medicine(medicine)
                .batch(batch)
                .quantityChanged(quantityChanged)
                .movementType(type)
                .reason(reason)
                .performedBy(user)
                .build();

        stockLogRepository.save(log);
    }

    public List<StockLog> getRecentStockLogs() {
        return stockLogRepository.findTop50ByOrderByTimestampDesc();
    }
}
