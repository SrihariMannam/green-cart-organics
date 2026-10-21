import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatKg, formatDateTime } from '../../utils/formatters';
import { Wallet, Banknote, CreditCard, ShieldCheck, TrendingUp } from 'lucide-react';

export const AdminPayments = () => {
  const { orders, users } = useApp();

  const totalVolume = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const upiPrepaidVolume = orders
    .filter((o) => o.paymentMethod === 'UPI')
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const codCollectedVolume = orders
    .filter((o) => o.paymentMethod === 'COD' && o.paymentStatus === 'COLLECTED_ON_DELIVERY')
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const codPendingVolume = orders
    .filter((o) => o.paymentMethod === 'COD' && o.paymentStatus === 'PENDING_ON_DELIVERY')
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Quota, Supply Audits & Financial Ledger"
        subtitle="Simulated transactional reconciliation across Prepaid UPI and Doorstep Cash on Delivery"
        breadcrumb={['Admin Portal', 'Quota & Payments']}
      />

      <div className="px-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total GMV Volume"
            value={formatCurrency(totalVolume)}
            subtitle="All platform orders"
            icon={Wallet}
            color="forest"
          />
          <StatCard
            title="Prepaid UPI (Demo)"
            value={formatCurrency(upiPrepaidVolume)}
            subtitle="Instant bank settlement"
            icon={CreditCard}
            color="purple"
          />
          <StatCard
            title="COD Cash Collected"
            value={formatCurrency(codCollectedVolume)}
            subtitle="Deposited by riders"
            icon={Banknote}
            color="blue"
          />
          <StatCard
            title="Outstanding COD"
            value={formatCurrency(codPendingVolume)}
            subtitle="To collect at doorstep"
            icon={TrendingUp}
            color="amber"
          />
        </div>

        {/* Farmer Quota & Settlement Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Farmer Harvest Quota Allocations & Supply Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Farmer Partner</th>
                  <th className="py-2.5 px-3">Catchment Farm</th>
                  <th className="py-2.5 px-3 text-center">Allocated Quota</th>
                  <th className="py-2.5 px-3 text-center">Harvested (kg)</th>
                  <th className="py-2.5 px-3 text-center">QC Accepted (kg)</th>
                  <th className="py-2.5 px-3 text-right">Farmer Direct Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.farmers.map((farmer) => (
                  <tr key={farmer.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{farmer.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{farmer.farmName}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">5,000 kg</td>
                    <td className="py-2.5 px-3 text-center font-bold text-forest-800">
                      {formatKg(farmer.totalSuppliedKg)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-teal-800">
                      {formatKg(farmer.totalSuppliedKg * 0.98)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-forest-900">
                      {formatCurrency(farmer.totalEarnings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Transaction Ledger */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Simulated Customer Payment Transactions ({orders.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3 text-right">Settlement State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{o.id}</td>
                    <td className="py-2.5 px-3 text-slate-500">{formatDateTime(o.orderDate)}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{o.customer.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-700">{o.paymentMethod}</span>
                      {o.paymentDetails?.txnId && (
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {o.paymentDetails.txnId}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-black text-slate-900">
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <StatusBadge status={o.paymentStatus} type="payment" size="sm" />
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
