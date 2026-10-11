import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Pill,
  Clock,
  Truck,
  ShoppingCart,
  Users,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

export default function Sidebar() {
  const { user, hasRole } = useAuth();

  const isSupplier = hasRole('SUPPLIER');
  const isAdmin = hasRole('ADMIN');
  const isPharmacist = hasRole('PHARMACIST');

  // Supplier-only navigation
  if (isSupplier) {
    const supplierItems = [
      { name: 'Supplier Portal', path: '/supplier/portal', icon: Truck },
      { name: 'My Purchase Orders', path: '/supplier/orders', icon: PackageCheck },
    ];

    return (
      <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-xl">
        <div className="space-y-1">
          <div className="px-3 py-2 mb-3 bg-cyan-950/50 border border-cyan-800/40 rounded-lg">
            <p className="text-xs uppercase font-bold text-cyan-400">Supplier Workspace</p>
            <p className="text-xs text-slate-400 truncate mt-0.5">{user?.supplierName || 'Verified Supplier'}</p>
          </div>
          {supplierItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 px-3">
          Isolated Supplier View
        </div>
      </aside>
    );
  }

  // Internal staff, pharmacist, admin navigation
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'PHARMACIST', 'STAFF'] },
    { name: 'Inventory', path: '/inventory', icon: Pill, roles: ['ADMIN', 'PHARMACIST', 'STAFF'] },
    { name: 'Expiry Tracker', path: '/expiry', icon: Clock, roles: ['ADMIN', 'PHARMACIST'] },
    { name: 'Suppliers', path: '/suppliers', icon: Truck, roles: ['ADMIN', 'PHARMACIST'] },
    { name: 'Purchase Orders', path: '/orders', icon: ShoppingCart, roles: ['ADMIN', 'PHARMACIST'] },
    { name: 'User Management', path: '/users', icon: Users, roles: ['ADMIN'] },
  ];

  const visibleItems = navItems.filter((item) => item.roles.some((r) => hasRole(r)));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-xl">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          {isAdmin ? 'System Administration' : isPharmacist ? 'Pharmacy Operations' : 'Staff Operations'}
        </p>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Role: {user?.role || 'Staff'}</span>
        </div>
      </div>
    </aside>
  );
}
