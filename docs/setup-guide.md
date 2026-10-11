# MediStock Local Development Setup Guide

This guide walks you through configuring and running the complete **MediStock** full-stack medical inventory management platform on your local machine.

---

## 1. Prerequisites

Ensure you have the following installed on your workstation:
- **Java**: OpenJDK 17, 21, or newer (`java -version`)
- **Maven**: Version 3.8+ (`mvn -version`)
- **Node.js**: Version 18.0+ (`node -v`)
- **npm**: Version 9.0+ (`npm -v`)
- **MySQL Server**: Version 8.0+ running on port 3306

---

## 2. Database Setup

1. Start your local MySQL service.
2. Create the `medistock` database and apply the schema and seed scripts:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS medistock;"
mysql -u root -p medistock < database/schema.sql
mysql -u root -p medistock < database/seed.sql
```

The seed script initializes sample medicines, suppliers, inventory rows, and the four default role accounts.

---

## 3. Backend Setup (Spring Boot)

1. Open a terminal and navigate to the `backend/` directory:
```bash
cd backend
```

2. Configure environment variables (or rely on `application-dev.yml` defaults for local MySQL):
```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/medistock?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD=""
export JWT_SECRET="medistocksupersecretjwtkeythatmustbeatleast256bitslongforhmacsha256signing"
export CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
export PORT=8080
```

3. Run the automated test suite:
```bash
mvn test
```

4. Launch the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend starts at `http://localhost:8080/api`. Verify health:
```bash
curl http://localhost:8080/api/health
```

---

## 4. Frontend Setup (React + Vite)

1. Open a second terminal and navigate to `frontend/`:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend test suite:
```bash
npm test
```

4. Verify production build:
```bash
npm run build
```

5. Start the local Vite development server:
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 5. Pre-configured Test Accounts

| Role | Username | Password | Notes |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | Full administrative control, user provisioning |
| **Pharmacist** | `pharmacist` | `pharmacist123` | Inventory catalog, expiry tracker, supplier views |
| **Staff** | `staff` | `staff123` | Operational view of stock and analytics |
| **Supplier** | `supplier` | `supplier123` | Isolated supplier portal (Partner #1: MedPlus) |
