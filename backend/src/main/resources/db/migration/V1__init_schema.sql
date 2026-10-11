-- MediStock: Medical Inventory Management Platform
-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Roles Mapping Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 4. Medicine Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    contact_number VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    rating DECIMAL(2,1) DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Medicines Table
CREATE TABLE IF NOT EXISTS medicines (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    generic_name VARCHAR(150),
    sku VARCHAR(50) UNIQUE,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    supplier_id BIGINT REFERENCES suppliers(id) ON DELETE SET NULL,
    description TEXT,
    dosage_form VARCHAR(50),
    strength VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    reorder_level INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Medicine Batches Table
CREATE TABLE IF NOT EXISTS medicine_batches (
    id BIGSERIAL PRIMARY KEY,
    medicine_id BIGINT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    batch_number VARCHAR(50) NOT NULL UNIQUE,
    quantity INT NOT NULL DEFAULT 0,
    manufacturing_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    purchase_price DECIMAL(10, 2),
    selling_price DECIMAL(10, 2),
    status VARCHAR(30) DEFAULT 'ACTIVE', -- ACTIVE, NEAR_EXPIRY, EXPIRED, DEPLETED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Stock Movement Logs Table
CREATE TABLE IF NOT EXISTS stock_logs (
    id BIGSERIAL PRIMARY KEY,
    medicine_id BIGINT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    batch_id BIGINT REFERENCES medicine_batches(id) ON DELETE SET NULL,
    quantity_changed INT NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- PURCHASE, SALE, DISPOSAL, ADJUSTMENT, RETURN
    reason VARCHAR(255),
    performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id BIGINT NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.0,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, SHIPPED, RECEIVED, CANCELLED
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date DATE,
    received_date TIMESTAMP
);

-- 10. Purchase Order Items Table
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    medicine_id BIGINT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL
);

-- 11. Expiry Tracking & Alerts Table
CREATE TABLE IF NOT EXISTS expiry_alerts (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL REFERENCES medicine_batches(id) ON DELETE CASCADE,
    alert_date DATE NOT NULL,
    days_to_expiry INT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. System Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- LOW_STOCK, EXPIRY, ORDER_UPDATE, SYSTEM
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default Role Seeds
INSERT INTO roles (name, description) VALUES
    ('ROLE_ADMIN', 'System Administrator with full access'),
    ('ROLE_PHARMACIST', 'Pharmacist with inventory management and dispensing access'),
    ('ROLE_STAFF', 'Staff with viewing and basic operations access')
ON CONFLICT (name) DO NOTHING;
