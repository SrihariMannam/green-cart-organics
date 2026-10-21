import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatKg, formatDateTime } from '../../utils/formatters';
import { History, CheckCircle2, Bike } from 'lucide-react';

export const DeliveryHistory = () => {
  const { orders } = useApp();

  const deliveredOrders = orders.filter((o) => o.fulfillmentStatus === 'DELIVERED');

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Completed Deliveries & Collection Log"
        subtitle="Audit log of completed doorstep deliveries with customer signatures and COD receipts"
        breadcrumb={['Delivery Agent', 'Delivery History']}
      />

      <div className="px-6 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Delivered Time</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Address / Zone</th>
                  <th className="py-3 px-4">COD Payment Status</th>
                  <th className="py-3 px-4 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{o.id}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDateTime(o.deliveryAssignment?.deliveredAt || o.orderDate)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{o.customer.name}</td>
                    <td className="py-3 px-4 text-slate-600">{o.customer.locality}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={o.paymentStatus} type="payment" size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <StatusBadge status="DELIVERED" type="fulfillment" size="sm" />
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
