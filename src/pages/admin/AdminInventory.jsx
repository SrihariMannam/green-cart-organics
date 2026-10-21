import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { formatCurrency, formatKg } from '../../utils/formatters';
import { Layers, Edit3, Check, X, Search } from 'lucide-react';

export const AdminInventory = () => {
  const { products } = useApp();
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Central Product Catalog & Stock Buffer"
        subtitle="Manage product prices per kilogram, available buffer quantities, and organic certifications"
        breadcrumb={['Admin Portal', 'Inventory']}
      />

      <div className="px-6 space-y-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Active Catalog Items: <strong>{products.length}</strong>
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Produce</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Origin Farm</th>
                  <th className="py-3 px-4 text-right">Price / kg</th>
                  <th className="py-3 px-4 text-center">Available Stock (kg)</th>
                  <th className="py-3 px-4 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <span className="font-bold text-slate-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.category === 'vegetables'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{p.originFarm}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      {formatCurrency(p.pricePerKg)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-forest-800 text-sm">
                      {formatKg(p.availableStock)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600">
                      ★ {p.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
