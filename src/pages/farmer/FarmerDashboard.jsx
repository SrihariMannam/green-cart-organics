import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatKg, formatDateTime } from '../../utils/formatters';
import {
  Inbox,
  CheckCircle,
  Clock,
  Truck,
  Scale,
  Wallet,
  ArrowRight,
  Tractor,
  Boxes
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { orders, users, activeProfileId } = useApp();

  const currentFarmer = users.farmers.find((f) => f.id === activeProfileId) || users.farmers[0];

  // Derive metrics from real shared orders in localStorage
  const incomingUnassignedOrders = orders.filter(
    (o) => o.fulfillmentStatus === 'CONFIRMED' && !o.assignedFarmerId
  );

  const myAcceptedOrders = orders.filter(
    (o) => o.assignedFarmerId === activeProfileId
  );

  const pendingHarvestOrders = myAcceptedOrders.filter(
    (o) => o.fulfillmentStatus === 'FARMER_ACCEPTED'
  );

  const readyForPickupOrders = myAcceptedOrders.filter(
    (o) => o.fulfillmentStatus === 'READY_FOR_PICKUP'
  );

  const completedOrders = myAcceptedOrders.filter(
    (o) => o.fulfillmentStatus === 'DELIVERED'
  );

  const totalKgSupplied = myAcceptedOrders.reduce(
    (acc, o) => acc + (o.actualPreparedKg || o.totalWeightKg || 0),
    0
  );

  const estimatedEarnings = myAcceptedOrders.reduce(
    (acc, o) => acc + (o.itemSubtotal || 0),
    0
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={`Welcome back, ${currentFarmer.name}`}
        subtitle={`${currentFarmer.farmName} · ${currentFarmer.location} · Active Organic Producer`}
        breadcrumb={['Farmer Portal', 'Dashboard']}
      />

      <div className="px-6 space-y-6">
        {/* KPI Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Incoming Requests"
            value={incomingUnassignedOrders.length}
            subtitle="Open for claim"
            icon={Inbox}
            color="amber"
            badge="First-Come Claim"
            badgeColor="bg-amber-100 text-amber-800"
          />
          <StatCard
            title="My Accepted Orders"
            value={myAcceptedOrders.length}
            subtitle="Claimed orders"
            icon={CheckCircle}
            color="forest"
          />
          <StatCard
            title="Pending Harvest"
            value={pendingHarvestOrders.length}
            subtitle="Awaiting weighing"
            icon={Clock}
            color="purple"
          />
          <StatCard
            title="Ready for Pickup"
            value={readyForPickupOrders.length}
            subtitle="Trucks dispatched"
            icon={Truck}
            color="cyan"
          />
          <StatCard
            title="Total Supplied"
            value={formatKg(totalKgSupplied + currentFarmer.totalSuppliedKg)}
            subtitle="Organic produce"
            icon={Scale}
            color="blue"
          />
          <StatCard
            title="Est. Earnings"
            value={formatCurrency(estimatedEarnings + currentFarmer.totalEarnings)}
            subtitle="Direct farm credit"
            icon={Wallet}
            color="forest"
          />
        </div>

        {/* Action Callout if there are open incoming requests */}
        {incomingUnassignedOrders.length > 0 && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Attention Required
              </span>
              <h3 className="text-lg font-black tracking-tight">
                {incomingUnassignedOrders.length} new customer order request(s) awaiting claim!
              </h3>
              <p className="text-xs text-amber-100 max-w-xl">
                Orders operate on a first-come, first-served basis. Review requested produce in your catchment and claim the harvest to secure farmer quota.
              </p>
            </div>
            <Link
              to="/farmer/incoming"
              className="px-5 py-3 rounded-xl bg-white text-amber-900 font-extrabold text-xs shadow-md hover:bg-amber-50 active:scale-95 transition shrink-0"
            >
              View & Claim Orders →
            </Link>
          </div>
        )}

        {/* Two Columns: Recent Claimed Orders & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Recent Orders */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Recent Orders & Harvest Status
              </h3>
              <Link
                to="/farmer/accepted"
                className="text-xs font-bold text-forest-700 hover:text-forest-800"
              >
                View All ({myAcceptedOrders.length}) →
              </Link>
            </div>

            {myAcceptedOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                You haven't claimed any orders yet. Check Incoming Orders to claim requests.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myAcceptedOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="py-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-900">{order.id}</span>
                        <StatusBadge status={order.fulfillmentStatus} type="fulfillment" size="sm" />
                      </div>
                      <div className="text-slate-500 mt-1">
                        {order.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Area: {order.customer.locality} · Ordered at: {formatDateTime(order.orderDate)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {formatCurrency(order.itemSubtotal)}
                      </div>
                      <span className="text-[11px] text-forest-700 font-semibold">
                        {formatKg(order.actualPreparedKg || order.totalWeightKg)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Farm Profile & Produce Specialities */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xl">
                  🌾
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{currentFarmer.farmName}</h4>
                  <p className="text-xs text-slate-500">{currentFarmer.location}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Distance to Central Hub:</span>
                  <span className="font-semibold text-slate-800">{currentFarmer.distanceToHub}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-semibold text-slate-800">{currentFarmer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Farmer Rating:</span>
                  <span className="font-bold text-amber-600">★ {currentFarmer.rating} / 5.0</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Produce Varieties
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentFarmer.produceTypes.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-0.5 rounded-md bg-forest-50 text-forest-800 border border-forest-200 text-[11px] font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
