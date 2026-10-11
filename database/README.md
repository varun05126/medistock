# MediStock Database Schema & Migration Guide

This directory contains the production-ready MySQL DDL definitions and initial seed data for the **MediStock** medical inventory platform.

## File Manifest

| File | Purpose |
|------|---------|
| `schema.sql` | Complete schema DDL (12 relational tables, foreign keys, indexes) |
| `seed.sql` | Initial dataset including roles, initial users (BCrypt hashed), categories, suppliers, medicines, inventory, and sample orders |

## Table Summary

1. `roles`: Role definitions (`ADMIN`, `PHARMACIST`, `STAFF`, `SUPPLIER`).
2. `suppliers`: Verified vendor registry and contact info.
3. `users`: System user credentials, email, BCrypt password, assigned `role_id`, and `supplier_id` (foreign key to `suppliers` for supplier accounts).
4. `categories`: Pharmaceutical categories (Antibiotics, Analgesics, Cardiovascular, etc.).
5. `medicines`: Medicine catalog, batch number, pricing, quantity, and manufacturing/expiry dates.
6. `inventory`: Current stock tracking per medicine.
7. `stock_logs`: Audit trail for stock changes (ADD, DISPENSE, DISPOSE, ADJUST).
8. `purchase_orders`: Procurement orders with total amounts, status, and supplier associations.
9. `purchase_order_items`: Line items for each purchase order.
10. `expiry_tracking`: Monitored batches with near-expiry and expired statuses.
11. `notifications`: Alert notifications for reorders and expirations.
12. `reports`: Generated report history.

## Preserving Production Data

Hibernate is configured with `ddl-auto: none` across all Spring Boot profiles (`dev` and `prod`). Hibernate will never drop, recreate, or modify schema tables at startup.

## How to Initialize Local MySQL

```bash
# Connect to your local MySQL instance
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS medistock;"

# Apply Schema
mysql -u root -p medistock < database/schema.sql

# Seed Initial Data
mysql -u root -p medistock < database/seed.sql
```
