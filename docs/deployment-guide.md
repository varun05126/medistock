# MediStock Deployment Guide

This guide details instructions for deploying the **MediStock** React frontend to **Vercel** and the **Spring Boot backend & MySQL database** to a compatible Java hosting platform (e.g., Render, Railway, AWS, or Heroku).

---

## 1. Architecture Deployment Overview

```mermaid
graph LR
    subgraph Vercel
        FE[React 18 Single-Page App\nRoot: frontend/]
    end

    subgraph Java Hosting (Render / Railway / VPS)
        BE[Spring Boot 3 Web Application\nRoot: backend/]
    end

    subgraph Managed Cloud DB
        DB[(MySQL 8.0 Cloud Instance)]
    end

    FE -->|HTTPS Calls via VITE_API_BASE_URL| BE
    BE -->|JDBC / SSL| DB
```

---

## 2. Frontend Deployment on Vercel

### Step 1: Import Repository to Vercel
1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your `varun05126/medistock` GitHub repository.

### Step 2: Configure Project Settings
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Configure Environment Variables
In the Vercel project dashboard (**Settings > Environment Variables**), set:
| Key | Example Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `https://medistock-api.onrender.com/api` | The HTTPS URL of your deployed Spring Boot API |

### Step 4: Single-Page Application (SPA) Routing
The file `frontend/vercel.json` is pre-configured with the necessary rewrite rule:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures React Router routes (`/login`, `/inventory`, `/supplier/portal`, etc.) resolve correctly on direct navigation and browser refresh.

---

## 3. Backend Deployment (Render / Railway / Java Host)

### Step 1: Create a Managed MySQL Database
1. Provision a MySQL 8.0 database (via Railway MySQL, Aiven, AWS RDS, or PlanetScale).
2. Note the connection details: Host, Port (3306), Database name (`medistock`), Username, and Password.
3. Apply the initial schema and seed data:
```bash
mysql -h <CLOUD_HOST> -P <CLOUD_PORT> -u <CLOUD_USER> -p <CLOUD_DB_NAME> < database/schema.sql
mysql -h <CLOUD_HOST> -P <CLOUD_PORT> -u <CLOUD_USER> -p <CLOUD_DB_NAME> < database/seed.sql
```

### Step 2: Create a Web Service for Spring Boot
1. Create a new Web Service pointing to the same GitHub repository.
2. Configure runtime properties:
   - **Environment**: Java (JDK 17 or 21)
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/medistock-backend-1.0.0-SNAPSHOT.jar`

### Step 3: Configure Backend Environment Variables
Set the following environment variables in your hosting provider's dashboard:
| Variable Name | Production Description | Example Value |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Activates production profile | `prod` |
| `SPRING_DATASOURCE_URL` | Cloud MySQL JDBC URL | `jdbc:mysql://cloud-host:3306/medistock?sslMode=REQUIRED` |
| `SPRING_DATASOURCE_USERNAME` | Cloud DB user | `db_user` |
| `SPRING_DATASOURCE_PASSWORD` | Cloud DB password | `super_secure_db_pass` |
| `JWT_SECRET` | Minimum 256-bit signing key | `productionSecretKeyMin256BitsHMACSHA256MediStock2026!` |
| `CORS_ALLOWED_ORIGINS` | Vercel production domain(s) | `https://medistock-app.vercel.app` |
| `PORT` | Web port bound by host | `8080` (or host assigned `$PORT`) |

---

## 4. Post-Deployment Verification

1. **Verify Backend Health**:
   ```bash
   curl -i https://your-backend-domain.com/api/health
   ```
   Confirm HTTP `200 OK` with `"database": "CONNECTED"` and `"status": "UP"`.
2. **Verify Frontend Authentication**:
   Navigate to your Vercel deployment URL and sign in with the Admin or Supplier credentials.
3. **Verify Protected Route Navigation**:
   Verify that clicking across sections and refreshing the page loads without 404 errors.
