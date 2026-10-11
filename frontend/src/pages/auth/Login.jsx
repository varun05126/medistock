import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Activity, AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await login({ username, password });
      const userRole = (userData?.role || '').toUpperCase().replace('ROLE_', '');
      if (userRole === 'SUPPLIER') {
        navigate('/supplier/portal');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err?.message || 'Invalid username or password. Please try again.');
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
          <h1 className="text-2xl font-bold">MediStock</h1>
          <p className="text-cyan-100 text-sm mt-1">Medical Inventory Management Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Username or Email</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Don't have an account?</span>
            <Link to="/register" className="text-cyan-600 font-semibold hover:underline">
              Create Account
            </Link>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
            <p className="text-[11px] font-medium text-slate-600">Sample MySQL Credentials</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Admin: <code className="text-cyan-700 font-mono">admin / admin123</code><br />
              Pharmacist: <code className="text-cyan-700 font-mono">pharmacist / pharmacist123</code><br />
              Staff: <code className="text-cyan-700 font-mono">staff / staff123</code><br />
              Supplier: <code className="text-cyan-700 font-mono">supplier / supplier123</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
