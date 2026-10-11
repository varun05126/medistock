import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();

  const handleGoHome = () => {
    if (hasRole('SUPPLIER')) {
      navigate('/supplier/portal');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">403 - Access Denied</h1>
        <p className="text-slate-500 text-sm mt-2">
          Your account role (<span className="font-semibold text-slate-700">{user?.role || 'User'}</span>) does not have sufficient privileges to access this operational screen.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to My Dashboard</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
