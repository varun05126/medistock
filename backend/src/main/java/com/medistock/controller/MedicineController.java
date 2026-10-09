package com.medistock.controller;

import com.medistock.dto.request.MedicineRequest;
import com.medistock.dto.response.ApiResponse;
import com.medistock.entity.Medicine;
import com.medistock.service.MedicineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicines")
@RequiredArgsConstructor
@Tag(name = "Medicine Inventory", description = "Medicine management APIs")
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping
    @Operation(summary = "Get list of all medicines or search")
    public ResponseEntity<ApiResponse<List<Medicine>>> getAllMedicines(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long supplierId) {
        List<Medicine> medicines = medicineService.searchMedicines(search, categoryId, supplierId);
        return ResponseEntity.ok(ApiResponse.success("Medicines retrieved successfully", medicines));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get medicine by ID")
    public ResponseEntity<ApiResponse<Medicine>> getMedicineById(@PathVariable Long id) {
        Medicine medicine = medicineService.getMedicineById(id);
        return ResponseEntity.ok(ApiResponse.success("Medicine details retrieved", medicine));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Create a new medicine")
    public ResponseEntity<ApiResponse<Medicine>> createMedicine(@Valid @RequestBody MedicineRequest request) {
        Medicine medicine = medicineService.createMedicine(request);
        return ResponseEntity.ok(ApiResponse.success("Medicine created successfully", medicine));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    @Operation(summary = "Update medicine details")
    public ResponseEntity<ApiResponse<Medicine>> updateMedicine(@PathVariable Long id, @Valid @RequestBody MedicineRequest request) {
        Medicine updated = medicineService.updateMedicine(id, request);
        return ResponseEntity.ok(ApiResponse.success("Medicine updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete medicine")
    public ResponseEntity<ApiResponse<String>> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok(ApiResponse.success("Medicine deleted successfully", null));
    }
}
