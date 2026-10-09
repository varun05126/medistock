import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import { Pill, AlertOctagon, Clock, ShoppingBag } from 'lucide-react';
import { analyticsService, stockService } from '../../services/medicineService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 1420,
    lowStockCount: 14,
    expiringSoonCount: 8,
    pendingPurchaseOrders: 5,
  });

  const [lowStockItems, setLowStockItems] = useState([
    { id: 1, name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 5, reorderLevel: 20 },
    { id: 2, name: 'Paracetamol 650mg', category: 'Analgesic', stock: 12, reorderLevel: 50 },
    { id: 3, name: 'Metformin 500mg', category: 'Antidiabetic', stock: 8, reorderLevel: 25 },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Inventory Dashboard</h1>
        <p className="text-slate-500 text-sm">Real-time overview of medicines, stock levels, and critical alerts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Medicines"
          value={stats.totalMedicines}
          icon={Pill}
          color="teal"
          trend="+12 added this month"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockCount}
          icon={AlertOctagon}
          color="amber"
          trend="Action required"
        />
        <StatCard
          title="Expiring Soon (30d)"
          value={stats.expiringSoonCount}
          icon={Clock}
          color="rose"
          trend="Monitor batches"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingPurchaseOrders}
          icon={ShoppingBag}
          color="blue"
          trend="2 awaiting delivery"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Critical Low Stock Items</h2>
          <div className="divide-y divide-slate-100">
            {lowStockItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.category}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                    {item.stock} left
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">Threshold: {item.reorderLevel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Stock Movement Feed</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
              <div>
                <p className="font-medium text-slate-700">Received 500 units of Azithromycin</p>
                <p className="text-xs text-slate-400">PO-48192 • 10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></span>
              <div>
                <p className="font-medium text-slate-700">Dispensed 30 units of Ibuprofen</p>
                <p className="text-xs text-slate-400">Prescription Rx-104 • 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5"></span>
              <div>
                <p className="font-medium text-slate-700">Flagged expired batch: B-2023-91</p>
                <p className="text-xs text-slate-400">Audit system • 3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
