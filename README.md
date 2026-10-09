# 🏥 MediStock: Medical Inventory Management Platform

> A full-stack medical inventory and supply chain management platform designed for pharmacies, clinics, and healthcare institutions. Built with **Spring Boot 3 (Java 17)**, **React.js (Vite + Tailwind CSS)**, and **PostgreSQL / MySQL**.

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Architecture & Modules](#-architecture--modules)
- [Repository Tree Structure](#-repository-tree-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Docker Compose Deployment](#docker-compose-deployment)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Milestones & Implementation Roadmap](#-milestones--implementation-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**MediStock** enables healthcare organizations to manage medicine inventory, track real-time stock levels, monitor batch expiry dates proactively, handle supplier procurement workflows, and generate comprehensive inventory analytics and reports.

### Key Capabilities:
- **Role-Based Access Control**: Granular access management for `ADMIN`, `PHARMACIST`, and `STAFF`.
- **Medicine & Batch Management**: Granular tracking by SKU, generic formula, dosage, batch numbers, and reorder levels.
- **Automated Expiry Tracking**: Daily scheduled scanning for near-expiry (30-day window) and expired stock.
- **Stock Movement Audits**: Complete transactional logs for stock purchases, dispensing, disposal, and returns.
- **Procurement & Purchase Orders**: End-to-end purchase order lifecycle management (`PENDING` -> `APPROVED` -> `SHIPPED` -> `RECEIVED`).
- **Interactive Dashboards**: Live analytics, financial valuation, and stock alerts.

---

## 🏛 Architecture & Modules

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                      React.js + Tailwind CSS + Vite SPA                           |
|       (Admin Dashboard | Pharmacist View | Inventory Catalog | Expiry Tracker)    |
+-----------------------------------------------------------------------------------+
                                          |
                                    REST APIs / JWT
                                          v
+-----------------------------------------------------------------------------------+
|                        SPRING BOOT BACKEND SERVICES                               |
|  +---------------------+  +--------------------+  +----------------------------+  |
|  | Auth & User Service |  | Inventory Service  |  | Stock Monitoring Service   |  |
|  +---------------------+  +--------------------+  +----------------------------+  |
|  +---------------------+  +--------------------+  +----------------------------+  |
|  | Expiry Tracking Svc |  | Supplier & PO Svc  |  | Analytics & Reporting Svc  |  |
|  +---------------------+  +--------------------+  +----------------------------+  |
+-----------------------------------------------------------------------------------+
                                          |
                                 Spring Data JPA / SQL
                                          v
+-----------------------------------------------------------------------------------+
|                             DATABASE & INFRASTRUCTURE                             |
|           PostgreSQL 15 (Production) / MySQL (Local Dev) | Docker Containers       |
+-----------------------------------------------------------------------------------+
```

---

## 🌳 Repository Tree Structure

```text
medistock/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                     # GitHub Actions CI/CD Pipeline
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/medistock/
│   │   │   │   ├── config/
│   │   │   │   │   ├── CorsConfig.java           # Cross-Origin Resource Sharing
│   │   │   │   │   ├── JwtAuthenticationFilter.java # JWT Request Filter
│   │   │   │   │   ├── JwtTokenProvider.java     # Token Generation & Verification
│   │   │   │   │   ├── OpenApiConfig.java        # Swagger / OpenAPI Spec
│   │   │   │   │   ├── SecurityConfig.java       # Spring Security 6 Configuration
│   │   │   │   │   ├── UserDetailsImpl.java      # Custom UserDetails
│   │   │   │   │   └── UserDetailsServiceImpl.java # UserDetailsService Implementation
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AnalyticsController.java  # Dashboard Analytics Endpoints
│   │   │   │   │   ├── AuthController.java       # User Login & Registration Endpoints
│   │   │   │   │   ├── ExpiryTrackingController.java # Batch Expiry Monitoring
│   │   │   │   │   ├── MedicineController.java   # Inventory CRUD Endpoints
│   │   │   │   │   ├── NotificationController.java # In-App Notification Center
│   │   │   │   │   ├── PurchaseOrderController.java# Procurement Lifecycle Endpoints
│   │   │   │   │   ├── StockMonitoringController.java# Low Stock & Audit Logs
│   │   │   │   │   └── SupplierController.java   # Vendor Relationship Endpoints
│   │   │   │   ├── dto/
│   │   │   │   │   ├── request/                  # Auth, Medicine, Supplier, PO Request DTOs
│   │   │   │   │   └── response/                 # Standard ApiResponse, Jwt, Analytics DTOs
│   │   │   │   ├── entity/
│   │   │   │   │   ├── ERole.java                # Enum for User Roles
│   │   │   │   │   ├── Role.java                 # Role Entity
│   │   │   │   │   ├── User.java                 # User Entity
│   │   │   │   │   ├── Category.java             # Medicine Category Entity
│   │   │   │   │   ├── Supplier.java             # Vendor Supplier Entity
│   │   │   │   │   ├── Medicine.java             # Medicine Product Entity
│   │   │   │   │   ├── MedicineBatch.java        # Batch & Expiry Entity
│   │   │   │   │   ├── StockLog.java             # Movement Audit Entity
│   │   │   │   │   ├── PurchaseOrder.java        # Procurement Order Entity
│   │   │   │   │   ├── PurchaseOrderItem.java    # Line Items Entity
│   │   │   │   │   └── Notification.java         # Alert Notification Entity
│   │   │   │   ├── exception/
│   │   │   │   │   ├── BadRequestException.java
│   │   │   │   │   ├── GlobalExceptionHandler.java # Uniform REST Exception Handling
│   │   │   │   │   └── ResourceNotFoundException.java
│   │   │   │   ├── repository/                   # Spring Data JPA Repositories
│   │   │   │   ├── service/                      # Business Logic Service Layer
│   │   │   │   └── MediStockApplication.java     # Spring Boot Main Entry Point
│   │   │   └── resources/
│   │   │       ├── db/migration/
│   │   │       │   └── V1__init_schema.sql       # PostgreSQL DDL Table Definitions
│   │   │       ├── application.yml               # Core Application Configuration
│   │   │       ├── application-dev.yml           # Dev Environment Profile
│   │   │       └── application-prod.yml          # Production Environment Profile
│   │   └── test/
│   │       └── java/com/medistock/
│   │           └── MediStockApplicationTests.java# Unit & Integration Tests
│   ├── Dockerfile                                # Backend Container Image
│   └── pom.xml                                   # Maven Dependencies Configuration
├── frontend/
│   ├── src/
│   │   ├── assets/                               # Static Images and Icons
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Navbar.jsx                    # Header Bar with User & Alert Badge
│   │   │       ├── Sidebar.jsx                   # Role-Based Navigation Sidebar
│   │   │       └── StatCard.jsx                  # Dashboard Metric Card
│   │   ├── context/
│   │   │   └── AuthContext.jsx                   # Auth State & Token Context
│   │   ├── pages/
│   │   │   ├── auth/Login.jsx                    # Sign-In Page
│   │   │   ├── dashboard/Dashboard.jsx           # Real-Time Inventory Dashboard
│   │   │   ├── expiry/ExpiryTracker.jsx          # Shelf-Life & Near-Expiry Tracker
│   │   │   ├── inventory/MedicineList.jsx        # Searchable Inventory Catalog
│   │   │   ├── orders/PurchaseOrders.jsx         # Procurement Workflow
│   │   │   └── suppliers/SupplierList.jsx        # Vendor Contact Directory
│   │   ├── services/
│   │   │   ├── api.js                            # Axios Client with Auth Interceptors
│   │   │   ├── authService.js                    # Auth API Wrapper
│   │   │   └── medicineService.js                # Inventory & Analytics API Wrappers
│   │   ├── App.jsx                               # Application Route Definitions
│   │   ├── index.css                             # Tailwind CSS Directives & Layout
│   │   └── main.jsx                              # React Root Bootstrap
│   ├── .env.example                              # Frontend Environment Variables Template
│   ├── Dockerfile                                # Frontend Container Image (Nginx)
│   ├── index.html                                # HTML5 Template
│   ├── nginx.conf                                # Nginx Reverse Proxy Config
│   ├── package.json                              # Node Dependencies & Scripts
│   ├── postcss.config.js                         # PostCSS Setup
│   ├── tailwind.config.js                        # Tailwind Palette Configuration
│   └── vite.config.js                            # Vite Bundler Config
├── .gitignore                                    # Git Ignore Rules
├── docker-compose.yml                            # Multi-Container Compose Configuration
└── README.md                                     # Project Documentation & Guides
```

---

## 🛠 Tech Stack

| Domain | Technology |
|---|---|
| **Backend Framework** | Java 17, Spring Boot 3.2.3 |
| **Security & Auth** | Spring Security, JWT (io.jsonwebtoken), Role-Based Authorization |
| **Data Layer** | Spring Data JPA, Hibernate, PostgreSQL 15 / MySQL |
| **API Documentation** | Springdoc OpenAPI 3 (Swagger UI) |
| **Reporting & Export** | Apache POI (Excel), iText 7 (PDF) |
| **Frontend Framework** | React 18, Vite |
| **Styling & UI** | Tailwind CSS, Lucide React Icons, Framer Motion |
| **Routing & HTTP** | React Router v6, Axios |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher & npm
- **Database**: PostgreSQL 14+ or MySQL 8+ (or Docker)
- **Maven**: 3.8+ (optional, wrapper included)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your database credentials in `src/main/resources/application-dev.yml`.
3. Build and run the Spring Boot application:
   ```bash
   mvn clean spring-boot:run
   ```
4. Access the API documentation at:
   - Swagger UI: `http://localhost:8080/api/v1/swagger-ui.html`
   - OpenAPI Docs: `http://localhost:8080/api/v1/v3/api-docs`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:3000`.

### Docker Compose Deployment
Launch the entire system (PostgreSQL + Spring Boot backend + React frontend) with a single command:
```bash
docker-compose up --build
```

---

## 🔌 API Endpoints Reference

| HTTP Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/v1/auth/signin` | User Login & JWT Token issuance | Public |
| `POST` | `/api/v1/auth/signup` | Register a new user | Public |
| `GET` | `/api/v1/medicines` | List all medicines / Search & Filter | Authenticated |
| `POST` | `/api/v1/medicines` | Create a new medicine | Admin, Pharmacist |
| `PUT` | `/api/v1/medicines/{id}` | Update medicine details | Admin, Pharmacist |
| `DELETE` | `/api/v1/medicines/{id}` | Remove medicine | Admin |
| `GET` | `/api/v1/stock/low` | Retrieve low-stock medicines | Authenticated |
| `GET` | `/api/v1/stock/out-of-stock`| Retrieve depleted stock items | Authenticated |
| `GET` | `/api/v1/stock/logs` | View recent stock movement logs | Authenticated |
| `GET` | `/api/v1/expiry/near-expiry`| Batches expiring within 30 days | Authenticated |
| `GET` | `/api/v1/expiry/expired` | Quarantine expired batches | Authenticated |
| `GET` | `/api/v1/suppliers` | List all verified suppliers | Authenticated |
| `POST` | `/api/v1/suppliers` | Add a new medicine supplier | Admin, Pharmacist |
| `GET` | `/api/v1/orders` | View purchase orders | Admin, Pharmacist |
| `POST` | `/api/v1/orders` | Generate a new purchase order | Admin, Pharmacist |
| `GET` | `/api/v1/analytics/dashboard`| Retrieve KPI metrics & summaries | Authenticated |

---

## 📅 Milestones & Implementation Roadmap

- [x] **Milestone 1 (Week 1 & 2)**: Database Schema Design, Spring Boot Backend Setup, JWT Security, React UI Scaffolding.
- [ ] **Milestone 2 (Week 3 & 4)**: Medicine Inventory APIs, Supplier Management, Dynamic Stock Movement tracking.
- [ ] **Milestone 3 (Week 5 & 6)**: Automated Expiry Tracking, Real-time Low-stock Notifications, Reporting Exports.
- [ ] **Milestone 4 (Week 7 & 8)**: Analytics Visualizations, End-to-End Workflow Validation, Cloud Deployment.

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License.