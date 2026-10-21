import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { formatCurrency, formatKg, formatDateTime } from '../../utils/formatters';
import { Users, Search, MapPin, Phone, Mail, ShoppingBag } from 'lucide-react';

export const AdminCustomers = () => {
  const { orders, users } = useApp();
  const [search, setSearch] = useState('');

  // Group customer metrics from confirmed orders
  const customerMap = {};

  orders.forEach((o) => {
    const custId = o.customer.id || 'cust-1';
    if (!customerMap[custId]) {
      customerMap[custId] = {
        id: custId,
        name: o.customer.name,
        phone: o.customer.phone,
        locality: o.customer.locality,
        address: o.customer.address,
        ordersCount: 0,
        totalKg: 0,
        totalSpend: 0,
        lastOrderDate: o.orderDate,
        orders: [],
      };
    }
    customerMap[custId].ordersCount += 1;
    customerMap[custId].totalKg += o.totalWeightKg || 0;
    customerMap[custId].totalSpend += o.totalAmount || 0;
    customerMap[custId].orders.push(o);
  });

  // Ensure default demo customer is included
  if (!customerMap['cust-1']) {
    customerMap['cust-1'] = {
      id: 'cust-1',
      name: users.customer.name,
      phone: users.customer.phone,
      locality: users.customer.defaultAddress.locality,
      address: users.customer.defaultAddress.addressLine,
      ordersCount: 0,
      totalKg: 0,
      totalSpend: 0,
      lastOrderDate: null,
      orders: [],
    };
  }

  const customerList = Object.values(customerMap).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.locality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Customer Base & Consumption Metrics"
        subtitle="Registered consumers, household organic consumption volumes, and delivery localities"
        breadcrumb={['Admin Portal', 'Customers']}
      />

      <div className="px-6 space-y-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customers by name or locality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total Active Consumers: <strong>{customerList.length}</strong>
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Customer Name & ID</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Delivery Locality</th>
                  <th className="py-3 px-4 text-center">Orders Placed</th>
                  <th className="py-3 px-4 text-center">Total Consumed (kg)</th>
                  <th className="py-3 px-4 text-right">Lifetime Value</th>
                  <th className="py-3 px-4 text-right">Customer Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerList.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{cust.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{cust.id}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{cust.phone}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{cust.locality}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {cust.ordersCount}
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-forest-800">
                      {formatKg(cust.totalKg)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {formatCurrency(cust.totalSpend)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Verified Organic Active
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
