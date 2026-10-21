import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { formatCurrency, formatKg, formatDateTime } from '../../utils/formatters';
import { Tractor, MapPin, Phone, Star, CheckCircle, Scale } from 'lucide-react';

export const AdminFarmers = () => {
  const { users, orders } = useApp();

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Regional Farmer Partners & Supply Catchments"
        subtitle="Sourcing quotas, farm locations, harvest commitments, and acceptance timestamps"
        breadcrumb={['Admin Portal', 'Farmers']}
      />

      <div className="px-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {users.farmers.map((farmer) => {
            const acceptedOrders = orders.filter((o) => o.assignedFarmerId === farmer.id);
            const liveKg = acceptedOrders.reduce(
              (acc, o) => acc + (o.actualPreparedKg || o.totalWeightKg || 0),
              0
            );

            return (
              <div
                key={farmer.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xl shrink-0">
                    🌾
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{farmer.name}</h3>
                    <p className="text-slate-500 font-medium">{farmer.farmName}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <strong className="text-slate-800">{farmer.location}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hub Distance:</span>
                    <span className="font-semibold text-slate-700">{farmer.distanceToHub}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-semibold text-slate-700">{farmer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Claimed Orders:</span>
                    <span className="font-bold text-forest-800">{acceptedOrders.length} orders</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Supplied Volume:</span>
                    <span className="font-black text-forest-900 text-sm">
                      {formatKg(farmer.totalSuppliedKg + liveKg)}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Crops Supplied
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {farmer.produceTypes.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {farmer.rating} / 5.0
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Certified Organic Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Claim Audit Trail */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Farmer Order Claim Audit Trail (First-Come, First-Served Verification)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Assigned Farmer</th>
                  <th className="py-2.5 px-3">Claim Timestamp</th>
                  <th className="py-2.5 px-3 text-center">Committed Weight</th>
                  <th className="py-2.5 px-3 text-right">Preparation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders
                  .filter((o) => o.assignedFarmerId)
                  .map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{o.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {o.assignedFarmerId === 'farmer-1' ? 'Ramesh Patel (Patel Organic)' : 'Suresh Kumar (Cauvery Bio)'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{formatDateTime(o.farmerAcceptedAt)}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-forest-800">
                        {formatKg(o.actualPreparedKg || o.totalWeightKg)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-100 text-lime-900">
                          {o.fulfillmentStatus}
                        </span>
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
