import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatKg, formatDateTime } from '../../utils/formatters';
import {
  ShieldCheck,
  Users,
  Tractor,
  Truck,
  Building2,
  Bike,
  Inbox,
  CheckCircle2,
  Scale,
  Wallet,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { orders, users, products, resetDemoData } = useApp();
  const [showResetModal, setShowResetModal] = useState(false);

  // Derive LIVE statistics directly from localStorage records
  const totalOrders = orders.length;
  const confirmedAwaitingFarmer = orders.filter(
    (o) => o.fulfillmentStatus === 'CONFIRMED' && !o.assignedFarmerId
  ).length;
  const farmerAcceptedCount = orders.filter(
    (o) => o.fulfillmentStatus === 'FARMER_ACCEPTED'
  ).length;
  const readyForCollectionCount = orders.filter(
    (o) => o.fulfillmentStatus === 'READY_FOR_PICKUP'
  ).length;
  const inTransitToHubCount = orders.filter(
    (o) => o.fulfillmentStatus === 'PICKED_UP'
  ).length;
  const receivedAtHubCount = orders.filter(
    (o) => o.fulfillmentStatus === 'RECEIVED_AT_HUB'
  ).length;
  const awaitingPackingCount = orders.filter(
    (o) => o.fulfillmentStatus === 'QUALITY_CHECKED'
  ).length;
  const packedAwaitingDispatch = orders.filter(
    (o) => o.fulfillmentStatus === 'PACKED'
  ).length;
  const assignedToRiderCount = orders.filter(
    (o) => o.fulfillmentStatus === 'ASSIGNED_TO_DELIVERY'
  ).length;
  const outForDeliveryCount = orders.filter(
    (o) => o.fulfillmentStatus === 'OUT_FOR_DELIVERY'
  ).length;
  const deliveredCount = orders.filter(
    (o) => o.fulfillmentStatus === 'DELIVERED'
  ).length;

  const totalOrderedKg = orders.reduce((acc, o) => acc + (o.totalWeightKg || 0), 0);
  const totalCollectedKg = orders
    .filter((o) => o.pickupRecord)
    .reduce((acc, o) => acc + (o.pickupRecord.collectedKg || o.totalWeightKg || 0), 0);
  const totalDeliveredKg = orders
    .filter((o) => o.fulfillmentStatus === 'DELIVERED')
    .reduce((acc, o) => acc + (o.totalWeightKg || 0), 0);

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalOutstandingCod = orders
    .filter((o) => o.paymentMethod === 'COD' && o.paymentStatus === 'PENDING_ON_DELIVERY')
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Operations Control Center"
        subtitle="End-to-End Farm-to-Home Live Supply Chain Intelligence"
        breadcrumb={['Admin Portal', 'Executive Dashboard']}
      />

      <div className="px-6 space-y-6">
        {/* Top Control Strip with Reset Demo */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800">
                Supply Chain Status: 100% Operational
              </span>
              <p className="text-[11px] text-slate-500">
                Connected: 3 Farm Catchments · 2 EV Trucks · 1 Central Hub · 2 Delivery Riders
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowResetModal(true)}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Demo Data</span>
            </button>
          </div>
        </div>

        {/* 1. Core KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue (Demo)"
            value={formatCurrency(totalRevenue)}
            subtitle={`Outstanding COD: ${formatCurrency(totalOutstandingCod)}`}
            icon={Wallet}
            color="forest"
          />
          <StatCard
            title="Ordered Volume"
            value={formatKg(totalOrderedKg)}
            subtitle={`Collected: ${formatKg(totalCollectedKg)}`}
            icon={Scale}
            color="blue"
          />
          <StatCard
            title="Total Platform Orders"
            value={totalOrders}
            subtitle={`${deliveredCount} Delivered · ${totalOrders - deliveredCount} In Progress`}
            icon={Inbox}
            color="purple"
          />
          <StatCard
            title="Supply Chain Nodes"
            value="8 Active Entities"
            subtitle="3 Farmers · 2 Trucks · 1 Hub · 2 Riders"
            icon={Tractor}
            color="amber"
          />
        </div>

        {/* 2. Detailed 10-Stage Pipeline Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Real-Time Supply Chain Fulfillment Pipeline
              </h3>
              <p className="text-xs text-slate-500">
                Dynamic counts calculated in real-time from orders stored in localStorage
              </p>
            </div>
            <Link
              to="/admin/transit"
              className="text-xs font-bold text-purple-700 hover:text-purple-800"
            >
              Supply Chain Map →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">1. Open Claim</span>
              <div className="text-xl font-black text-amber-700 mt-1">{confirmedAwaitingFarmer}</div>
              <span className="text-[10px] text-slate-500">Awaiting Farmer</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">2. Accepted</span>
              <div className="text-xl font-black text-blue-700 mt-1">{farmerAcceptedCount}</div>
              <span className="text-[10px] text-slate-500">Harvest Prep</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">3. Ready Farm</span>
              <div className="text-xl font-black text-lime-700 mt-1">{readyForCollectionCount}</div>
              <span className="text-[10px] text-slate-500">For EV Truck</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">4. Truck Transit</span>
              <div className="text-xl font-black text-purple-700 mt-1">{inTransitToHubCount}</div>
              <span className="text-[10px] text-slate-500">Moving to Hub</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">5. Hub QC</span>
              <div className="text-xl font-black text-teal-700 mt-1">{receivedAtHubCount + awaitingPackingCount}</div>
              <span className="text-[10px] text-slate-500">Inspecting</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">6. Packed</span>
              <div className="text-xl font-black text-cyan-700 mt-1">{packedAwaitingDispatch}</div>
              <span className="text-[10px] text-slate-500">Eco-Crates</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">7. Out for Delivery</span>
              <div className="text-xl font-black text-orange-600 mt-1">{assignedToRiderCount + outForDeliveryCount}</div>
              <span className="text-[10px] text-slate-500">2-Wheeler Rider</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">8. Delivered</span>
              <div className="text-xl font-black text-emerald-800 mt-1">{deliveredCount}</div>
              <span className="text-[10px] text-emerald-700">Completed</span>
            </div>
          </div>
        </div>

        {/* 3. Recent Incoming & Operational Orders stream */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base">
              Latest Live Orders ({orders.length})
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-forest-700 hover:text-forest-800"
            >
              Manage All Orders Table →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Produce Details</th>
                  <th className="py-3 px-4 text-center">Weight</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{order.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{order.customer.name}</div>
                      <span className="text-[10px] text-slate-400">{order.customer.locality}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-xs">
                      {order.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-forest-800">
                      {formatKg(order.totalWeightKg)}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
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

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">
                Reset Demo Database?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                This will clear all localStorage keys and reinitialize the factory catalog, initial users, sample orders, and audit logs.
              </p>
            </div>
            <div className="flex justify-center space-x-2 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetModal(false);
                }}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
