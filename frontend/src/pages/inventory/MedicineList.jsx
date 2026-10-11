import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, AlertCircle, CheckCircle2, Pill, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MedicineList() {
  const { hasRole } = useAuth();
  const canManage = hasRole('ADMIN') || hasRole('PHARMACIST');

  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    quantity: 100,
    price: 15.00,
    expiryDate: '2027-01-01',
    manufacturingDate: '2025-01-01',
  });

  const fetchMedicines = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/medicines');
      const list = res?.data || res || [];
      setMedicines(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || 'Failed to load medicines from inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleCreateMedicine = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        name: formData.name,
        batchNumber: formData.batchNumber,
        quantity: parseInt(formData.quantity, 10),
        price: parseFloat(formData.price),
        expiryDate: formData.expiryDate,
        manufacturingDate: formData.manufacturingDate,
        categoryId: 1,
        supplierId: 1,
      };

      await api.post('/medicines', payload);
      setSuccess(`Medicine "${formData.name}" added to catalog!`);
      setShowModal(false);
      setFormData({ name: '', batchNumber: '', quantity: 100, price: 15.00, expiryDate: '2027-01-01', manufacturingDate: '2025-01-01' });
      fetchMedicines();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err?.message || 'Failed to add medicine.');
    }
  };

  const filtered = medicines.filter((m) =>
    (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.batchNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medicine Inventory</h1>
          <p className="text-slate-500 text-sm">Real-time catalog and stock levels from MySQL</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchMedicines}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {canManage && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicine or batch number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
            {filtered.length} medicines
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Pill className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>No medicines found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Medicine Name</th>
                  <th className="px-6 py-3">Batch Number</th>
                  <th className="px-6 py-3">Stock Units</th>
                  <th className="px-6 py-3">Unit Price</th>
                  <th className="px-6 py-3">Expiry Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const qty = item.quantity ?? 0;
                  const isLow = qty < 20;
                  const isOut = qty === 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500">
                        {item.batchNumber || 'BAT-DEFAULT'}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {qty}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        ${item.price ? Number(item.price).toFixed(2) : '0.00'}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {item.expiryDate || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          isOut ? 'bg-rose-100 text-rose-800' :
                          isLow ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Medicine Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-semibold text-base">Add New Medicine</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateMedicine} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="e.g. Ciprofloxacin 500mg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Batch Number</label>
                  <input
                    type="text"
                    required
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="BAT-2026-90"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
