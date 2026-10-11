import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, Building, Activity, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STAFF',
    supplierId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        supplierId: formData.role === 'SUPPLIER' && formData.supplierId ? parseInt(formData.supplierId, 10) : null,
      };

      await authService.register(payload);
      setSuccess('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err?.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-8 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">MediStock Registration</h1>
          <p className="text-cyan-100 text-sm mt-1">Create an authorized workspace account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Username</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Choose username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="staff@medistock.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Account Role</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
              >
                <option value="STAFF">Staff Member</option>
                <option value="PHARMACIST">Pharmacist</option>
                <option value="SUPPLIER">Supplier Portal Partner</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Note: Administrator role can only be assigned by system administrators.
            </p>
          </div>

          {formData.role === 'SUPPLIER' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
                Associated Supplier ID
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  name="supplierId"
                  required
                  value={formData.supplierId}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g. 1"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter your registered Supplier ID in MediStock (e.g. 1).
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
