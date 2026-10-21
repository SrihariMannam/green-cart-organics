import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatKg } from '../../utils/formatters';
import {
  Bike,
  Package,
  CheckCircle,
  MapPin,
  Clock,
  Banknote,
  ArrowRight
} from 'lucide-react';

export const DeliveryDashboard = () => {
  const { orders, users, activeProfileId } = useApp();

  const currentAgent =
    users.deliveryAgents.find((a) => a.id === activeProfileId) ||
    users.deliveryAgents[0];

  const assignedOrders = orders.filter((o) =>
    ['ASSIGNED_TO_DELIVERY', 'OUT_FOR_DELIVERY'].includes(o.fulfillmentStatus)
  );

  const outForDeliveryOrders = orders.filter(
    (o) => o.fulfillmentStatus === 'OUT_FOR_DELIVERY'
  );

  const completedToday = orders.filter(
    (o) => o.fulfillmentStatus === 'DELIVERED'
  );

  const totalAssignedWeight = assignedOrders.reduce(
    (acc, o) => acc + (o.packingRecord?.packageWeightKg || o.totalWeightKg || 0),
    0
  );

  const totalCodToCollect = assignedOrders
    .filter((o) => o.paymentMethod === 'COD')
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={`Rider Console: ${currentAgent.name}`}
        subtitle={`${currentAgent.vehicle} · Zone: ${currentAgent.zone}`}
        breadcrumb={['Delivery Agent', 'Dashboard']}
      />

      <div className="px-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Assigned Deliveries"
            value={assignedOrders.length}
            subtitle="Ready for doorstep transit"
            icon={Package}
            color="cyan"
            badge="Today's Run"
            badgeColor="bg-cyan-100 text-cyan-800"
          />
          <StatCard
            title="Active on Road"
            value={outForDeliveryOrders.length}
            subtitle="En route to customer"
            icon={Bike}
            color="amber"
          />
          <StatCard
            title="Completed Deliveries"
            value={completedToday.length}
            subtitle="Successful OTP handovers"
            icon={CheckCircle}
            color="forest"
          />
          <StatCard
            title="Pending COD Cash"
            value={formatCurrency(totalCodToCollect)}
            subtitle="To collect upon delivery"
            icon={Banknote}
            color="blue"
          />
        </div>

        {/* Assigned Packages Preview & Quick Action */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">
              My Assigned Deliveries Queue ({assignedOrders.length})
            </h3>
            <Link
              to="/delivery-agent/packages"
              className="text-xs font-bold text-cyan-700 hover:text-cyan-800"
            >
              Full Dispatch Queue →
            </Link>
          </div>

          {assignedOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No packages assigned currently. Once City Hub staff packs orders and assigns your route, they appear here.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {assignedOrders.map((order) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900">{order.id}</span>
                      <StatusBadge status={order.fulfillmentStatus} type="fulfillment" size="sm" />
                      <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
                    </div>
                    <div className="text-slate-800 font-semibold mt-1">
                      Customer: {order.customer.name} ({order.customer.phone})
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {order.customer.address}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-extrabold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {formatKg(order.packingRecord?.packageWeightKg || order.totalWeightKg)}
                      </span>
                    </div>

                    <Link
                      to="/delivery-agent/packages"
                      className="px-3.5 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs transition shadow-xs"
                    >
                      {order.fulfillmentStatus === 'OUT_FOR_DELIVERY' ? 'Enter OTP' : 'Start Run'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
