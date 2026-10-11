import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, ShieldCheck, Mail, Building, Key, AlertCircle, CheckCircle2, Search, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'STAFF',
    supplierId: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/users');
      const list = res?.data || res || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.message || 'Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      const list = res?.data || res || [];
      setSuppliers(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('Suppliers could not be loaded for user creation dropdown:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSuppliers();
  }, []);

  const openAddModal = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'STAFF',
      supplierId: '',
    });
    setFieldErrors({});
    setError('');
    setShowAddModal(true);
    fetchSuppliers();
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});

    // Client-side validations
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Invalid email address format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.role === 'SUPPLIER' && !formData.supplierId) {
      errors.supplierId = 'Please select a supplier partner for this account';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        supplierId: formData.role === 'SUPPLIER' && formData.supplierId ? parseInt(formData.supplierId, 10) : null,
      };

      await api.post('/users', payload);
      setSuccess(`User "${formData.username.trim()}" created successfully with role ${formData.role}!`);
      setShowAddModal(false);
      setFormData({ name: '', username: '', email: '', password: '', role: 'STAFF', supplierId: '' });
      fetchUsers();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      if (err?.data && typeof err.data === 'object') {
        setFieldErrors(err.data);
      }
      const errMsg = err?.message || (typeof err === 'string' ? err : 'Failed to create user. Please ensure username/email are unique.');
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User & Role Management</h1>
          <p className="text-slate-500 text-sm">
            Control platform accounts, role-based privileges, and partner supplier assignments
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm self-start"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User Account</span>
        </button>
      </div>

      {error && !showAddModal && (
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

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, username, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
            {filteredUsers.length} total users
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Linked Supplier</th>
                  <th className="px-6 py-3">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{u.name || u.username}</div>
                      <div className="text-xs text-slate-500">@{u.username} • {u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'PHARMACIST' ? 'bg-teal-100 text-teal-800' :
                        u.role === 'SUPPLIER' ? 'bg-cyan-100 text-cyan-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md">
                        {u.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {u.supplierName ? (
                        <span className="font-medium text-slate-700">{u.supplierName} (#{u.supplierId})</span>
                      ) : u.supplierId ? (
                        <span className="font-mono text-slate-500">ID #{u.supplierId}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-base">Create Application Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setFieldErrors({ ...fieldErrors, name: '' });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                    fieldErrors.name ? 'border-rose-400 focus:ring-2 focus:ring-rose-500' : 'border-slate-200 focus:ring-2 focus:ring-cyan-500'
                  }`}
                  placeholder="e.g. Dr. Jane Smith"
                />
                {fieldErrors.name && (
                  <p className="text-xs text-rose-600 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    setFieldErrors({ ...fieldErrors, username: '' });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                    fieldErrors.username ? 'border-rose-400 focus:ring-2 focus:ring-rose-500' : 'border-slate-200 focus:ring-2 focus:ring-cyan-500'
                  }`}
                  placeholder="e.g. janesmith"
                />
                {fieldErrors.username && (
                  <p className="text-xs text-rose-600 mt-1">{fieldErrors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setFieldErrors({ ...fieldErrors, email: '' });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                    fieldErrors.email ? 'border-rose-400 focus:ring-2 focus:ring-rose-500' : 'border-slate-200 focus:ring-2 focus:ring-cyan-500'
                  }`}
                  placeholder="e.g. janesmith@medistock.com"
                />
                {fieldErrors.email && (
                  <p className="text-xs text-rose-600 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Initial Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setFieldErrors({ ...fieldErrors, password: '' });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                    fieldErrors.password ? 'border-rose-400 focus:ring-2 focus:ring-rose-500' : 'border-slate-200 focus:ring-2 focus:ring-cyan-500'
                  }`}
                  placeholder="Minimum 6 characters"
                />
                {fieldErrors.password && (
                  <p className="text-xs text-rose-600 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Assigned Privilege Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    setFormData({ ...formData, role: e.target.value });
                    setFieldErrors({ ...fieldErrors, role: '', supplierId: '' });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none bg-white"
                >
                  <option value="STAFF">STAFF (Inventory operational view)</option>
                  <option value="PHARMACIST">PHARMACIST (Medicine, Expiry & Orders)</option>
                  <option value="ADMIN">ADMIN (Full platform administrative privileges)</option>
                  <option value="SUPPLIER">SUPPLIER (External partner portal)</option>
                </select>
              </div>

              {/* Supplier Dropdown Selector */}
              {formData.role === 'SUPPLIER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Linked Supplier Organization <span className="text-rose-500">*</span>
                  </label>
                  {suppliers.length === 0 ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg">
                      No suppliers registered in MediStock yet. Please create a supplier in the <strong>Suppliers</strong> tab first.
                    </div>
                  ) : (
                    <select
                      id="supplier-select"
                      required
                      value={formData.supplierId}
                      onChange={(e) => {
                        setFormData({ ...formData, supplierId: e.target.value });
                        setFieldErrors({ ...fieldErrors, supplierId: '' });
                      }}
                      className={`w-full px-3 py-2 border rounded-lg text-sm outline-none bg-white ${
                        fieldErrors.supplierId ? 'border-rose-400 focus:ring-2 focus:ring-rose-500' : 'border-slate-200 focus:ring-2 focus:ring-cyan-500'
                      }`}
                    >
                      <option value="">Select a registered supplier partner</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (ID #{s.id})
                        </option>
                      ))}
                    </select>
                  )}
                  {fieldErrors.supplierId && (
                    <p className="text-xs text-rose-600 mt-1">{fieldErrors.supplierId}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supplier users can only access purchase orders assigned to their selected supplier organization.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || (formData.role === 'SUPPLIER' && suppliers.length === 0)}
                  className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
