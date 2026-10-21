import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatKg, formatDateTime } from '../../utils/formatters';
import { Calendar, Truck, MapPin, Clock } from 'lucide-react';

export const DriverSchedule = () => {
  const { orders, users, activeProfileId } = useApp();

  const currentDriver =
    users.collectionDrivers.find((d) => d.id === activeProfileId) ||
    users.collectionDrivers[0];

  const scheduledOrders = orders.filter((o) =>
    ['READY_FOR_PICKUP', 'PICKED_UP', 'RECEIVED_AT_HUB'].includes(
      o.fulfillmentStatus
    )
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Today's Pickup Schedule"
        subtitle={`Farm dispatch timetable for ${currentDriver.vehicleModel} (${currentDriver.vehicleNumber})`}
        breadcrumb={['Collection Driver', 'Pickup Schedule']}
      />

      <div className="px-6 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Stop #</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Farm / Location</th>
                  <th className="py-3 px-4">Produce Details</th>
                  <th className="py-3 px-4 text-center">Allocated Weight</th>
                  <th className="py-3 px-4">Scheduled Slot</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scheduledOrders.map((order, idx) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-amber-700">Stop {idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{order.id}</td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-semibold text-slate-900">
                        {order.assignedFarmerId === 'farmer-1' ? 'Patel Organic Farms' : 'Cauvery Bio Valley'}
                      </div>
                      <span className="text-[10px] text-slate-400">Mandya Rural, Karnataka</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {order.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-forest-800">
                      {formatKg(order.actualPreparedKg || order.totalWeightKg)}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {10 + idx}:30 AM - {11 + idx}:15 AM
                    </td>
                    <td className="py-3 px-4 text-right">
                      <StatusBadge status={order.fulfillmentStatus} type="fulfillment" size="sm" />
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
