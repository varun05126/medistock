import React, { useState, useEffect } from 'react';
import { Truck, Mail, Phone, MapPin, PackageCheck, Clock, CheckCircle2, AlertCircle, Edit3, Save, X } from 'lucide-react';
import api from '../../services/api';

export default function SupplierPortal() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, ordersRes] = await Promise.all([
        api.get('/suppliers/me'),
        api.get('/suppliers/me/orders'),
      ]);

      const prof = profileRes?.data || profileRes;
      setProfile(prof);
      setEditForm({
        name: prof.name || '',
        contactPerson: prof.contactPerson || '',
        email: prof.email || '',
        phone: prof.phone || '',
        address: prof.address || '',
      });

      const ordList = ordersRes?.data || ordersRes || [];
      setOrders(Array.isArray(ordList) ? ordList : []);
    } catch (err) {
      setError(err?.message || 'Failed to load supplier records. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/suppliers/me', editForm);
      const updated = res?.data || res;
      setProfile(updated);
      setIsEditing(false);
      setSuccess('Supplier profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err?.message || 'Could not update profile.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Supplier Workspace</h1>
          <p className="text-slate-500 text-sm">
            Isolated Partner Portal for <span className="font-semibold text-cyan-700">{profile?.name || 'Verified Supplier'}</span>
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm self-start"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
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

      {/* Supplier Profile Card / Edit Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-cyan-600" />
            <span>Supplier Information & Credentials</span>
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-semibold">
            Partner ID #{profile?.id}
          </span>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Contact Person</label>
                <input
                  type="text"
                  value={editForm.contactPerson}
                  onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-3">
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center space-x-1.5 px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium">Company</p>
              <p className="font-semibold text-slate-800">{profile?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Primary Contact</p>
              <p className="font-medium text-slate-700">{profile?.contactPerson || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Contact Email</p>
              <p className="font-medium text-slate-700">{profile?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Phone</p>
              <p className="font-medium text-slate-700">{profile?.phone || 'N/A'}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-400 font-medium">Address</p>
              <p className="font-medium text-slate-700">{profile?.address || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Assigned Purchase Orders */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
              <PackageCheck className="w-5 h-5 text-cyan-600" />
              <span>Assigned Purchase Orders</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Only purchase orders officially dispatched to your supplier ID are shown here.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
            {orders.length} orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <PackageCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-base font-medium text-slate-600">No purchase orders assigned yet</p>
            <p className="text-xs text-slate-400 mt-1">
              New purchase orders from pharmacy staff will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Order #</th>
                  <th className="px-6 py-3">Order Date</th>
                  <th className="px-6 py-3">Expected Date</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono font-medium text-slate-800">
                      {o.orderNumber || `PO-${o.id}`}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{o.orderDate || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{o.expectedDeliveryDate || 'N/A'}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      ${o.totalAmount ? Number(o.totalAmount).toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        o.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' :
                        o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                        o.status === 'APPROVED' ? 'bg-cyan-100 text-cyan-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {Array.isArray(o.items) ? `${o.items.length} item(s)` : 'View details'}
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
