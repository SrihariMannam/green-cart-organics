import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatKg, formatDateTime } from '../../utils/formatters';
import { OrderTimeline } from '../../components/common/OrderTimeline';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Bike,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const CustomerTrackOrder = () => {
  const { orderId } = useParams();
  const { orders, users } = useApp();

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order #{orderId} Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The order ID does not exist in local records.</p>
        <Link
          to="/customer/orders"
          className="mt-4 inline-block px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-bold"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const assignedFarmer = users.farmers.find((f) => f.id === order.assignedFarmerId);
  const isCod = order.paymentMethod === 'COD';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/customer/orders"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Orders</span>
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
              Order #{order.id}
            </h1>
            <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Placed on {formatDateTime(order.orderDate)} · Est. Delivery: {formatDateTime(order.estimatedDelivery)}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <StatusBadge status={order.paymentStatus} type="payment" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Amount</span>
            <span className="text-xl font-black text-forest-900">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* 8-Step Timeline Visualizer */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <h3 className="font-extrabold text-slate-900 text-base mb-2">
          Farm-to-Kitchen Supply Chain Progress
        </h3>
        <OrderTimeline order={order} />
      </div>

      {/* Dynamic Role Handshake Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Farm Harvest Source */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-forest-700 font-bold text-xs">
            <div className="p-2 bg-lime-100 rounded-lg text-lime-800">
              🌾
            </div>
            <span>1. Organic Harvest Farm</span>
          </div>
          {assignedFarmer ? (
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{assignedFarmer.farmName}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{assignedFarmer.location}</p>
              <div className="text-[11px] text-slate-400 mt-2">
                Farmer Partner: <strong>{assignedFarmer.name}</strong> ({assignedFarmer.phone})
              </div>
              {order.farmerAcceptedAt && (
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  Accepted at: {formatDateTime(order.farmerAcceptedAt)}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
              <strong>Awaiting Farmer Acceptance:</strong> Open to local farmers in Mandya/Mysore. Claimable on first-come basis.
            </div>
          )}
        </div>

        {/* Card 2: Transit & City Hub Processing */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-forest-700 font-bold text-xs">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-800">
              <Building2 className="w-4 h-4" />
            </div>
            <span>2. Transit & City Hub QC</span>
          </div>
          {order.pickupRecord ? (
            <div className="text-xs space-y-1">
              <div className="font-bold text-slate-900">
                Driver: {order.pickupRecord.driverName || 'Mahesh Rao'}
              </div>
              <div className="text-slate-600">
                Truck: {order.pickupRecord.vehicleNumber} ({order.pickupRecord.collectedKg} kg collected)
              </div>
              {order.qualityInspection && (
                <div className="mt-2 pt-2 border-t border-slate-100 text-teal-800 font-semibold">
                  QC Passed: {order.qualityInspection.grade} ({order.qualityInspection.acceptedKg} kg approved)
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              Collection scheduled upon farmer harvest completion. Transported in EV insulated crates.
            </div>
          )}
        </div>

        {/* Card 3: Last-Mile Delivery Partner & OTP */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-forest-700 font-bold text-xs">
            <div className="p-2 bg-cyan-100 rounded-lg text-cyan-800">
              <Bike className="w-4 h-4" />
            </div>
            <span>3. Doorstep Delivery Partner</span>
          </div>
          {order.deliveryAssignment ? (
            <div className="text-xs space-y-1">
              <div className="font-bold text-slate-900">
                Agent: {order.deliveryAssignment.agentName || 'Arun Nair'}
              </div>
              <div className="text-slate-600">
                Vehicle: 2-Wheeler EV Scooter
              </div>
              {/* Delivery OTP Notice */}
              <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <span className="text-[10px] text-amber-800 uppercase font-black tracking-wider block">
                  Delivery Verification OTP
                </span>
                <span className="text-2xl font-black text-amber-900 font-mono tracking-widest mt-1 block">
                  {order.deliveryAssignment.deliveryOtp || '4829'}
                </span>
                <span className="text-[10px] text-amber-700 mt-1 block">
                  Share this 4-digit code with the delivery partner upon arrival.
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              A 2-wheeler delivery agent will be assigned as soon as the produce is sorted and packed at the city hub.
            </div>
          )}
        </div>
      </div>

      {/* Itemized Produce List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-extrabold text-slate-900 text-base mb-4">
          Harvested Produce Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Produce</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Price / kg</th>
                <th className="py-3 px-4 text-right">Quantity (kg)</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3 px-4 capitalize">
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
                  <td className="py-3 px-4 text-right font-medium text-slate-600">
                    {formatCurrency(item.pricePerKg)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {item.quantityKg} kg
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-slate-200 font-bold">
              <tr>
                <td colSpan="3" className="py-3 px-4 text-right text-slate-600">
                  Total Weight & Subtotal:
                </td>
                <td className="py-3 px-4 text-right font-black text-forest-800">
                  {formatKg(order.totalWeightKg)}
                </td>
                <td className="py-3 px-4 text-right font-black text-slate-900">
                  {formatCurrency(order.itemSubtotal)}
                </td>
              </tr>
              <tr>
                <td colSpan="4" className="py-2 px-4 text-right text-slate-600">
                  Delivery Fee:
                </td>
                <td className="py-2 px-4 text-right text-slate-800">
                  {order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
                </td>
              </tr>
              <tr className="text-sm">
                <td colSpan="4" className="py-3 px-4 text-right text-forest-900 font-black">
                  Final Amount ({isCod ? 'Pay on Delivery' : 'Prepaid UPI'}):
                </td>
                <td className="py-3 px-4 text-right text-forest-900 font-black text-base">
                  {formatCurrency(order.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
