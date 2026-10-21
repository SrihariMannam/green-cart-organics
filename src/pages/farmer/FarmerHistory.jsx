import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatKg, formatDateTime } from '../../utils/formatters';
import { History, CheckCircle2 } from 'lucide-react';

export const FarmerHistory = () => {
  const { orders, users, activeProfileId } = useApp();

  const currentFarmer =
    users.farmers.find((f) => f.id === activeProfileId) || users.farmers[0];

  const historicalOrders = orders.filter(
    (o) => o.assignedFarmerId === activeProfileId
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Supply History & Batch Archives"
        subtitle={`Audit logs of all produce fulfilled by ${currentFarmer.farmName}`}
        breadcrumb={['Farmer Portal', 'Supply History']}
      />

      <div className="px-6 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Accepted Date</th>
                  <th className="py-3 px-4">Produce Items</th>
                  <th className="py-3 px-4 text-center">Harvested Weight</th>
                  <th className="py-3 px-4">Revenue</th>
                  <th className="py-3 px-4 text-right">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historicalOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{o.id}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDateTime(o.farmerAcceptedAt)}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {o.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-forest-800">
                      {formatKg(o.actualPreparedKg || o.totalWeightKg)}
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      {formatCurrency(o.itemSubtotal)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <StatusBadge status={o.fulfillmentStatus} type="fulfillment" size="sm" />
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
