import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, ShieldAlert, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function ExpiryTracker() {
  const [records, setRecords] = useState([]);
  const [nearExpiryCount, setNearExpiryCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExpiryData = async () => {
    setLoading(true);
    setError('');
    try {
      const [allRes, nearRes, expRes] = await Promise.allSettled([
        api.get('/expiry'),
        api.get('/expiry/near-expiry?days=30'),
        api.get('/expiry/expired'),
      ]);

      if (allRes.status === 'fulfilled') {
        const list = allRes.value?.data || allRes.value || [];
        setRecords(Array.isArray(list) ? list : []);
      }

      if (nearRes.status === 'fulfilled') {
        const nearList = nearRes.value?.data || nearRes.value || [];
        setNearExpiryCount(Array.isArray(nearList) ? nearList.length : 0);
      }

      if (expRes.status === 'fulfilled') {
        const expList = expRes.value?.data || expRes.value || [];
        setExpiredCount(Array.isArray(expList) ? expList.length : 0);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load expiry monitoring records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiryData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Expiry Tracker & Management</h1>
          <p className="text-slate-500 text-sm">Monitor medicine shelf-life and near-expiry batches from MySQL</p>
        </div>
        <button
          onClick={fetchExpiryData}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 self-start"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-amber-600 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase text-amber-800">Expiring in &lt; 30 Days</p>
            <p className="text-xl font-bold text-amber-900">{nearExpiryCount} Batches</p>
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center space-x-3">
          <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase text-rose-800">Expired Batches</p>
            <p className="text-xl font-bold text-rose-900">{expiredCount} Batches</p>
          </div>
        </div>
        <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-xl flex items-center space-x-3">
          <CheckCircle2 className="w-8 h-8 text-cyan-600 shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase text-cyan-800">Monitored Items</p>
            <p className="text-xl font-bold text-cyan-900">{records.length} Total</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 font-semibold text-slate-800 flex justify-between items-center">
          <span>Batch Expiry Ledger</span>
          <span className="text-xs font-normal text-slate-500">{records.length} records active</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>No expiry tracking alerts currently flagged.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Medicine</th>
                  <th className="px-6 py-3">Expiry Date</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {r.medicine ? r.medicine.name : `Medicine #${r.medicineId || r.id}`}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-mono">{r.expiryDate || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{r.quantity ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        r.status === 'EXPIRED' ? 'bg-rose-100 text-rose-800' :
                        r.status === 'NEAR_EXPIRY' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.status || 'ACTIVE'}
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
