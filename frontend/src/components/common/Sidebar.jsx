import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  AlertTriangle,
  Clock,
  Truck,
  ShoppingCart,
  BarChart3,
  Settings
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Inventory', path: '/inventory', icon: Pill },
  { name: 'Expiry Tracker', path: '/expiry', icon: Clock },
  { name: 'Suppliers', path: '/suppliers', icon: Truck },
  { name: 'Purchase Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Management
        </p>
        {navItems.map((item) => {
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
        <div className="flex items-center space-x-3 px-3 py-2 text-xs text-slate-500">
          <Settings className="w-4 h-4" />
          <span>System Settings</span>
        </div>
      </div>
    </aside>
  );
}
