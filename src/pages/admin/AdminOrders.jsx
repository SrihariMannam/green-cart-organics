import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatKg, formatDateTime } from '../../utils/formatters';
import {
  Inbox,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  MapPin,
  Truck,
  Bike,
  Building2,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const AdminOrders = () => {
  const { orders } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.fulfillmentStatus !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesId = o.id.toLowerCase().includes(q);
      const matchesCustomer = o.customer.name.toLowerCase().includes(q);
      const matchesLocality = o.customer.locality.toLowerCase().includes(q);
      const matchesProduce = o.items.some((it) => it.name.toLowerCase().includes(q));
      return matchesId || matchesCustomer || matchesLocality || matchesProduce;
    }
    return true;
  });

  const exportToCsv = () => {
    const headers = [
      'Order ID',
      'Date',
      'Customer',
      'Locality',
      'Total Weight (kg)',
      'Total Amount (INR)',
      'Payment Method',
      'Payment Status',
      'Fulfillment Status',
      'Assigned Farmer',
    ];

    const rows = filteredOrders.map((o) => [
      o.id,
      o.orderDate,
      `"${o.customer.name}"`,
      `"${o.customer.locality}"`,
      o.totalWeightKg,
      o.totalAmount,
      o.paymentMethod,
      o.paymentStatus,
      o.fulfillmentStatus,
      o.assignedFarmerId || 'Unassigned',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GreenCart_Orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Incoming Orders & Lifecycle Management"
        subtitle="Itemized audit view of every customer order with exact product quantities in kilograms"
        breadcrumb={['Admin Portal', 'Incoming & All Orders']}
      />

      <div className="px-6 space-y-6">
        {/* Controls: Search, Filter, Export */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Order ID, customer, locality, produce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="ALL">All Statuses ({orders.length})</option>
              <option value="CONFIRMED">Confirmed / Unassigned</option>
              <option value="FARMER_ACCEPTED">Farmer Accepted</option>
              <option value="READY_FOR_PICKUP">Ready for Collection</option>
              <option value="PICKED_UP">In Transit to Hub</option>
              <option value="RECEIVED_AT_HUB">Received at Hub</option>
              <option value="QUALITY_CHECKED">Quality Checked</option>
              <option value="PACKED">Packed</option>
              <option value="ASSIGNED_TO_DELIVERY">Assigned to Rider</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          <button
            onClick={exportToCsv}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Consolidated Orders ({filteredOrders.length})
            </h3>
            <span className="text-xs text-slate-400">Click row to expand itemized kilograms</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer & Area</th>
                  <th className="py-3 px-4 text-center">Total Weight</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Assigned Entity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const isExpanded = !!expandedOrders[order.id];

                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        onClick={() => toggleExpand(order.id)}
                        className={`hover:bg-slate-50 cursor-pointer transition ${
                          isExpanded ? 'bg-purple-50/40' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-slate-900">{order.id}</div>
                          <span className="text-[10px] text-slate-400">
                            {formatDateTime(order.orderDate)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{order.customer.name}</div>
                          <span className="text-[10px] text-slate-400">{order.customer.locality}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-forest-800 text-sm">
                          {formatKg(order.totalWeightKg)}
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {order.assignedFarmerId ? (
                            <span className="font-medium text-lime-900 bg-lime-50 px-2 py-0.5 rounded">
                              {order.assignedFarmerId === 'farmer-1' ? 'Farmer Ramesh' : 'Farmer Suresh'}
                            </span>
                          ) : (
                            <span className="text-amber-700 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={order.fulfillmentStatus} type="fulfillment" size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-400">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 ml-auto text-purple-700" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-auto" />
                          )}
                        </td>
                      </tr>

                      {/* Expandable itemized row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 border-b border-purple-100">
                          <td colSpan="8" className="p-4 sm:p-6">
                            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4 shadow-inner">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                <h4 className="font-extrabold text-slate-900 text-sm">
                                  Itemized Produce Weights & Supply Chain Handoff: {order.id}
                                </h4>
                                <span className="text-xs font-semibold text-slate-500">
                                  Delivery Address: {order.customer.address}
                                </span>
                              </div>

                              {/* Produce Items Table */}
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                  <thead className="bg-slate-100/70 text-slate-500 font-semibold uppercase">
                                    <tr>
                                      <th className="py-2 px-3">Product Name</th>
                                      <th className="py-2 px-3">Category</th>
                                      <th className="py-2 px-3 text-right">Price / kg</th>
                                      <th className="py-2 px-3 text-right">Quantity (kg)</th>
                                      <th className="py-2 px-3 text-right">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {order.items.map((item) => (
                                      <tr key={item.id}>
                                        <td className="py-2 px-3 font-bold text-slate-800">{item.name}</td>
                                        <td className="py-2 px-3 capitalize">
                                          <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                              item.category === 'vegetables'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-amber-100 text-amber-800'
                                            }`}
                                          >
                                            {item.category}
                                          </span>
                                        </td>
                                        <td className="py-2 px-3 text-right font-medium text-slate-600">
                                          {formatCurrency(item.pricePerKg)}
                                        </td>
                                        <td className="py-2 px-3 text-right font-black text-slate-900">
                                          {item.quantityKg} kg
                                        </td>
                                        <td className="py-2 px-3 text-right font-extrabold text-slate-900">
                                          {formatCurrency(item.subtotal)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Entities involved */}
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-100">
                                <div>
                                  <span className="text-slate-400 block font-bold uppercase text-[10px]">
                                    Farmer Entity
                                  </span>
                                  <div className="font-semibold text-slate-800 mt-0.5">
                                    {order.assignedFarmerId ? 'Ramesh Patel (Mandya)' : 'Open Request'}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-slate-400 block font-bold uppercase text-[10px]">
                                    Collection Truck
                                  </span>
                                  <div className="font-semibold text-slate-800 mt-0.5">
                                    {order.pickupRecord?.driverName || 'Tata Ace EV'}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-slate-400 block font-bold uppercase text-[10px]">
                                    City Hub QC & Packing
                                  </span>
                                  <div className="font-semibold text-slate-800 mt-0.5">
                                    {order.qualityInspection ? `${order.qualityInspection.grade}` : 'Awaiting Hub'}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-slate-400 block font-bold uppercase text-[10px]">
                                    2-Wheeler Delivery Agent
                                  </span>
                                  <div className="font-semibold text-slate-800 mt-0.5">
                                    {order.deliveryAssignment?.agentName || 'Pending Rider Assignment'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
