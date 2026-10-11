import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, hasRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Supplier user attempting to access internal staff/admin routes -> redirect to supplier portal
  const isSupplier = hasRole('SUPPLIER');
  if (isSupplier && !location.pathname.startsWith('/supplier')) {
    return <Navigate to="/supplier/portal" replace />;
  }

  // Non-supplier attempting to access supplier-only routes -> 403 (allow ADMIN)
  const isAdmin = hasRole('ADMIN');
  if (!isSupplier && !isAdmin && location.pathname.startsWith('/supplier')) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Role validation if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.some((role) => hasRole(role));
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
