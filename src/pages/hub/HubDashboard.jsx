import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatKg, formatDateTime } from '../../utils/formatters';
import {
  Truck,
  FileCheck2,
  PackageCheck,
  Send,
  Boxes,
  Scale,
  Building2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const HubDashboard = () => {
  const { orders, users } = useApp();
  const hubStaff = users.cityHubStaff;

  const incomingShipments = orders.filter((o) =>
    ['PICKED_UP', 'RECEIVED_AT_HUB'].includes(o.fulfillmentStatus)
  );

  const awaitingInspection = orders.filter(
    (o) => o.fulfillmentStatus === 'RECEIVED_AT_HUB'
  );

  const awaitingPacking = orders.filter(
    (o) => o.fulfillmentStatus === 'QUALITY_CHECKED'
  );

  const packedAwaitingDispatch = orders.filter(
    (o) => o.fulfillmentStatus === 'PACKED'
  );

  const activeDeliveries = orders.filter((o) =>
    ['ASSIGNED_TO_DELIVERY', 'OUT_FOR_DELIVERY'].includes(o.fulfillmentStatus)
  );

  const totalKgReceived = orders
    .filter((o) => o.hubReceipt || o.qualityInspection)
    .reduce((acc, o) => acc + (o.hubReceipt?.receivedKg || o.totalWeightKg || 0), 0);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={hubStaff.hubName}
        subtitle={`${hubStaff.location} · Manager: ${hubStaff.name}`}
        breadcrumb={['City Hub Staff', 'Dashboard']}
      />

      <div className="px-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Truck Shipments"
            value={incomingShipments.length}
            subtitle="From rural farm clusters"
            icon={Truck}
            color="indigo"
          />
          <StatCard
            title="Pending QC"
            value={awaitingInspection.length}
            subtitle="Firmness & Brix tests"
            icon={FileCheck2}
            color="teal"
            badge={awaitingInspection.length > 0 ? 'Urgent QC' : null}
            badgeColor="bg-teal-100 text-teal-800"
          />
          <StatCard
            title="Awaiting Packing"
            value={awaitingPacking.length}
            subtitle="Approved produce"
            icon={PackageCheck}
            color="cyan"
          />
          <StatCard
            title="Packed for 2-Wheel"
            value={packedAwaitingDispatch.length}
            subtitle="Ready for dispatch"
            icon={Send}
            color="amber"
          />
          <StatCard
            title="Out for Delivery"
            value={activeDeliveries.length}
            subtitle="On 2-wheeler scooters"
            icon={Boxes}
            color="forest"
          />
          <StatCard
            title="Total Handled"
            value={formatKg(totalKgReceived + 450)}
            subtitle="Certified organic yield"
            icon={Scale}
            color="blue"
          />
        </div>

        {/* Quick Workflow Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/city-hub/quality"
            className="p-5 rounded-2xl bg-teal-50 border border-teal-200 hover:border-teal-300 hover:shadow-md transition flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-teal-600 text-white rounded-xl shadow-sm">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-teal-950 text-sm">Quality Assurance Station</h4>
                <p className="text-xs text-teal-700 mt-0.5">
                  {awaitingInspection.length} batch(es) awaiting inspection
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/city-hub/packing"
            className="p-5 rounded-2xl bg-cyan-50 border border-cyan-200 hover:border-cyan-300 hover:shadow-md transition flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-cyan-600 text-white rounded-xl shadow-sm">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-cyan-950 text-sm">Packaging & Labeling</h4>
                <p className="text-xs text-cyan-700 mt-0.5">
                  {awaitingPacking.length} order(s) ready to pack
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/city-hub/dispatch"
            className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 hover:border-indigo-300 hover:shadow-md transition flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-sm">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-indigo-950 text-sm">2-Wheeler Dispatch</h4>
                <p className="text-xs text-indigo-700 mt-0.5">
                  {packedAwaitingDispatch.length} package(s) ready to assign
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Live Shipments Table */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">
              Active Hub Consignments & Lifecycle
            </h3>
            <span className="text-xs text-slate-400">Synchronized via browser localStorage</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {orders.slice(0, 6).map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-900">{order.id}</span>
                    <StatusBadge status={order.fulfillmentStatus} type="fulfillment" size="sm" />
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Produce: {order.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Locality: {order.customer.locality} · Total: {formatKg(order.actualPreparedKg || order.totalWeightKg)}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {order.fulfillmentStatus === 'RECEIVED_AT_HUB' && (
                    <Link
                      to="/city-hub/quality"
                      className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 transition"
                    >
                      Inspect Now
                    </Link>
                  )}
                  {order.fulfillmentStatus === 'QUALITY_CHECKED' && (
                    <Link
                      to="/city-hub/packing"
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white font-bold hover:bg-cyan-700 transition"
                    >
                      Pack Box
                    </Link>
                  )}
                  {order.fulfillmentStatus === 'PACKED' && (
                    <Link
                      to="/city-hub/dispatch"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                    >
                      Assign Rider
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
