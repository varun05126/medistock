import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, Building, Activity, ShieldCheck, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';
import { authService } from '../../services/authService';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'STAFF',
    supplierId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Full name is required.';
    }
    if (!formData.email.trim()) {
      return 'Email address is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!formData.username.trim()) {
      return 'Username is required.';
    }
    if (formData.username.trim().length < 3) {
      return 'Username must be at least 3 characters.';
    }
    if (!formData.password) {
      return 'Password is required.';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (!formData.confirmPassword) {
      return 'Please confirm your password.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }
    if (formData.role === 'SUPPLIER' && !formData.supplierId) {
      return 'Supplier ID is required for Supplier accounts.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim(),
        password: formData.password,
        role: formData.role,
        supplierId: formData.role === 'SUPPLIER' && formData.supplierId ? parseInt(formData.supplierId, 10) : null,
      };

      const res = await authService.register(payload);
      const successMsg = res?.message || 'Account created successfully! Redirecting to sign in...';
      setSuccess(successMsg);

      setTimeout(() => {
        navigate('/login', {
          state: {
            successMessage: 'Account created successfully! Please sign in with your credentials.',
          },
        });
      }, 1200);
    } catch (err) {
      // Diagnostic logging without sensitive passwords
      const currentApiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      console.warn('[MediStock Register Diagnostic]', {
        message: err?.message,
        code: err?.code,
        status: err?.response?.status || err?.statusCode,
        apiBaseUrl: currentApiBase,
        timestamp: new Date().toISOString(),
      });

      const isNetworkError =
        err?.code === 'ERR_NETWORK' ||
        err?.message === 'Network Error' ||
        (!err?.response && !err?.statusCode && err?.request);

      if (isNetworkError) {
        setError(`Unable to connect to MediStock backend at ${currentApiBase}. Please verify the server is running.`);
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.message) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Registration failed. Please check your information and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-8 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">MediStock</h1>
          <p className="text-cyan-100 text-sm mt-1">Medical Inventory Management Platform</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate className="p-8 space-y-4">
          <div className="text-center pb-2">
            <h2 className="text-lg font-semibold text-slate-800">Create an Account</h2>
            <p className="text-xs text-slate-500">Enter your details to create your workspace account</p>
          </div>

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

          {/* Full Name Field */}
          <div>
            <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                id="reg-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter full name"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Address Field */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                id="reg-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="name@medistock.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Username Field */}
          <div>
            <label htmlFor="reg-username" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
              Username
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                id="reg-username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Choose username"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                id="reg-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter password (min 6 characters)"
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="reg-confirm-password" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                id="reg-confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Confirm password"
                disabled={loading}
              />
            </div>
          </div>

          {/* Role Selection Dropdown */}
          <div>
            <label htmlFor="reg-role" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
              Role
            </label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                id="reg-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-slate-700"
                disabled={loading}
              >
                <option value="STAFF">Staff</option>
                <option value="PHARMACIST">Pharmacist</option>
                <option value="SUPPLIER">Supplier</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Note: Administrator role cannot be assigned via public registration.
            </p>
          </div>

          {/* Associated Supplier ID (Conditional) */}
          {formData.role === 'SUPPLIER' && (
            <div>
              <label htmlFor="reg-supplier-id" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
                Associated Supplier ID
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  id="reg-supplier-id"
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g. 1"
                  disabled={loading}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter your registered Supplier ID in MediStock.
              </p>
            </div>
          )}

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Already have an account Link */}
          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span>Already have an account? </span>
            <Link to="/login" className="text-cyan-600 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
