import React from 'react';

export default function StatCard({ title, value, icon: Icon, color, trend }) {
  const colorMap = {
    teal: 'bg-teal-50 text-teal-600 border-teal-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
  };

  const activeColor = colorMap[color] || colorMap.teal;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        {trend && (
          <p className="text-xs text-slate-400 mt-1">{trend}</p>
        )}
      </div>
      <div className={`p-3 rounded-lg border ${activeColor}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
