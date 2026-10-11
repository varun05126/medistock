# MediStock REST API Documentation

All API endpoints are prefixed with `/api`. Protected routes require an `Authorization` header containing a valid Bearer JWT:
```http
Authorization: Bearer <token>
```

---

## 1. System Health

### `GET /api/health`
Confirms application and MySQL database connectivity.
- **Authorization**: Public
- **Response `200 OK`**:
```json
{
  "service": "medistock-backend",
  "status": "UP",
  "database": "CONNECTED",
  "timestamp": "2026-10-11T11:00:20.191460Z"
}
```

---

## 2. Authentication Endpoints

### `POST /api/auth/login`
Authenticates a user and issues a JWT token.
- **Authorization**: Public
- **Request Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "id": 1,
    "name": "Varun Admin",
    "username": "admin",
    "email": "admin@medistock.com",
    "role": "ADMIN",
    "supplierId": null,
    "roles": ["ROLE_ADMIN"]
  }
}
```

### `POST /api/auth/register`
Public user registration. Note: `ADMIN` role is strictly disallowed through public registration.
- **Authorization**: Public
- **Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@medistock.com",
  "password": "securepassword",
  "role": "STAFF",
  "supplierId": null
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 5,
    "username": "johndoe",
    "email": "john@medistock.com",
    "role": "STAFF",
    "status": "ACTIVE"
  }
}
```

### `GET /api/auth/me`
Retrieves the authenticated user's current session profile.
- **Authorization**: Authenticated (Any valid role)
- **Response `200 OK`**: User profile object

---

## 3. User Management Endpoints (Admin Only)

### `GET /api/users`
Lists all registered users and their roles.
- **Authorization**: `ADMIN` only
- **Response `200 OK`**: Array of user profile DTOs. Returns `403 Forbidden` if called by Pharmacist, Staff, or Supplier.

### `POST /api/users`
Allows administrators to create application users with any role (including Pharmacist, Staff, Supplier, or Admin).
- **Authorization**: `ADMIN` only
- **Request Body**:
```json
{
  "username": "new_pharmacist",
  "email": "pharm@medistock.com",
  "password": "tempPassword123",
  "role": "PHARMACIST"
}
```

---

## 4. Supplier Endpoints

### `GET /api/suppliers/me`
Retrieves the authenticated supplier's company profile.
- **Authorization**: `SUPPLIER` only
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "MedPlus Distributors",
    "contactPerson": "Alice Johnson",
    "phone": "+1-555-0101",
    "email": "alice@medplus.com",
    "address": "123 Pharma Way, Medical District"
  }
}
```

### `PUT /api/suppliers/me`
Allows the authenticated supplier to update their contact details.
- **Authorization**: `SUPPLIER` only
- **Request Body**:
```json
{
  "name": "MedPlus Distributors",
  "contactPerson": "Alice Johnson",
  "contactNumber": "+1-555-0101",
  "email": "contact@medplus.com",
  "address": "123 Pharma Way, Suite 400"
}
```

### `GET /api/suppliers/me/orders`
Retrieves purchase orders assigned strictly to the authenticated supplier's partner record.
- **Authorization**: `SUPPLIER` only
- **Response `200 OK`**: Array of assigned `PurchaseOrder` entities.

### `GET /api/suppliers`
Lists all registered suppliers.
- **Authorization**: `ADMIN`, `PHARMACIST`

---

## 5. Medicine & Inventory Endpoints

### `GET /api/medicines`
Search or list medicines.
- **Authorization**: `ADMIN`, `PHARMACIST`, `STAFF`
- **Query Parameters**: `search`, `categoryId`, `supplierId`

### `POST /api/medicines`
Create a new medicine entry.
- **Authorization**: `ADMIN`, `PHARMACIST`

### `GET /api/analytics/dashboard`
High-level inventory valuation, low stock counters, and operational statistics.
- **Authorization**: `ADMIN`, `PHARMACIST`, `STAFF`

### `GET /api/orders`
List procurement purchase orders.
- **Authorization**: `ADMIN`, `PHARMACIST`
