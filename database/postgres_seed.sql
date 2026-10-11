-- =============================================================================
-- MediStock: PostgreSQL Initial Seed Data
-- 4 System Roles, Sample Suppliers, Users with BCrypt Passwords, & Inventory
-- =============================================================================

-- 1. Roles
INSERT INTO roles (id, name) VALUES
(1, 'ADMIN'),
(2, 'PHARMACIST'),
(3, 'STAFF'),
(4, 'SUPPLIER')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Analgesic', 'Pain relief medications'),
(2, 'Antibiotic', 'Infection treatment medications'),
(3, 'Antihistamine', 'Allergy relief medications'),
(4, 'Antacid', 'Acidity and heartburn treatment'),
(5, 'Supplement', 'Vitamins and dietary minerals')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    description = EXCLUDED.description;

-- 3. Suppliers
INSERT INTO suppliers (id, name, contact_number, email, address) VALUES
(1, 'MedPlus Distributors', '9876543210', 'medplus@example.com', 'Hyderabad, Telangana'),
(2, 'Apollo Pharma Suppliers', '9876501234', 'apollo@example.com', 'Secunderabad, Telangana'),
(3, 'Sri Sai Medical Distributors', '9988776655', 'srisai@example.com', 'Kukatpally, Hyderabad'),
(4, 'HealthCare Pharma Ltd', '9123456789', 'healthcare@example.com', 'Madhapur, Hyderabad'),
(5, 'LifeLine Medical Suppliers', '9012345678', 'lifeline@example.com', 'Dilsukhnagar, Hyderabad')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    contact_number = EXCLUDED.contact_number,
    email = EXCLUDED.email,
    address = EXCLUDED.address;

-- 4. Users (Passwords hashed using BCrypt)
-- Passwords for development/testing:
-- admin / admin123
-- pharmacist / pharmacist123
-- staff / staff123
-- supplier / supplier123
INSERT INTO users (id, name, username, email, password, role_id, supplier_id) VALUES
(1, 'Varun Admin', 'admin', 'admin@medistock.com', '$2a$10$xEd8fpDvwQqZXWpQIZZlXOUBfSKiZdTWMj.rzc1xctr4sIDYMrhcK', 1, NULL),
(2, 'Rahul Pharmacist', 'pharmacist', 'pharmacist@medistock.com', '$2a$10$tBif2lk.CLG5J4bnIE6YMutapbZoNVMRQApeMjiqGxcCoHgoWRWgm', 2, NULL),
(3, 'Anil Staff', 'staff', 'staff@medistock.com', '$2a$10$vLIgKYBK2jQ/WK2C3D43OebVi.uI5M92fx9bWYyLMuXJ0yzfYb.vy', 3, NULL),
(4, 'MedPlus Supplier Rep', 'supplier', 'supplier@medistock.com', '$2a$10$zH4LdxLtytyVPqFWxCgr8.IoT3I3qFKYTxR8rtoUVWsq.igrWhMqa', 4, 1)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    password = EXCLUDED.password,
    role_id = EXCLUDED.role_id,
    supplier_id = EXCLUDED.supplier_id;

-- 5. Medicines
INSERT INTO medicines (id, name, batch_number, category_id, supplier_id, quantity, manufacturing_date, expiry_date, price) VALUES
(1, 'Paracetamol 500mg', 'PCM2026A01', 1, 1, 150, '2026-01-10', '2028-01-10', 25.00),
(2, 'Amoxicillin 500mg', 'AMX2026B02', 2, 2, 80, '2026-02-15', '2028-02-15', 120.00),
(3, 'Cetirizine 10mg', 'CTZ2026C03', 3, 3, 45, '2026-03-05', '2028-03-05', 35.00),
(4, 'Omeprazole 20mg', 'OMP2026D04', 4, 4, 12, '2026-01-20', '2027-01-20', 60.00),
(5, 'Vitamin C 500mg', 'VTC2026E05', 5, 5, 200, '2026-04-10', '2028-04-10', 80.00),
(6, 'Azithromycin 500mg', 'AZT2026F06', 2, 2, 8, '2026-02-25', '2027-02-25', 150.00)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    batch_number = EXCLUDED.batch_number,
    category_id = EXCLUDED.category_id,
    supplier_id = EXCLUDED.supplier_id,
    quantity = EXCLUDED.quantity,
    manufacturing_date = EXCLUDED.manufacturing_date,
    expiry_date = EXCLUDED.expiry_date,
    price = EXCLUDED.price;

-- 6. Inventory Records
INSERT INTO inventory (id, medicine_id, quantity, minimum_stock, stock_status) VALUES
(1, 1, 150, 20, 'AVAILABLE'),
(2, 2, 80, 25, 'AVAILABLE'),
(3, 3, 45, 15, 'AVAILABLE'),
(4, 4, 12, 15, 'LOW_STOCK'),
(5, 5, 200, 30, 'AVAILABLE'),
(6, 6, 8, 10, 'LOW_STOCK')
ON CONFLICT (id) DO UPDATE SET
    medicine_id = EXCLUDED.medicine_id,
    quantity = EXCLUDED.quantity,
    minimum_stock = EXCLUDED.minimum_stock,
    stock_status = EXCLUDED.stock_status;

-- 7. Purchase Orders
INSERT INTO purchase_orders (id, supplier_id, order_date, total_amount, status) VALUES
(1, 1, '2026-04-01', 3750.00, 'DELIVERED'),
(2, 2, '2026-04-05', 9600.00, 'APPROVED'),
(3, 4, '2026-04-08', 720.00, 'PENDING')
ON CONFLICT (id) DO UPDATE SET
    supplier_id = EXCLUDED.supplier_id,
    order_date = EXCLUDED.order_date,
    total_amount = EXCLUDED.total_amount,
    status = EXCLUDED.status;

-- 8. Purchase Order Items
INSERT INTO purchase_order_items (id, purchase_order_id, medicine_id, quantity, unit_price) VALUES
(1, 1, 1, 150, 25.00),
(2, 2, 2, 80, 120.00),
(3, 3, 4, 12, 60.00)
ON CONFLICT (id) DO UPDATE SET
    purchase_order_id = EXCLUDED.purchase_order_id,
    medicine_id = EXCLUDED.medicine_id,
    quantity = EXCLUDED.quantity,
    unit_price = EXCLUDED.unit_price;

-- 9. Expiry Tracking
INSERT INTO expiry_tracking (id, medicine_id, expiry_date, status, notification_sent) VALUES
(1, 1, '2028-01-10', 'VALID', FALSE),
(2, 2, '2028-02-15', 'VALID', FALSE),
(3, 3, '2028-03-05', 'VALID', FALSE),
(4, 4, '2027-01-20', 'VALID', FALSE),
(5, 5, '2028-04-10', 'VALID', FALSE),
(6, 6, '2027-02-25', 'VALID', FALSE)
ON CONFLICT (id) DO UPDATE SET
    medicine_id = EXCLUDED.medicine_id,
    expiry_date = EXCLUDED.expiry_date,
    status = EXCLUDED.status,
    notification_sent = EXCLUDED.notification_sent;

-- 10. Sample System Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read) VALUES
(1, 1, 'System Initialized', 'MediStock PostgreSQL platform successfully initialized.', 'SYSTEM', TRUE),
(2, 1, 'Low Stock Alert', 'Medicine Omeprazole 20mg has fallen below minimum stock threshold (12/15).', 'STOCK_ALERT', FALSE),
(3, 2, 'Low Stock Alert', 'Medicine Azithromycin 500mg has fallen below minimum stock threshold (8/10).', 'STOCK_ALERT', FALSE)
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    title = EXCLUDED.title,
    message = EXCLUDED.message,
    type = EXCLUDED.type,
    is_read = EXCLUDED.is_read;

-- Reset all PostgreSQL sequences to match highest inserted IDs
SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE(MAX(id), 1)) FROM roles;
SELECT setval(pg_get_serial_sequence('categories', 'id'), COALESCE(MAX(id), 1)) FROM categories;
SELECT setval(pg_get_serial_sequence('suppliers', 'id'), COALESCE(MAX(id), 1)) FROM suppliers;
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;
SELECT setval(pg_get_serial_sequence('medicines', 'id'), COALESCE(MAX(id), 1)) FROM medicines;
SELECT setval(pg_get_serial_sequence('inventory', 'id'), COALESCE(MAX(id), 1)) FROM inventory;
SELECT setval(pg_get_serial_sequence('purchase_orders', 'id'), COALESCE(MAX(id), 1)) FROM purchase_orders;
SELECT setval(pg_get_serial_sequence('purchase_order_items', 'id'), COALESCE(MAX(id), 1)) FROM purchase_order_items;
SELECT setval(pg_get_serial_sequence('expiry_tracking', 'id'), COALESCE(MAX(id), 1)) FROM expiry_tracking;
SELECT setval(pg_get_serial_sequence('notifications', 'id'), COALESCE(MAX(id), 1)) FROM notifications;
