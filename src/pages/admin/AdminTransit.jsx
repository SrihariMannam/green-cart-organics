import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatKg, formatDateTime } from '../../utils/formatters';
import {
  ArrowRightLeft,
  Tractor,
  Truck,
  Building2,
  Bike,
  UserCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AdminTransit = () => {
  const { orders } = useApp();

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Supply Chain & Multi-Node Transit Tracking"
        subtitle="End-to-End Handshake: Farmer → Collection Truck → City Hub → 2-Wheeler Agent → Customer"
        breadcrumb={['Admin Portal', 'Transit & Supply Chain']}
      />

      <div className="px-6 space-y-6">
        {/* Visual Supply Chain Stage Header */}
        <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-lime-300 block mb-2">
            5-Stage Physical Supply Chain Topology
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-center">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
              <Tractor className="w-5 h-5 text-lime-400 mx-auto mb-1" />
              <div className="font-extrabold text-xs">1. Regional Farm</div>
              <span className="text-[10px] text-slate-300">Harvest & Weighing</span>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
              <Truck className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="font-extrabold text-xs">2. Collection Truck</div>
              <span className="text-[10px] text-slate-300">Rural EV Corridor</span>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
              <Building2 className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
              <div className="font-extrabold text-xs">3. Central City Hub</div>
              <span className="text-[10px] text-slate-300">QC, Sorting & Packing</span>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
              <Bike className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="font-extrabold text-xs">4. 2-Wheeler Agent</div>
              <span className="text-[10px] text-slate-300">Doorstep Express</span>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
              <UserCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="font-extrabold text-xs">5. Customer Home</div>
              <span className="text-[10px] text-slate-300">OTP Verified Handover</span>
            </div>
          </div>
        </div>

        {/* Detailed Multi-Stage Transit Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-forest-700" />
              End-to-End Consignment Quantity Audit
            </h3>
            <span className="text-xs text-slate-400">Auditing loss & shortage across handovers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-4">Truck Driver</th>
                  <th className="py-3 px-4 text-center">Ordered</th>
                  <th className="py-3 px-4 text-center">Collected</th>
                  <th className="py-3 px-4 text-center">QC Pass / Rej</th>
                  <th className="py-3 px-4">2-Wheeler Agent</th>
                  <th className="py-3 px-4 text-right">Current Location & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{order.id}</td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {order.assignedFarmerId ? (
                          <span className="font-medium text-slate-900">
                            {order.assignedFarmerId === 'farmer-1' ? 'Ramesh Patel' : 'Suresh Kumar'}
                          </span>
                        ) : (
                          <span className="text-amber-700 italic">Unclaimed</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {order.pickupRecord ? (
                          <span>{order.pickupRecord.driverName || 'Mahesh Rao'}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {formatKg(order.totalWeightKg)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-forest-800">
                        {order.pickupRecord ? formatKg(order.pickupRecord.collectedKg) : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {order.qualityInspection ? (
                          <span className="text-teal-800 font-bold">
                            {formatKg(order.qualityInspection.acceptedKg)} / {formatKg(order.qualityInspection.rejectedKg)}
                          </span>
                        ) : (
                          <span className="text-slate-400">Pending QC</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {order.deliveryAssignment ? (
                          <span className="font-semibold text-slate-900">
                            {order.deliveryAssignment.agentName || 'Arun Nair'}
                          </span>
                        ) : (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <StatusBadge status={order.fulfillmentStatus} type="fulfillment" size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
