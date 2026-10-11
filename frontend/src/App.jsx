import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

import Dashboard from './pages/dashboard/Dashboard';
import MedicineList from './pages/inventory/MedicineList';
import ExpiryTracker from './pages/expiry/ExpiryTracker';
import SupplierList from './pages/suppliers/SupplierList';
import PurchaseOrders from './pages/orders/PurchaseOrders';
import UserManagement from './pages/admin/UserManagement';
import SupplierPortal from './pages/supplier/SupplierPortal';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Unauthorized from './pages/common/Unauthorized';
import NotFound from './pages/common/NotFound';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Internal Dashboard & Analytics (Admin, Pharmacist, Staff) */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST', 'STAFF']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST', 'STAFF']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Medicine Inventory (Admin, Pharmacist, Staff) */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST', 'STAFF']}>
                <Layout>
                  <MedicineList />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Expiry Tracking (Admin, Pharmacist) */}
          <Route
            path="/expiry"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
                <Layout>
                  <ExpiryTracker />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Suppliers Management (Admin, Pharmacist) */}
          <Route
            path="/suppliers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
                <Layout>
                  <SupplierList />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Purchase Orders (Admin, Pharmacist) */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
                <Layout>
                  <PurchaseOrders />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* User Management (Admin Only) */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Supplier Isolated Portal (Supplier & Admin) */}
          <Route
            path="/supplier/portal"
            element={
              <ProtectedRoute allowedRoles={['SUPPLIER', 'ADMIN']}>
                <Layout>
                  <SupplierPortal />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/orders"
            element={
              <ProtectedRoute allowedRoles={['SUPPLIER', 'ADMIN']}>
                <Layout>
                  <SupplierPortal />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
