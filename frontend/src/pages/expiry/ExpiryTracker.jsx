import React, { useState } from 'react';
import { AlertCircle, Calendar, ShieldAlert } from 'lucide-react';

export default function ExpiryTracker() {
  const [batches] = useState([
    { id: 1, medicine: 'Amoxicillin 500mg', batch: 'BAT-2024-001', expiryDate: '2026-11-05', daysLeft: 27, quantity: 45, status: 'Near Expiry' },
    { id: 2, medicine: 'Cough Syrup 100ml', batch: 'BAT-2023-889', expiryDate: '2026-10-15', daysLeft: 6, quantity: 18, status: 'Critical' },
    { id: 3, medicine: 'Vitamin D3 Drops', batch: 'BAT-2023-512', expiryDate: '2026-09-30', daysLeft: -9, quantity: 12, status: 'Expired' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Expiry Tracker & Management</h1>
        <p className="text-slate-500 text-sm">Monitor medicine shelf-life, near-expiry batches, and expired items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-amber-600" />
          <div>
            <p className="text-xs font-semibold uppercase text-amber-800">Expiring in &lt; 30 Days</p>
            <p className="text-xl font-bold text-amber-900">18 Batches</p>
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center space-x-3">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
          <div>
            <p className="text-xs font-semibold uppercase text-rose-800">Critical (&lt; 7 Days)</p>
            <p className="text-xl font-bold text-rose-900">4 Batches</p>
          </div>
        </div>
        <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl flex items-center space-x-3">
          <AlertCircle className="w-8 h-8 text-slate-600" />
          <div>
            <p className="text-xs font-semibold uppercase text-slate-800">Expired Stock to Quarantine</p>
            <p className="text-xl font-bold text-slate-900">2 Batches</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-semibold text-slate-800">
          Batch Tracking Records
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Medicine</th>
              <th className="px-6 py-3">Batch Number</th>
              <th className="px-6 py-3">Expiry Date</th>
              <th className="px-6 py-3">Days Remaining</th>
              <th className="px-6 py-3">Stock Units</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {batches.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-800">{b.medicine}</td>
                <td className="px-6 py-4 font-mono text-slate-600">{b.batch}</td>
                <td className="px-6 py-4 text-slate-600">{b.expiryDate}</td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${b.daysLeft < 0 ? 'text-rose-600' : b.daysLeft < 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                    {b.daysLeft < 0 ? 'Expired' : `${b.daysLeft} days`}
                  </span>
                </td>
                <td className="px-6 py-4">{b.quantity}</td>
                <td className="px-6 py-4">
                  <button className="text-xs font-medium px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md">
                    {b.daysLeft < 0 ? 'Dispose' : 'Discount / Move'}
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
