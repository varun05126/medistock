package com.medistock.service;

import com.medistock.entity.PurchaseOrder;
import com.medistock.entity.Supplier;
import com.medistock.entity.User;
import com.medistock.exception.BadRequestException;
import com.medistock.repository.PurchaseOrderRepository;
import com.medistock.repository.SupplierRepository;
import com.medistock.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PurchaseOrderRepository purchaseOrderRepository;

    private SupplierService supplierService;

    @BeforeEach
    void setUp() {
        supplierService = new SupplierService(supplierRepository, userRepository, purchaseOrderRepository);
    }

    @Test
    @DisplayName("Authenticated supplier can access their own associated supplier record")
    void testGetAuthenticatedSupplierSuccess() {
        Supplier supplier = new Supplier(1L, "MedPlus", "1234567890", "sup@medplus.com", "Hyderabad", null);
        User user = new User(4L, "Supplier Rep", "supplier", "sup@medplus.com", "hash", null, supplier, null);

        when(userRepository.findByUsername("supplier")).thenReturn(Optional.of(user));

        Supplier result = supplierService.getAuthenticatedSupplier("supplier");

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("MedPlus", result.getName());
    }

    @Test
    @DisplayName("Supplier account without associated record throws BadRequestException")
    void testGetAuthenticatedSupplierUnlinkedThrows() {
        User user = new User(4L, "Unlinked User", "supplier2", "sup2@test.com", "hash", null, null, null);
        when(userRepository.findByUsername("supplier2")).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> supplierService.getAuthenticatedSupplier("supplier2"));
    }

    @Test
    @DisplayName("Authenticated supplier retrieves only their own orders")
    void testGetOrdersForAuthenticatedSupplierIsolation() {
        Supplier supplier = new Supplier(1L, "MedPlus", "1234567890", "sup@medplus.com", "Hyderabad", null);
        User user = new User(4L, "Supplier Rep", "supplier", "sup@medplus.com", "hash", null, supplier, null);

        PurchaseOrder order = new PurchaseOrder();
        order.setId(10L);
        order.setSupplier(supplier);

        when(userRepository.findByUsername("supplier")).thenReturn(Optional.of(user));
        when(purchaseOrderRepository.findBySupplierId(1L)).thenReturn(Collections.singletonList(order));

        List<PurchaseOrder> orders = supplierService.getOrdersForAuthenticatedSupplier("supplier");

        assertEquals(1, orders.size());
        assertEquals(10L, orders.get(0).getId());
        verify(purchaseOrderRepository, times(1)).findBySupplierId(1L);
    }
}
