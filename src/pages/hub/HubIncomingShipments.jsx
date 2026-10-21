import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatKg, formatDateTime } from '../../utils/formatters';
import { Truck, CheckCircle2, Clock, Building2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HubIncomingShipments = () => {
  const { orders, confirmDeliveryToHub, showToast } = useApp();

  const shipments = orders.filter((o) =>
    ['PICKED_UP', 'RECEIVED_AT_HUB', 'QUALITY_CHECKED', 'PACKED', 'ASSIGNED_TO_DELIVERY', 'DELIVERED'].includes(
      o.fulfillmentStatus
    )
  );

  const [dockBay, setDockBay] = useState('Dock Bay 3 (Cold Insulated)');

  const handleConfirmReceipt = (orderId) => {
    confirmDeliveryToHub(orderId, {
      bayNumber: dockBay,
      receivedBy: 'hub-1',
    });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Incoming Truck Shipments & Dock Receipts"
        subtitle="Arrival logs for EV rural collection trucks at Peenya Hub"
        breadcrumb={['City Hub Staff', 'Incoming Shipments']}
      />

      <div className="px-6 space-y-6">
        {shipments.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No shipments recorded yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Once Collection Drivers verify farm pickups, incoming shipments will register here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                Consignments Inbound & Docked ({shipments.length})
              </span>
              <span className="text-xs text-slate-400">All produce inspected upon gate entry</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Shipment / Order ID</th>
                    <th className="py-3 px-4">Collection Driver</th>
                    <th className="py-3 px-4">Farm Source</th>
                    <th className="py-3 px-4 text-center">Expected (kg)</th>
                    <th className="py-3 px-4 text-center">Received (kg)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Dock Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((order) => {
                    const isEnRoute = order.fulfillmentStatus === 'PICKED_UP';
                    const isDocked = order.fulfillmentStatus === 'RECEIVED_AT_HUB';

                    return (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">{order.id}</div>
                          <span className="text-[10px] text-slate-400">
                            {order.pickupRecord?.pickupId || 'PKP-DIRECT'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <div className="font-semibold text-slate-900">
                            {order.pickupRecord?.driverName || 'Driver Mahesh Rao'}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {order.pickupRecord?.vehicleNumber || 'Tata Ace EV'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {order.assignedFarmerId === 'farmer-1' ? 'Patel Organic Farms' : 'Cauvery Bio Valley'}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-600">
                          {formatKg(order.actualPreparedKg || order.totalWeightKg)}
                        </td>
                        <td className="py-3 px-4 text-center font-black text-forest-800">
                          {formatKg(order.pickupRecord?.collectedKg || order.actualPreparedKg || order.totalWeightKg)}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={order.fulfillmentStatus} type="fulfillment" size="sm" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isEnRoute ? (
                            <button
                              onClick={() => handleConfirmReceipt(order.id)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                            >
                              Confirm Gate Receipt
                            </button>
                          ) : isDocked ? (
                            <Link
                              to="/city-hub/quality"
                              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition"
                            >
                              Proceed to QC →
                            </Link>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold">
                              Receipt Acknowledged
                            </span>
                          )}
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
