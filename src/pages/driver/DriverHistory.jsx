import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatKg, formatDateTime } from '../../utils/formatters';
import { History, CheckCircle } from 'lucide-react';

export const DriverHistory = () => {
  const { orders, users, activeProfileId } = useApp();

  const currentDriver =
    users.collectionDrivers.find((d) => d.id === activeProfileId) ||
    users.collectionDrivers[0];

  const completedPickups = orders.filter((o) => o.pickupRecord);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Trip & Cargo Transit History"
        subtitle={`Audit logs for ${currentDriver.vehicleModel} (${currentDriver.vehicleNumber})`}
        breadcrumb={['Collection Driver', 'Trip History']}
      />

      <div className="px-6 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Pickup ID</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Collected Date & Time</th>
                  <th className="py-3 px-4 text-center">Weighed Cargo</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4 text-right">Current Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedPickups.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {o.pickupRecord?.pickupId || 'PKP-HIST'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{o.id}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDateTime(o.pickupRecord?.collectedAt)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-forest-800">
                      {formatKg(o.pickupRecord?.collectedKg || o.totalWeightKg)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-xs">
                      {o.pickupRecord?.condition || 'Inspected Good'}
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
