-- =============================================================================
-- MediStock: Seed Data (Preserving existing samples and establishing 4 roles)
-- =============================================================================

USE medistock;

-- 1. Roles
INSERT INTO roles (id, name) VALUES
(1, 'ADMIN'),
(2, 'PHARMACIST'),
(3, 'STAFF'),
(4, 'SUPPLIER')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Analgesic', 'Pain relief medications'),
(2, 'Antibiotic', 'Infection treatment medications'),
(3, 'Antihistamine', 'Allergy relief medications'),
(4, 'Antacid', 'Acidity and heartburn treatment'),
(5, 'Supplement', 'Vitamins and dietary minerals')
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);

-- 3. Suppliers
INSERT INTO suppliers (id, name, contact_number, email, address) VALUES
(1, 'MedPlus Distributors', '9876543210', 'medplus@example.com', 'Hyderabad, Telangana'),
(2, 'Apollo Pharma Suppliers', '9876501234', 'apollo@example.com', 'Secunderabad, Telangana'),
(3, 'Sri Sai Medical Distributors', '9988776655', 'srisai@example.com', 'Kukatpally, Hyderabad'),
(4, 'HealthCare Pharma Ltd', '9123456789', 'healthcare@example.com', 'Madhapur, Hyderabad'),
(5, 'LifeLine Medical Suppliers', '9012345678', 'lifeline@example.com', 'Dilsukhnagar, Hyderabad')
ON DUPLICATE KEY UPDATE name=VALUES(name), contact_number=VALUES(contact_number), email=VALUES(email), address=VALUES(address);

-- 4. Users (Passwords hashed using BCrypt)
-- Passwords:
-- admin / admin123
-- pharmacist / pharmacist123
-- staff / staff123
-- supplier / supplier123
INSERT INTO users (id, name, username, email, password, role_id, supplier_id) VALUES
(1, 'Varun Admin', 'admin', 'admin@medistock.com', '$2a$10$xEd8fpDvwQqZXWpQIZZlXOUBfSKiZdTWMj.rzc1xctr4sIDYMrhcK', 1, NULL),
(2, 'Rahul Pharmacist', 'pharmacist', 'pharmacist@medistock.com', '$2a$10$tBif2lk.CLG5J4bnIE6YMutapbZoNVMRQApeMjiqGxcCoHgoWRWgm', 2, NULL),
(3, 'Anil Staff', 'staff', 'staff@medistock.com', '$2a$10$vLIgKYBK2jQ/WK2C3D43OebVi.uI5M92fx9bWYyLMuXJ0yzfYb.vy', 3, NULL),
(4, 'MedPlus Supplier Rep', 'supplier', 'supplier@medistock.com', '$2a$10$zH4LdxLtytyVPqFWxCgr8.IoT3I3qFKYTxR8rtoUVWsq.igrWhMqa', 4, 1)
ON DUPLICATE KEY UPDATE 
    name=VALUES(name),
    username=VALUES(username),
    password=VALUES(password),
    role_id=VALUES(role_id),
    supplier_id=VALUES(supplier_id);

-- 5. Medicines
INSERT INTO medicines (id, name, batch_number, category_id, supplier_id, quantity, manufacturing_date, expiry_date, price) VALUES
(1, 'Paracetamol 500mg', 'PCM2026A01', 1, 1, 150, '2026-01-10', '2028-01-10', 25.00),
(2, 'Amoxicillin 500mg', 'AMX2026B02', 2, 2, 80, '2026-02-15', '2028-02-15', 120.00),
(3, 'Cetirizine 10mg', 'CTZ2026C03', 3, 3, 45, '2026-03-05', '2028-03-05', 35.00),
(4, 'Omeprazole 20mg', 'OMP2026D04', 4, 4, 12, '2026-01-20', '2027-01-20', 60.00),
(5, 'Vitamin C 500mg', 'VTC2026E05', 5, 5, 200, '2026-04-10', '2028-04-10', 80.00),
(6, 'Azithromycin 500mg', 'AZT2026F06', 2, 2, 8, '2026-02-25', '2027-02-25', 150.00)
ON DUPLICATE KEY UPDATE
    name=VALUES(name),
    batch_number=VALUES(batch_number),
    quantity=VALUES(quantity),
    price=VALUES(price);

-- 6. Inventory
INSERT INTO inventory (id, medicine_id, quantity, minimum_stock, stock_status) VALUES
(1, 1, 150, 30, 'AVAILABLE'),
(2, 2, 80, 20, 'AVAILABLE'),
(3, 3, 45, 20, 'AVAILABLE'),
(4, 4, 12, 20, 'LOW_STOCK'),
(5, 5, 200, 30, 'AVAILABLE'),
(6, 6, 8, 20, 'LOW_STOCK')
ON DUPLICATE KEY UPDATE
    quantity=VALUES(quantity),
    minimum_stock=VALUES(minimum_stock),
    stock_status=VALUES(stock_status);

-- 7. Purchase Orders
INSERT INTO purchase_orders (id, supplier_id, order_date, total_amount, status) VALUES
(1, 1, '2026-10-01', 5000.00, 'COMPLETED'),
(2, 2, '2026-10-03', 8500.00, 'COMPLETED'),
(3, 3, '2026-10-05', 3000.00, 'PENDING')
ON DUPLICATE KEY UPDATE status=VALUES(status), total_amount=VALUES(total_amount);

-- 8. Purchase Order Items
INSERT INTO purchase_order_items (id, purchase_order_id, medicine_id, quantity, unit_price) VALUES
(1, 1, 1, 100, 25.00),
(2, 2, 2, 50, 120.00),
(3, 2, 6, 20, 150.00),
(4, 3, 3, 50, 35.00)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity), unit_price=VALUES(unit_price);

-- 9. Expiry Tracking
INSERT INTO expiry_tracking (id, medicine_id, expiry_date, status, notification_sent) VALUES
(1, 1, '2028-01-10', 'VALID', 0),
(2, 2, '2028-02-15', 'VALID', 0),
(3, 3, '2028-03-05', 'VALID', 0),
(4, 4, '2027-01-20', 'NEAR_EXPIRY', 1),
(5, 5, '2028-04-10', 'VALID', 0),
(6, 6, '2027-02-25', 'NEAR_EXPIRY', 1)
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 10. Stock Logs
INSERT INTO stock_logs (id, medicine_id, quantity, operation, previous_quantity, new_quantity) VALUES
(1, 1, 150, 'ADD', 0, 150),
(2, 2, 80, 'ADD', 0, 80),
(3, 3, 45, 'ADD', 0, 45),
(4, 4, 12, 'ADD', 0, 12),
(5, 5, 200, 'ADD', 0, 200),
(6, 6, 8, 'ADD', 0, 8)
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);

-- 11. Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES
(1, 2, 'Low Stock Alert', 'Omeprazole 20mg stock is below the minimum level.', 'LOW_STOCK', 0),
(2, 2, 'Low Stock Alert', 'Azithromycin 500mg stock is below the minimum level.', 'LOW_STOCK', 0),
(3, 2, 'Expiry Alert', 'Omeprazole 20mg is approaching its expiry date.', 'EXPIRY', 0),
(4, 1, 'Inventory Update', 'New medicines have been added to the inventory.', 'INVENTORY', 1)
ON DUPLICATE KEY UPDATE is_read=VALUES(is_read);

-- 12. Reports
INSERT INTO reports (id, name, report_type, generated_by, file_path) VALUES
(1, 'Monthly Inventory Report', 'INVENTORY', 1, '/reports/monthly_inventory_october_2026.pdf'),
(2, 'Low Stock Report', 'LOW_STOCK', 2, '/reports/low_stock_october_2026.pdf'),
(3, 'Expiry Report', 'EXPIRY', 2, '/reports/expiry_october_2026.pdf')
ON DUPLICATE KEY UPDATE name=VALUES(name);
