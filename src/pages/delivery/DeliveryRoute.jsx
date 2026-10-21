import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatKg } from '../../utils/formatters';
import { MapPin, Navigation, Bike, CheckCircle2, Phone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DeliveryRoute = () => {
  const { orders, users, activeProfileId } = useApp();

  const currentAgent =
    users.deliveryAgents.find((a) => a.id === activeProfileId) ||
    users.deliveryAgents[0];

  const assignedDeliveries = orders.filter((o) =>
    ['ASSIGNED_TO_DELIVERY', 'OUT_FOR_DELIVERY'].includes(o.fulfillmentStatus)
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Delivery Route & Stop Sequence"
        subtitle={`Zone: ${currentAgent.zone} · ${assignedDeliveries.length} stops on active route`}
        breadcrumb={['Delivery Agent', 'Route & Navigation']}
      />

      <div className="px-6 space-y-6">
        {assignedDeliveries.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <Navigation className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No active delivery stops</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your route is currently clear. Dispatched packages will populate your route sequence here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedDeliveries.map((order, idx) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-cyan-600/20">
                    {idx + 1}
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{order.customer.name}</span>
                      <StatusBadge status={order.fulfillmentStatus} type="fulfillment" size="sm" />
                    </div>
                    <div className="text-slate-600 font-medium">{order.customer.address}</div>
                    <div className="text-slate-400 text-[11px] flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {order.customer.phone}
                      </span>
                      <span>·</span>
                      <span>Weight: {formatKg(order.packingRecord?.packageWeightKg || order.totalWeightKg)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${order.customer.address}, ${order.customer.locality}, Bengaluru`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Maps</span>
                  </a>

                  <Link
                    to="/delivery-agent/packages"
                    className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-xs transition"
                  >
                    Confirm Delivery
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
