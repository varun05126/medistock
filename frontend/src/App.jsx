import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import MedicineList from './pages/inventory/MedicineList';
import ExpiryTracker from './pages/expiry/ExpiryTracker';
import SupplierList from './pages/suppliers/SupplierList';
import PurchaseOrders from './pages/orders/PurchaseOrders';
import Login from './pages/auth/Login';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 max-w-7xl mx-auto overflow-y-auto">
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
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/inventory"
            element={
              <Layout>
                <MedicineList />
              </Layout>
            }
          />
          <Route
            path="/expiry"
            element={
              <Layout>
                <ExpiryTracker />
              </Layout>
            }
          />
          <Route
            path="/suppliers"
            element={
              <Layout>
                <SupplierList />
              </Layout>
            }
          />
          <Route
            path="/orders"
            element={
              <Layout>
                <PurchaseOrders />
              </Layout>
            }
          />
          <Route
            path="/analytics"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
