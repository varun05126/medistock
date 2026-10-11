package com.medistock.service;

import com.medistock.dto.request.MedicineRequest;
import com.medistock.entity.Category;
import com.medistock.entity.Inventory;
import com.medistock.entity.Medicine;
import com.medistock.entity.Supplier;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.CategoryRepository;
import com.medistock.repository.InventoryRepository;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;

    public MedicineService(MedicineRepository medicineRepository,
                           CategoryRepository categoryRepository,
                           SupplierRepository supplierRepository,
                           InventoryRepository inventoryRepository) {
        this.medicineRepository = medicineRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + id));
    }

    public List<Medicine> searchMedicines(String query, Long categoryId, Long supplierId) {
        return medicineRepository.searchMedicines(query, categoryId, supplierId);
    }

    @Transactional
    public Medicine createMedicine(MedicineRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
        }

        Supplier supplier = null;
        if (request.getSupplierId() != null) {
            supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + request.getSupplierId()));
        }

        String batch = request.getBatchNumber();
        if (batch == null || batch.isBlank()) {
            batch = "BAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }

        Medicine medicine = Medicine.builder()
                .name(request.getName())
                .batchNumber(batch)
                .category(category)
                .supplier(supplier)
                .quantity(request.getQuantity() != null ? request.getQuantity() : 0)
                .manufacturingDate(request.getManufacturingDate())
                .expiryDate(request.getExpiryDate())
                .price(request.getPrice())
                .build();

        Medicine saved = medicineRepository.save(medicine);

        // Also create an inventory record for this medicine
        Inventory inventory = Inventory.builder()
                .medicine(saved)
                .quantity(saved.getQuantity())
                .minimumStock(20)
                .stockStatus(saved.getQuantity() > 20 ? "AVAILABLE" : "LOW_STOCK")
                .build();
        inventoryRepository.save(inventory);

        return saved;
    }

    @Transactional
    public Medicine updateMedicine(Long id, MedicineRequest request) {
        Medicine medicine = getMedicineById(id);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            medicine.setCategory(category);
        }

        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
            medicine.setSupplier(supplier);
        }

        medicine.setName(request.getName());
        if (request.getBatchNumber() != null) {
            medicine.setBatchNumber(request.getBatchNumber());
        }
        if (request.getQuantity() != null) {
            medicine.setQuantity(request.getQuantity());
            // Sync inventory
            inventoryRepository.findByMedicineId(id).ifPresent(inv -> {
                inv.setQuantity(request.getQuantity());
                inv.setStockStatus(request.getQuantity() > inv.getMinimumStock() ? "AVAILABLE" : "LOW_STOCK");
                inventoryRepository.save(inv);
            });
        }
        if (request.getManufacturingDate() != null) {
            medicine.setManufacturingDate(request.getManufacturingDate());
        }
        if (request.getExpiryDate() != null) {
            medicine.setExpiryDate(request.getExpiryDate());
        }
        medicine.setPrice(request.getPrice());

        return medicineRepository.save(medicine);
    }

    @Transactional
    public void deleteMedicine(Long id) {
        Medicine medicine = getMedicineById(id);
        inventoryRepository.findByMedicineId(id).ifPresent(inventoryRepository::delete);
        medicineRepository.delete(medicine);
    }
}
