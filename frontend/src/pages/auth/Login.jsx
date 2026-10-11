import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, User, Activity, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Field-level validations
    if (!username.trim()) {
      setError('Username or email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (!role) {
      setError('Please select your role.');
      return;
    }

    setLoading(true);

    try {
      const userData = await login({
        username: username.trim(),
        password,
        role,
      });

      const userRole = (userData?.role || role).toUpperCase().replace('ROLE_', '');

      // Role-specific routing
      if (userRole === 'SUPPLIER') {
        navigate('/supplier/portal');
      } else if (userRole === 'ADMIN') {
        navigate('/');
      } else if (userRole === 'PHARMACIST') {
        navigate('/');
      } else if (userRole === 'STAFF') {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Diagnostic logging without exposing sensitive credentials or tokens
      const currentApiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      console.warn('[MediStock Auth Diagnostic]', {
        message: err?.message,
        code: err?.code,
        status: err?.response?.status || err?.statusCode,
        apiBaseUrl: currentApiBase,
        timestamp: new Date().toISOString()
      });

      // Handle network failures (CORS, mixed content, or offline backend)
      const isNetworkError =
        err?.code === 'ERR_NETWORK' ||
        err?.message === 'Network Error' ||
        (!err?.response && !err?.statusCode && err?.request);

      if (isNetworkError) {
        const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
        const isCallingHttp = currentApiBase.startsWith('http://');

        if (isHttps && isCallingHttp) {
          setError(
            `Unable to connect: Deployed HTTPS frontend cannot call insecure HTTP API (${currentApiBase}). Please configure VITE_API_BASE_URL in Vercel to your deployed backend HTTPS URL.`
          );
        } else {
          setError(
            `Unable to connect to MediStock backend at ${currentApiBase}. Please verify the server is running and reachable.`
          );
        }
      } else if (err?.message) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Backend server is currently unavailable. Please verify connection.');
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username / Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter username or email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          {/* Select Role Field */}
          <div>
            <label htmlFor="role-select" className="block text-xs font-semibold text-slate-600 uppercase mb-2">
              Select Role
            </label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-slate-700"
              >
                <option value="">Select your role</option>
                <option value="ADMIN">Admin</option>
                <option value="PHARMACIST">Pharmacist</option>
                <option value="STAFF">Staff</option>
                <option value="SUPPLIER">Supplier</option>
              </select>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Registration Link */}
          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-cyan-600 font-semibold hover:underline">
              Create here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
