package com.medistock.service;

import com.medistock.entity.Inventory;
import com.medistock.entity.Medicine;
import com.medistock.entity.StockLog;
import com.medistock.repository.InventoryRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.StockLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class StockMonitoringService {

    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final StockLogRepository stockLogRepository;

    public StockMonitoringService(MedicineRepository medicineRepository,
                                  InventoryRepository inventoryRepository,
                                  StockLogRepository stockLogRepository) {
        this.medicineRepository = medicineRepository;
        this.inventoryRepository = inventoryRepository;
        this.stockLogRepository = stockLogRepository;
    }

    public List<Medicine> getLowStockMedicines() {
        List<Inventory> lowStockItems = inventoryRepository.findLowStockItems();
        List<Medicine> medicines = new ArrayList<>();
        for (Inventory inv : lowStockItems) {
            if (inv.getMedicine() != null) {
                medicines.add(inv.getMedicine());
            }
        }
        return medicines;
    }

    public List<Medicine> getOutOfStockMedicines() {
        List<Medicine> all = medicineRepository.findAll();
        List<Medicine> out = new ArrayList<>();
        for (Medicine m : all) {
            if (m.getQuantity() != null && m.getQuantity() == 0) {
                out.add(m);
            }
        }
        return out;
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    @Transactional
    public void recordStockMovement(Long medicineId, int quantity, String operation, int prevQty, int newQty) {
        Medicine medicine = medicineRepository.findById(medicineId).orElse(null);
        if (medicine != null) {
            StockLog log = StockLog.builder()
                    .medicine(medicine)
                    .quantity(quantity)
                    .operation(operation)
                    .previousQuantity(prevQty)
                    .newQuantity(newQty)
                    .build();
            stockLogRepository.save(log);
        }
    }

    public List<StockLog> getRecentStockLogs() {
        return stockLogRepository.findTop50ByOrderByCreatedAtDesc();
    }
}
