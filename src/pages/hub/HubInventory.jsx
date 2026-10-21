import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { formatKg } from '../../utils/formatters';
import { Boxes, PackageCheck, AlertTriangle } from 'lucide-react';

export const HubInventory = () => {
  const { products, orders } = useApp();

  // Calculate central hub inventory and staging metrics
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Central Hub Aggregation Inventory"
        subtitle="Staging inventory across Cold Bay 1, Cold Bay 2 & Dry Storage"
        breadcrumb={['City Hub Staff', 'Hub Inventory']}
      />

      <div className="px-6 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Boxes className="w-4 h-4 text-forest-700" />
              Live Hub Buffer & Cold-Storage Tally
            </h3>
            <span className="text-xs text-slate-400">Target storage temp: 12°C - 15°C</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Produce Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Hub In-Stock</th>
                  <th className="py-3 px-4 text-center">Dispatched Today</th>
                  <th className="py-3 px-4">Storage Zone</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
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
                    <td className="py-3 px-4 text-center font-bold text-forest-800">
                      {formatKg(p.availableStock)}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600 font-semibold">
                      {formatKg(Math.floor(p.availableStock * 0.25))}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {p.category === 'fruits' ? 'Cold Bay 2 (Chilled)' : 'Cold Bay 1 (Ventilated)'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        In Normal Buffer
                      </span>
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
