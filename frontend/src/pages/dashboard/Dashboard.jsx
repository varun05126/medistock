import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import { Pill, AlertOctagon, Clock, ShoppingBag, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
    pendingPurchaseOrders: 0,
    totalInventoryValuation: 0,
  });

  const [lowStockItems, setLowStockItems] = useState([]);
  const [stockLogs, setStockLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsRes, lowStockRes, logsRes] = await Promise.allSettled([
        api.get('/analytics/dashboard'),
        api.get('/stock/low'),
        api.get('/stock/logs'),
      ]);

      if (analyticsRes.status === 'fulfilled') {
        const data = analyticsRes.value?.data || analyticsRes.value || {};
        setStats({
          totalMedicines: data.totalMedicines || 0,
          lowStockCount: data.lowStockCount || 0,
          expiringSoonCount: data.expiringSoonCount || 0,
          pendingPurchaseOrders: data.pendingPurchaseOrders || 0,
          totalInventoryValuation: data.totalInventoryValuation || 0,
        });
      }

      if (lowStockRes.status === 'fulfilled') {
        const lowItems = lowStockRes.value?.data || lowStockRes.value || [];
        setLowStockItems(Array.isArray(lowItems) ? lowItems.slice(0, 5) : []);
      }

      if (logsRes.status === 'fulfilled') {
        const logs = logsRes.value?.data || logsRes.value || [];
        setStockLogs(Array.isArray(logs) ? logs.slice(0, 5) : []);
      }
    } catch (err) {
      setError('Failed to fetch real-time dashboard analytics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory Dashboard</h1>
          <p className="text-slate-500 text-sm">
            Live metrics from MediStock MySQL database
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors shadow-sm self-start"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Medicines"
          value={stats.totalMedicines}
          icon={Pill}
          color="teal"
          trend="Active Catalog"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockCount}
          icon={AlertOctagon}
          color="amber"
          trend="Below Threshold"
        />
        <StatCard
          title="Expiring Soon (30d)"
          value={stats.expiringSoonCount}
          icon={Clock}
          color="rose"
          trend="Near Expiry Watch"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingPurchaseOrders}
          icon={ShoppingBag}
          color="blue"
          trend="Awaiting Delivery"
        />
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Low Stock Items */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Critical Low Stock Items</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {lowStockItems.length} alerts
            </span>
          </div>

          {lowStockItems.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No critical low stock items detected.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {lowStockItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{item.name || item.medicine?.name}</p>
                    <p className="text-xs text-slate-400">
                      SKU: {item.sku || 'N/A'} • {item.genericName || 'Standard Batch'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                      {item.quantity ?? item.currentStock ?? 0} in stock
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Min level: {item.reorderLevel ?? 10}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock Movement Feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Inventory Logs</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
              Live Feed
            </span>
          </div>

          {stockLogs.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No stock transactions logged yet.</p>
          ) : (
            <div className="space-y-3">
              {stockLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 text-sm">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    log.changeType === 'ADD' ? 'bg-emerald-500' :
                    log.changeType === 'DISPENSE' ? 'bg-blue-500' : 'bg-rose-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700">
                      {log.medicineName || `Medicine #${log.medicineId}`}: {log.changeType} {log.quantity} units
                    </p>
                    <p className="text-xs text-slate-400">
                      {log.reason || 'Routine movement'} • {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
