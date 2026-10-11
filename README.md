# 🏥 MediStock: Medical Inventory Management Platform

> A full-stack medical inventory and supply chain management platform designed for pharmacies, clinics, and healthcare institutions. Built with **Spring Boot 3 (Java 21)**, **React.js (Vite + Tailwind CSS)**, and **Neon PostgreSQL**, deployable on **Render**.

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Architecture & Four User Roles](#-architecture--four-user-roles)
- [Repository Structure](#-repository-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Documentation Index](#-documentation-index)
- [Testing & Quality Verification](#-testing--quality-verification)
- [Deployment Configuration](#-deployment-configuration)

---

## 🎯 Overview

**MediStock** enables healthcare organizations to manage medicine inventory, track real-time stock levels, monitor batch expiry dates proactively, handle supplier procurement workflows, and generate comprehensive inventory analytics.

### Key Capabilities:
- **Role-Based Access Control**: Four granular roles (`ADMIN`, `PHARMACIST`, `STAFF`, `SUPPLIER`) enforced on Spring Security.
- **Strict Supplier Isolation**: Supplier partner accounts are mapped directly to their verified supplier entity and restricted from accessing internal operations or competing supplier data.
- **Real-Time Inventory & Batch Management**: Granular tracking by SKU, generic formula, batch numbers, and reorder levels.
- **Automated Expiry Tracking**: Active monitoring for near-expiry (30-day window) and expired batches.
- **Stock Movement Audits**: Complete transactional logs for stock purchases, dispensing, disposal, and adjustments.
- **Procurement & Purchase Orders**: End-to-end purchase order lifecycle management (`PENDING` -> `APPROVED` -> `SHIPPED` -> `RECEIVED`).
- **Interactive Dashboards**: Live analytics, financial valuation, and stock alerts powered by MySQL.

---

## 🏛 Architecture & Four User Roles

MediStock operates as a unified full-stack monorepo with distinct operational boundaries:

1. **Admin**: Manages system users and roles, accesses user administration, monitors system inventory, and configures operational parameters.
2. **Pharmacist**: Manages medicine catalog, views inventory and expiry alerts, registers suppliers, and reviews purchase orders.
3. **Staff**: Monitors inventory availability, reviews low stock alerts, and logs medicine dispensations.
4. **Supplier**: Accesses an isolated Supplier Portal (`/supplier/portal`), views company profile details, edits contact info, and tracks purchase orders assigned to their supplier account.

---

## 🌳 Repository Structure

```text
medistock/
├── backend/                              # Java Spring Boot 3 API
│   ├── pom.xml                           # Maven dependencies & build config
│   ├── src/main/java/com/medistock/
│   │   ├── config/                       # Security, JWT, CORS, OpenAPI configs
│   │   ├── controller/                   # REST API controllers
│   │   ├── dto/                          # Request & response data transfer objects
│   │   ├── entity/                       # JPA entities mapped to MySQL tables
│   │   ├── exception/                    # Global REST exception handling
│   │   ├── repository/                   # Spring Data JPA repositories
│   │   ├── security/                     # User details & authentication logic
│   │   └── service/                      # Business logic service layer
│   └── src/main/resources/
│       ├── application.yml               # Base configuration
│       ├── application-dev.yml           # Dev environment profile (MySQL)
│       └── application-prod.yml          # Production profile (Environment variables)
├── frontend/                             # React 18 + Vite SPA
│   ├── package.json                      # Node packages and scripts
│   ├── vite.config.js                    # Vite bundler & vitest configuration
│   ├── vercel.json                       # Vercel SPA routing rewrites
│   └── src/
│       ├── components/common/            # Navbar, Sidebar, ProtectedRoute, StatCard
│       ├── context/                      # AuthContext & role helpers
│       ├── pages/
│       │   ├── admin/                    # UserManagement.jsx
│       │   ├── auth/                     # Login.jsx, Register.jsx
│       │   ├── common/                   # Unauthorized.jsx (403), NotFound.jsx (404)
│       │   ├── dashboard/                # Dashboard.jsx
│       │   ├── expiry/                   # ExpiryTracker.jsx
│       │   ├── inventory/                # MedicineList.jsx
│       │   ├── orders/                   # PurchaseOrders.jsx
│       │   ├── supplier/                 # SupplierPortal.jsx
│       │   └── suppliers/                # SupplierList.jsx
│       └── services/                     # Central Axios client & service modules
├── database/                             # Database Schemas & Migrations
│   ├── schema.sql                        # Full MySQL 8.0 DDL (12 tables)
│   ├── seed.sql                          # Seed data with BCrypt credentials
│   └── README.md                         # Database guide & schema preservation
├── docs/                                 # Technical Documentation
│   ├── architecture.md                   # System architecture & role model
│   ├── api-documentation.md              # REST API endpoint reference
│   ├── setup-guide.md                    # Step-by-step local setup guide
│   └── deployment-guide.md               # Vercel & Java hosting deployment guide
└── README.md                             # Repository overview
```

---

## 🛠 Tech Stack

| Domain | Technology |
|---|---|
| **Backend Framework** | Java 21, Spring Boot 3.2.3, Spring Web, Spring Security, Spring Data JPA |
| **Security & Auth** | Stateless JWT (HMAC-SHA256), BCrypt (10 rounds) |
| **Database** | MySQL 8.0, HikariCP Connection Pool, Hibernate 6 |
| **Frontend Framework** | JavaScript, React 18, Vite |
| **Styling & Icons** | Tailwind CSS, Lucide Icons, Framer Motion |
| **Routing & HTTP** | React Router v6, Axios |
| **Testing** | JUnit 5, Mockito, Vitest, React Testing Library |

---

## 🚀 Getting Started

### Prerequisites
- **Java**: OpenJDK 17 or 21+
- **Maven**: 3.8+
- **Node.js**: v18+ & npm
- **MySQL**: 8.0+ running on port 3306

### Database Setup
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS medistock;"
mysql -u root -p medistock < database/schema.sql
mysql -u root -p medistock < database/seed.sql
```

### Backend Setup
```bash
cd backend
mvn test
mvn spring-boot:run
```
Health endpoint: `http://localhost:8080/api/health`

### Frontend Setup
```bash
cd frontend
npm install
npm test
npm run dev
```
Open `http://localhost:5173` in your browser.

### Test Credentials
- **Admin**: `admin` / `admin123`
- **Pharmacist**: `pharmacist` / `pharmacist123`
- **Staff**: `staff` / `staff123`
- **Supplier**: `supplier` / `supplier123`

---

## 📖 Documentation Index

- [Architecture & Roles](file:///Users/malthumkarvarun/infosys/docs/architecture.md)
- [REST API Documentation](file:///Users/malthumkarvarun/infosys/docs/api-documentation.md)
- [Local Setup Guide](file:///Users/malthumkarvarun/infosys/docs/setup-guide.md)
- [Deployment Guide (Render & Neon PostgreSQL)](file:///Users/malthumkarvarun/infosys/docs/deployment-guide.md)
- [Database Guide](file:///Users/malthumkarvarun/infosys/database/README.md)