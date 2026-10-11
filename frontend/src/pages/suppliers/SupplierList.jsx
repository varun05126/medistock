import React, { useState, useEffect } from 'react';
import { Truck, Phone, Mail, MapPin, Plus, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SupplierList() {
  const { hasRole } = useAuth();
  const canManage = hasRole('ADMIN') || hasRole('PHARMACIST');

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    address: '',
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/suppliers');
      const list = res?.data || res || [];
      setSuppliers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch suppliers from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/suppliers', formData);
      setSuccess(`Supplier "${formData.name}" added successfully!`);
      setShowModal(false);
      setFormData({ name: '', contactPerson: '', contactNumber: '', email: '', address: '' });
      fetchSuppliers();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err?.message || 'Failed to create supplier.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Suppliers Directory</h1>
          <p className="text-slate-500 text-sm">Vendor contacts, verified partners, and procurement entities</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchSuppliers}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {canManage && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supplier</span>
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

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
        </div>
      ) : suppliers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <Truck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p>No suppliers registered in system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 text-base">{s.name}</h3>
                  <p className="text-xs text-slate-500">Contact: {s.contactPerson || 'General Support'}</p>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold font-mono">
                  ID #{s.id}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{s.phone || s.contactNumber || 'No phone recorded'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{s.email || 'No email recorded'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{s.address || 'Address unlisted'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-semibold text-base">Register New Supplier</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSupplier} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Supplier Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="e.g. Apex Pharma Distributors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="e.g. John Miller"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="+1 555-0192"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="orders@apexpharma.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="123 Pharma Parkway, City"
                />
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
