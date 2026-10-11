package com.medistock.service;

import com.medistock.dto.request.SupplierRequest;
import com.medistock.entity.PurchaseOrder;
import com.medistock.entity.Supplier;
import com.medistock.entity.User;
import com.medistock.exception.BadRequestException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.PurchaseOrderRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public SupplierService(SupplierRepository supplierRepository,
                           UserRepository userRepository,
                           PurchaseOrderRepository purchaseOrderRepository) {
        this.supplierRepository = supplierRepository;
        this.userRepository = userRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public Supplier getAuthenticatedSupplier(String usernameOrEmail) {
        User user = userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + usernameOrEmail));

        if (user.getSupplier() == null) {
            throw new BadRequestException("This account is not associated with any supplier record.");
        }
        return user.getSupplier();
    }

    @Transactional(readOnly = true)
    public List<PurchaseOrder> getOrdersForAuthenticatedSupplier(String usernameOrEmail) {
        Supplier supplier = getAuthenticatedSupplier(usernameOrEmail);
        return purchaseOrderRepository.findBySupplierId(supplier.getId());
    }

    @Transactional
    public Supplier updateAuthenticatedSupplier(String usernameOrEmail, SupplierRequest request) {
        Supplier supplier = getAuthenticatedSupplier(usernameOrEmail);
        if (request.getName() != null && !request.getName().isBlank()) {
            supplier.setName(request.getName());
        }
        if (request.getContactNumber() != null) {
            supplier.setContactNumber(request.getContactNumber());
        }
        if (request.getEmail() != null) {
            supplier.setEmail(request.getEmail());
        }
        if (request.getAddress() != null) {
            supplier.setAddress(request.getAddress());
        }
        return supplierRepository.save(supplier);
    }

    @Transactional
    public Supplier createSupplier(SupplierRequest request) {
        Supplier supplier = Supplier.builder()
                .name(request.getName())
                .contactNumber(request.getContactNumber())
                .email(request.getEmail())
                .address(request.getAddress())
                .build();
        return supplierRepository.save(supplier);
    }

    @Transactional
    public Supplier updateSupplier(Long id, SupplierRequest request) {
        Supplier supplier = getSupplierById(id);
        supplier.setName(request.getName());
        supplier.setContactNumber(request.getContactNumber());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        return supplierRepository.save(supplier);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        Supplier supplier = getSupplierById(id);
        supplierRepository.delete(supplier);
    }
}
