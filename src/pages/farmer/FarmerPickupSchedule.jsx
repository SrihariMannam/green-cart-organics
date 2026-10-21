import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatKg, formatDateTime } from '../../utils/formatters';
import { Calendar, Truck, Clock, MapPin, CheckCircle } from 'lucide-react';

export const FarmerPickupSchedule = () => {
  const { orders, users, activeProfileId } = useApp();

  const currentFarmer =
    users.farmers.find((f) => f.id === activeProfileId) || users.farmers[0];

  // Pickups for this farmer that are either ready for pickup or already collected
  const pickups = orders.filter(
    (o) =>
      o.assignedFarmerId === activeProfileId &&
      ['READY_FOR_PICKUP', 'PICKED_UP', 'RECEIVED_AT_HUB', 'DELIVERED'].includes(
        o.fulfillmentStatus
      )
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="EV Truck Pickup Schedule"
        subtitle={`Scheduled farm-gate collections for ${currentFarmer.farmName}`}
        breadcrumb={['Farmer Portal', 'Pickup Schedule']}
      />

      <div className="px-6 space-y-6">
        {pickups.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No scheduled pickups yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              When you mark accepted orders as "Ready for Pickup", collection trucks are scheduled automatically.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Pickup / Order ID</th>
                    <th className="py-3 px-4">Produce Details</th>
                    <th className="py-3 px-4 text-center">Harvest Weight</th>
                    <th className="py-3 px-4">Assigned Vehicle</th>
                    <th className="py-3 px-4">Scheduled Slot</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pickups.map((order) => {
                    const isReady = order.fulfillmentStatus === 'READY_FOR_PICKUP';
                    const driver = users.collectionDrivers[0];

                    return (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">{order.id}</div>
                          <span className="text-[10px] text-slate-400">
                            {order.pickupRecord?.pickupId || 'PKP-AUTO-SCHED'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {order.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                        </td>
                        <td className="py-3 px-4 text-center font-extrabold text-forest-800 text-sm">
                          {formatKg(order.actualPreparedKg || order.totalWeightKg)}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div className="font-semibold text-slate-900">
                            {order.pickupRecord?.driverName || driver.name}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {order.pickupRecord?.vehicleNumber || driver.vehicleNumber}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {isReady ? 'Today 11:30 AM - 12:30 PM' : formatDateTime(order.pickupRecord?.collectedAt)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <StatusBadge status={order.fulfillmentStatus} type="fulfillment" size="sm" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
