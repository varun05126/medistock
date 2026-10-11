import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle2, Clock, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PurchaseOrders() {
  const { hasRole } = useAuth();
  const canManage = hasRole('ADMIN') || hasRole('PHARMACIST');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/orders');
      const list = res?.data || res || [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch purchase orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Purchase Orders</h1>
          <p className="text-slate-500 text-sm">Procurement lifecycle, vendor dispatches, and incoming inventory</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchOrders}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>No purchase orders logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Order Number</th>
                  <th className="px-6 py-3">Supplier ID</th>
                  <th className="px-6 py-3">Order Date</th>
                  <th className="px-6 py-3">Expected Date</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono font-medium text-slate-800">
                      {o.orderNumber || `PO-${o.id}`}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-mono text-xs">
                      {o.supplier ? (o.supplier.name || `ID #${o.supplier.id}`) : (o.supplierId ? `Supplier #${o.supplierId}` : '—')}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{o.orderDate || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{o.expectedDeliveryDate || 'N/A'}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      ${o.totalAmount ? Number(o.totalAmount).toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        o.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' :
                        o.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                        o.status === 'SHIPPED' ? 'bg-cyan-100 text-cyan-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
