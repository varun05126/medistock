import React, { useState } from 'react';
import { ShoppingCart, CheckCircle2, Clock, Plus } from 'lucide-react';

export default function PurchaseOrders() {
  const [orders] = useState([
    { id: 1, orderNo: 'PO-2024-1001', supplier: 'Apex Pharma Distributors', items: 4, total: 3250.00, date: '2026-10-02', status: 'RECEIVED' },
    { id: 2, orderNo: 'PO-2024-1002', supplier: 'BioHealth Logistics', items: 2, total: 1180.50, date: '2026-10-07', status: 'PENDING' },
    { id: 3, orderNo: 'PO-2024-1003', supplier: 'MedGlobal Supplies', items: 6, total: 5400.00, date: '2026-10-08', status: 'APPROVED' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Purchase Orders</h1>
          <p className="text-slate-500 text-sm">Track procurement lifecycle, supplier orders, and deliveries</p>
        </div>
        <button className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span>New Purchase Order</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Order Number</th>
              <th className="px-6 py-3">Supplier</th>
              <th className="px-6 py-3">Items Count</th>
              <th className="px-6 py-3">Total Amount</th>
              <th className="px-6 py-3">Order Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-medium text-slate-800">{o.orderNo}</td>
                <td className="px-6 py-4 text-slate-700">{o.supplier}</td>
                <td className="px-6 py-4">{o.items} items</td>
                <td className="px-6 py-4 font-semibold text-slate-800">${o.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-slate-500">{o.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    o.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' :
                    o.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-semibold text-cyan-600 hover:underline">
                    View PO
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
