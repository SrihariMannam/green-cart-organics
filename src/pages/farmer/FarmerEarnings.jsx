import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatCard } from '../../components/common/StatCard';
import { formatCurrency, formatKg } from '../../utils/formatters';
import { Wallet, TrendingUp, CheckCircle, Clock, FileText } from 'lucide-react';

export const FarmerEarnings = () => {
  const { orders, users, activeProfileId } = useApp();

  const currentFarmer =
    users.farmers.find((f) => f.id === activeProfileId) || users.farmers[0];

  const myOrders = orders.filter((o) => o.assignedFarmerId === activeProfileId);
  const liveEarnings = myOrders.reduce((acc, o) => acc + (o.itemSubtotal || 0), 0);
  const totalKg = myOrders.reduce((acc, o) => acc + (o.actualPreparedKg || o.totalWeightKg || 0), 0);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Quota & Farmer Settlements"
        subtitle={`Live revenue and bank transfer ledger for ${currentFarmer.name}`}
        breadcrumb={['Farmer Portal', 'Quota & Earnings']}
      />

      <div className="px-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Revenue Settled"
            value={formatCurrency(currentFarmer.totalEarnings + liveEarnings)}
            subtitle="100% direct bank payout"
            icon={Wallet}
            color="forest"
          />
          <StatCard
            title="Active Harvest Weight"
            value={formatKg(currentFarmer.totalSuppliedKg + totalKg)}
            subtitle="Certified organic yield"
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            title="Current Settlement Cycle"
            value="T+1 Morning"
            subtitle="Direct NEFT / UPI Auto-credit"
            icon={CheckCircle}
            color="amber"
          />
        </div>

        {/* Breakdown Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-forest-700" />
            Produce Settlement Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Harvest Volume</th>
                  <th className="py-3 px-4">Gross Value</th>
                  <th className="py-3 px-4">Platform Fee (0%)</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4 text-right">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{o.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {formatKg(o.actualPreparedKg || o.totalWeightKg)}
                    </td>
                    <td className="py-3 px-4">{formatCurrency(o.itemSubtotal)}</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">₹0.00 (Direct Sourcing)</td>
                    <td className="py-3 px-4 font-black text-forest-900">
                      {formatCurrency(o.itemSubtotal)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {o.fulfillmentStatus === 'DELIVERED' ? 'Settled to Bank' : 'In Processing'}
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
