package com.medistock.service;

import com.medistock.dto.request.PurchaseOrderRequest;
import com.medistock.entity.Medicine;
import com.medistock.entity.PurchaseOrder;
import com.medistock.entity.PurchaseOrderItem;
import com.medistock.entity.Supplier;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.PurchaseOrderRepository;
import com.medistock.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository orderRepository;
    private final SupplierRepository supplierRepository;
    private final MedicineRepository medicineRepository;

    public PurchaseOrderService(PurchaseOrderRepository orderRepository,
                                SupplierRepository supplierRepository,
                                MedicineRepository medicineRepository) {
        this.orderRepository = orderRepository;
        this.supplierRepository = supplierRepository;
        this.medicineRepository = medicineRepository;
    }

    public List<PurchaseOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    public PurchaseOrder getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order not found with ID: " + id));
    }

    public List<PurchaseOrder> getOrdersBySupplierId(Long supplierId) {
        return orderRepository.findBySupplierId(supplierId);
    }

    @Transactional
    public PurchaseOrder createOrder(PurchaseOrderRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + request.getSupplierId()));

        LocalDate orderDate = request.getOrderDate() != null ? request.getOrderDate() : LocalDate.now();

        PurchaseOrder order = PurchaseOrder.builder()
                .supplier(supplier)
                .orderDate(orderDate)
                .status("PENDING")
                .items(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (PurchaseOrderRequest.PurchaseOrderItemRequest itemReq : request.getItems()) {
            Medicine medicine = medicineRepository.findById(itemReq.getMedicineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with ID: " + itemReq.getMedicineId()));

            BigDecimal itemTotal = itemReq.getUnitPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(itemTotal);

            PurchaseOrderItem item = PurchaseOrderItem.builder()
                    .purchaseOrder(order)
                    .medicine(medicine)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .build();

            order.getItems().add(item);
        }

        order.setTotalAmount(total);
        return orderRepository.save(order);
    }

    @Transactional
    public PurchaseOrder updateStatus(Long id, String status) {
        PurchaseOrder order = getOrderById(id);
        order.setStatus(status.toUpperCase());
        return orderRepository.save(order);
    }
}
