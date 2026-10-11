package com.medistock.config;

import com.medistock.entity.*;
import com.medistock.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataBootstrapInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataBootstrapInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SupplierRepository supplierRepository;
    private final CategoryRepository categoryRepository;
    private final MedicineRepository medicineRepository;
    private final InventoryRepository inventoryRepository;
    private final ExpiryTrackingRepository expiryTrackingRepository;
    private final PurchaseOrderRepository orderRepository;
    private final StockLogRepository stockLogRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.username:admin}")
    private String adminUsername;

    @Value("${app.bootstrap.admin.email:admin@medistock.com}")
    private String adminEmail;

    @Value("${app.bootstrap.admin.password:admin123}")
    private String adminPassword;

    @Value("${app.bootstrap.admin.reset:false}")
    private boolean adminReset;

    @Value("${app.bootstrap.demo-data:true}")
    private boolean demoDataEnabled;

    public DataBootstrapInitializer(UserRepository userRepository,
                                   RoleRepository roleRepository,
                                   SupplierRepository supplierRepository,
                                   CategoryRepository categoryRepository,
                                   MedicineRepository medicineRepository,
                                   InventoryRepository inventoryRepository,
                                   ExpiryTrackingRepository expiryTrackingRepository,
                                   PurchaseOrderRepository orderRepository,
                                   StockLogRepository stockLogRepository,
                                   NotificationRepository notificationRepository,
                                   PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.supplierRepository = supplierRepository;
        this.categoryRepository = categoryRepository;
        this.medicineRepository = medicineRepository;
        this.inventoryRepository = inventoryRepository;
        this.expiryTrackingRepository = expiryTrackingRepository;
        this.orderRepository = orderRepository;
        this.stockLogRepository = stockLogRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        try {
            initRoles();
            initAdminUser();
            if (demoDataEnabled) {
                initCategoriesAndSuppliers();
                initDemoUsers();
                initMedicinesAndInventory();
                initPurchaseOrders();
                initNotifications();
            }
        } catch (Exception e) {
            logger.warn("Bootstrap initialization encountered non-fatal note: {}", e.getMessage());
        }
    }

    private void initRoles() {
        String[] roleNames = {"ADMIN", "PHARMACIST", "STAFF", "SUPPLIER",
                              "ROLE_ADMIN", "ROLE_PHARMACIST", "ROLE_STAFF", "ROLE_SUPPLIER"};
        for (String r : roleNames) {
            if (roleRepository.findByName(r).isEmpty()) {
                roleRepository.save(new Role(null, r));
            }
        }
    }

    private void initAdminUser() {
        Role adminRole = roleRepository.findByName("ADMIN")
                .or(() -> roleRepository.findByName("ROLE_ADMIN"))
                .orElseGet(() -> roleRepository.save(new Role(null, "ADMIN")));

        User existingAdmin = userRepository.findByUsername(adminUsername)
                .or(() -> userRepository.findByEmail(adminEmail))
                .orElse(null);

        if (existingAdmin == null) {
            User admin = User.builder()
                    .name("Varun Admin")
                    .username(adminUsername)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(adminRole)
                    .supplier(null)
                    .build();
            userRepository.save(admin);
            logger.info("Admin bootstrap account successfully initialized (username: {})", adminUsername);
        } else if (adminReset) {
            existingAdmin.setPassword(passwordEncoder.encode(adminPassword));
            userRepository.save(existingAdmin);
            logger.info("Admin password reset successfully for user: {}", adminUsername);
        }
    }

    private void initCategoriesAndSuppliers() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category(null, "Analgesic", "Pain relief medications"));
            categoryRepository.save(new Category(null, "Antibiotic", "Infection treatment medications"));
            categoryRepository.save(new Category(null, "Antihistamine", "Allergy relief medications"));
            categoryRepository.save(new Category(null, "Antacid", "Acidity and heartburn treatment"));
            categoryRepository.save(new Category(null, "Supplement", "Vitamins and dietary minerals"));
            categoryRepository.save(new Category(null, "Cardiovascular", "Heart and blood pressure medications"));
            categoryRepository.save(new Category(null, "Respiratory", "Asthma and cough medications"));
            logger.info("Seeded 7 medicine categories");
        }

        if (supplierRepository.count() == 0) {
            supplierRepository.save(new Supplier(null, "MedPlus Distributors", "9876543210", "medplus@example.com", "Hyderabad, Telangana", LocalDateTime.now()));
            supplierRepository.save(new Supplier(null, "Apollo Pharma Suppliers", "9876501234", "apollo@example.com", "Secunderabad, Telangana", LocalDateTime.now()));
            supplierRepository.save(new Supplier(null, "Sri Sai Medical Distributors", "9988776655", "srisai@example.com", "Kukatpally, Hyderabad", LocalDateTime.now()));
            supplierRepository.save(new Supplier(null, "HealthCare Pharma Ltd", "9123456789", "healthcare@example.com", "Madhapur, Hyderabad", LocalDateTime.now()));
            supplierRepository.save(new Supplier(null, "LifeLine Medical Suppliers", "9012345678", "lifeline@example.com", "Dilsukhnagar, Hyderabad", LocalDateTime.now()));
            logger.info("Seeded 5 pharmaceutical suppliers");
        }
    }

    private void initDemoUsers() {
        Role pharmacistRole = roleRepository.findByName("PHARMACIST")
                .or(() -> roleRepository.findByName("ROLE_PHARMACIST"))
                .orElseGet(() -> roleRepository.save(new Role(null, "PHARMACIST")));

        Role staffRole = roleRepository.findByName("STAFF")
                .or(() -> roleRepository.findByName("ROLE_STAFF"))
                .orElseGet(() -> roleRepository.save(new Role(null, "STAFF")));

        Role supplierRole = roleRepository.findByName("SUPPLIER")
                .or(() -> roleRepository.findByName("ROLE_SUPPLIER"))
                .orElseGet(() -> roleRepository.save(new Role(null, "SUPPLIER")));

        if (userRepository.findByUsername("pharmacist").isEmpty()) {
            userRepository.save(User.builder()
                    .name("Rahul Pharmacist")
                    .username("pharmacist")
                    .email("pharmacist@medistock.com")
                    .password(passwordEncoder.encode("pharmacist123"))
                    .role(pharmacistRole)
                    .build());
        }

        if (userRepository.findByUsername("staff").isEmpty()) {
            userRepository.save(User.builder()
                    .name("Anil Staff")
                    .username("staff")
                    .email("staff@medistock.com")
                    .password(passwordEncoder.encode("staff123"))
                    .role(staffRole)
                    .build());
        }

        Supplier primarySupplier = supplierRepository.findAll().stream().findFirst().orElse(null);
        if (userRepository.findByUsername("supplier").isEmpty()) {
            userRepository.save(User.builder()
                    .name("MedPlus Supplier Rep")
                    .username("supplier")
                    .email("supplier@medistock.com")
                    .password(passwordEncoder.encode("supplier123"))
                    .role(supplierRole)
                    .supplier(primarySupplier)
                    .build());
        }
    }

    private void initMedicinesAndInventory() {
        if (medicineRepository.count() == 0) {
            List<Category> categories = categoryRepository.findAll();
            List<Supplier> suppliers = supplierRepository.findAll();

            Category catAnalgesic = categories.stream().filter(c -> c.getName().equals("Analgesic")).findFirst().orElse(categories.get(0));
            Category catAntibiotic = categories.stream().filter(c -> c.getName().equals("Antibiotic")).findFirst().orElse(categories.get(0));
            Category catAntihistamine = categories.stream().filter(c -> c.getName().equals("Antihistamine")).findFirst().orElse(categories.get(0));
            Category catAntacid = categories.stream().filter(c -> c.getName().equals("Antacid")).findFirst().orElse(categories.get(0));
            Category catSupplement = categories.stream().filter(c -> c.getName().equals("Supplement")).findFirst().orElse(categories.get(0));
            Category catCardio = categories.stream().filter(c -> c.getName().equals("Cardiovascular")).findFirst().orElse(categories.get(0));

            Supplier sup1 = suppliers.get(0);
            Supplier sup2 = suppliers.size() > 1 ? suppliers.get(1) : sup1;
            Supplier sup3 = suppliers.size() > 2 ? suppliers.get(2) : sup1;

            createMedicineWithInventory("Paracetamol 500mg", "PCM2026A01", catAnalgesic, sup1, 150, 20, "AVAILABLE",
                    LocalDate.now().minusMonths(2), LocalDate.now().plusMonths(24), new BigDecimal("25.00"));

            createMedicineWithInventory("Amoxicillin 500mg", "AMX2026B02", catAntibiotic, sup2, 80, 15, "AVAILABLE",
                    LocalDate.now().minusMonths(3), LocalDate.now().plusMonths(18), new BigDecimal("120.00"));

            createMedicineWithInventory("Cetirizine 10mg", "CTZ2026C03", catAntihistamine, sup3, 15, 20, "LOW_STOCK",
                    LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(12), new BigDecimal("35.00"));

            createMedicineWithInventory("Pantoprazole 40mg", "PAN2026D04", catAntacid, sup1, 0, 25, "OUT_OF_STOCK",
                    LocalDate.now().minusMonths(4), LocalDate.now().plusMonths(20), new BigDecimal("85.00"));

            createMedicineWithInventory("Vitamin D3 60K", "VTD2026E05", catSupplement, sup2, 200, 30, "AVAILABLE",
                    LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(24), new BigDecimal("150.00"));

            createMedicineWithInventory("Azithromycin 500mg", "AZM2026F06", catAntibiotic, sup1, 12, 15, "NEAR_EXPIRY",
                    LocalDate.now().minusMonths(10), LocalDate.now().plusDays(25), new BigDecimal("130.00"));

            createMedicineWithInventory("Metformin 500mg", "MET2026G07", catCardio, sup2, 300, 50, "AVAILABLE",
                    LocalDate.now().minusMonths(2), LocalDate.now().plusMonths(24), new BigDecimal("45.00"));

            createMedicineWithInventory("Atorvastatin 20mg", "ATR2026H08", catCardio, sup3, 90, 20, "AVAILABLE",
                    LocalDate.now().minusMonths(1), LocalDate.now().plusMonths(20), new BigDecimal("110.00"));

            logger.info("Seeded 8 medicines with active inventory and expiry records");
        }
    }

    private void createMedicineWithInventory(String name, String batch, Category cat, Supplier sup,
                                             int qty, int minStock, String status,
                                             LocalDate mfg, LocalDate exp, BigDecimal price) {
        Medicine med = new Medicine(null, name, batch, cat, sup, qty, mfg, exp, price, LocalDateTime.now());
        Medicine savedMed = medicineRepository.save(med);

        Inventory inv = new Inventory(null, savedMed, qty, minStock, status, LocalDateTime.now());
        inventoryRepository.save(inv);

        String expiryStatus = exp.isBefore(LocalDate.now()) ? "EXPIRED"
                : exp.isBefore(LocalDate.now().plusDays(30)) ? "NEAR_EXPIRY" : "VALID";
        ExpiryTracking tracking = new ExpiryTracking(null, savedMed, exp, expiryStatus, false, LocalDateTime.now());
        expiryTrackingRepository.save(tracking);

        StockLog log = new StockLog(null, savedMed, qty, "INITIAL_STOCK", 0, qty, LocalDateTime.now());
        stockLogRepository.save(log);
    }

    private void initPurchaseOrders() {
        if (orderRepository.count() == 0 && supplierRepository.count() > 0) {
            Supplier sup = supplierRepository.findAll().get(0);
            PurchaseOrder po = new PurchaseOrder(null, sup, LocalDate.now().minusDays(5), new BigDecimal("1500.00"), "PENDING", LocalDateTime.now(), new ArrayList<>());
            orderRepository.save(po);

            PurchaseOrder po2 = new PurchaseOrder(null, sup, LocalDate.now().minusDays(15), new BigDecimal("4200.00"), "RECEIVED", LocalDateTime.now().minusDays(15), new ArrayList<>());
            orderRepository.save(po2);
            logger.info("Seeded 2 purchase orders");
        }
    }

    private void initNotifications() {
        if (notificationRepository.count() == 0) {
            User admin = userRepository.findByUsername(adminUsername).orElse(null);
            if (admin != null) {
                notificationRepository.save(new Notification(null, "Low Stock Alert", "Cetirizine 10mg is below the minimum stock threshold (15 remaining).", "WARNING", admin, false, LocalDateTime.now()));
                notificationRepository.save(new Notification(null, "Near Expiry Alert", "Azithromycin 500mg batch AZM2026F06 is expiring within 30 days.", "ALERT", admin, false, LocalDateTime.now()));
                logger.info("Seeded system notifications");
            }
        }
    }
}
