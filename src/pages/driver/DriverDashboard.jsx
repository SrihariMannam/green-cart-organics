import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatKg, formatDateTime } from '../../utils/formatters';
import {
  Truck,
  Calendar,
  ClipboardCheck,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DriverDashboard = () => {
  const { orders, users, activeProfileId } = useApp();

  const currentDriver =
    users.collectionDrivers.find((d) => d.id === activeProfileId) ||
    users.collectionDrivers[0];

  // Pickups ready for collection at farms
  const pendingPickups = orders.filter(
    (o) => o.fulfillmentStatus === 'READY_FOR_PICKUP'
  );

  // Pickups collected and currently in transit inside this truck
  const inTransitOrders = orders.filter(
    (o) => o.fulfillmentStatus === 'PICKED_UP'
  );

  // Completed truck deliveries to city hub
  const deliveredToHubOrders = orders.filter((o) =>
    ['RECEIVED_AT_HUB', 'QUALITY_CHECKED', 'PACKED', 'ASSIGNED_TO_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(
      o.fulfillmentStatus
    )
  );

  const totalKgInTruck = inTransitOrders.reduce(
    (acc, o) => acc + (o.pickupRecord?.collectedKg || o.totalWeightKg || 0),
    0
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={`Truck Operations: ${currentDriver.name}`}
        subtitle={`${currentDriver.vehicleModel} (${currentDriver.vehicleNumber}) · Capacity: ${currentDriver.capacityKg} kg`}
        breadcrumb={['Collection Driver', 'Dashboard']}
      />

      <div className="px-6 space-y-6">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Farm Pickups"
            value={pendingPickups.length}
            subtitle="Ready for truck loading"
            icon={Calendar}
            color="amber"
            badge="Action Needed"
            badgeColor="bg-amber-100 text-amber-800"
          />
          <StatCard
            title="In-Transit Cargo"
            value={formatKg(totalKgInTruck)}
            subtitle={`${inTransitOrders.length} active consignments`}
            icon={Truck}
            color="purple"
          />
          <StatCard
            title="Truck Load Factor"
            value={`${((totalKgInTruck / currentDriver.capacityKg) * 100).toFixed(0)}%`}
            subtitle={`of ${currentDriver.capacityKg} kg capacity`}
            icon={ClipboardCheck}
            color="blue"
          />
          <StatCard
            title="Completed Trips"
            value={currentDriver.totalTripsCompleted}
            subtitle="To Central Hub"
            icon={CheckCircle2}
            color="forest"
          />
        </div>

        {/* Route Overview Callout */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Assigned Collection Corridor
            </span>
            <h3 className="text-base font-extrabold">{currentDriver.allocatedRoute}</h3>
            <p className="text-xs text-amber-100">
              Optimal route generated with cold-chain EV efficiency. Temperature set to 14°C.
            </p>
          </div>
          <Link
            to="/collection-driver/route"
            className="px-5 py-2.5 bg-white text-amber-900 font-extrabold text-xs rounded-xl shadow-md hover:bg-amber-50 active:scale-95 transition shrink-0"
          >
            Open Route & Hub Delivery Action →
          </Link>
        </div>

        {/* Two Columns: Actionable Pickups & Truck Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Today's Collection Tasks
              </h3>
              <Link
                to="/collection-driver/pickups"
                className="text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                Verification Screen →
              </Link>
            </div>

            {pendingPickups.length === 0 && inTransitOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No active pickups pending collection. All scheduled produce has been moved to City Hub.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingPickups.concat(inTransitOrders).map((order) => (
                  <div key={order.id} className="py-3.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-900">{order.id}</span>
                        <StatusBadge status={order.fulfillmentStatus} type="fulfillment" size="sm" />
                      </div>
                      <div className="text-slate-600 mt-1">
                        Produce: {order.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Destination: {order.customer.locality} · Weight: {formatKg(order.actualPreparedKg || order.totalWeightKg)}
                      </div>
                    </div>

                    <div>
                      <Link
                        to="/collection-driver/pickups"
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition"
                      >
                        {order.fulfillmentStatus === 'READY_FOR_PICKUP' ? 'Verify & Load' : 'View Details'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Driver & Truck Spec Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Vehicle Telematics & Status
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-bold text-slate-800">{currentDriver.vehicleModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registration:</span>
                <span className="font-mono font-bold text-slate-900">{currentDriver.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payload Limit:</span>
                <span className="font-bold text-forest-800">{currentDriver.capacityKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bay Temperature:</span>
                <span className="font-bold text-cyan-700">14.2°C (Optimal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Driver Phone:</span>
                <span className="font-semibold text-slate-800">{currentDriver.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
