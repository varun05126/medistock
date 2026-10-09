import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical } from 'lucide-react';

export default function MedicineList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines] = useState([
    { id: 1, name: 'Amoxicillin', generic: 'Amoxicillin Trihydrate', sku: 'MED-001', category: 'Antibiotics', price: 15.50, stock: 240, status: 'In Stock' },
    { id: 2, name: 'Paracetamol', generic: 'Acetaminophen', sku: 'MED-002', category: 'Analgesics', price: 4.20, stock: 12, status: 'Low Stock' },
    { id: 3, name: 'Atorvastatin', generic: 'Atorvastatin Calcium', sku: 'MED-003', category: 'Cardiovascular', price: 28.00, stock: 150, status: 'In Stock' },
    { id: 4, name: 'Omeprazole', generic: 'Omeprazole Magnesium', sku: 'MED-004', category: 'Gastrointestinal', price: 18.90, stock: 0, status: 'Out of Stock' },
  ]);

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.generic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medicine Inventory</h1>
          <p className="text-slate-500 text-sm">Manage medicine catalog, prices, and stock counts</p>
        </div>
        <button className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Add Medicine</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicine or generic name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Medicine</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Available Stock</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.generic}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.sku}</td>
                  <td className="px-6 py-4 text-slate-600">{item.category}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{item.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
