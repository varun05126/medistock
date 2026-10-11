import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

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
        <div className="w-16 h-16 bg-cyan-100 text-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">404 - Page Not Found</h1>
        <p className="text-slate-500 text-sm mt-2">
          The requested MediStock resource could not be found or has been moved.
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center space-x-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
