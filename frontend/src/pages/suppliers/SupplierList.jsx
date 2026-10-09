import React, { useState } from 'react';
import { Truck, Phone, Mail, MapPin, Plus } from 'lucide-react';

export default function SupplierList() {
  const [suppliers] = useState([
    { id: 1, name: 'Apex Pharma Distributors', contact: 'John Miller', phone: '+1 555-0192', email: 'orders@apexpharma.com', rating: 4.8 },
    { id: 2, name: 'BioHealth Logistics', contact: 'Sarah Jenkins', phone: '+1 555-0145', email: 'supply@biohealth.com', rating: 4.5 },
    { id: 3, name: 'MedGlobal Supplies', contact: 'David Chen', phone: '+1 555-0188', email: 'support@medglobal.com', rating: 4.9 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Suppliers Directory</h1>
          <p className="text-slate-500 text-sm">Vendor contacts, reliability ratings, and procurement partners</p>
        </div>
        <button className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 text-base">{s.name}</h3>
                <p className="text-xs text-slate-500">Contact: {s.contact}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                ⭐ {s.rating}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{s.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{s.email}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <button className="text-cyan-600 font-medium hover:underline">View History</button>
              <button className="text-slate-600 font-medium hover:underline">Create Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
