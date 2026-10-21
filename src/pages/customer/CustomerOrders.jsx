import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatKg, formatDate, formatDateTime } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ShoppingBag, ArrowRight, Clock, MapPin, Eye } from 'lucide-react';

export const CustomerOrders = () => {
  const navigate = useNavigate();
  const { orders } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            My Organic Farm Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track farm harvesting, truck collection, city hub packing, and doorstep delivery live.
          </p>
        </div>
        <Link
          to="/customer/shop"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Fresh Produce</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Build your fresh basket with at least 3 vegetables and 3 fruits to place an order.
          </p>
          <Link
            to="/customer/shop"
            className="mt-4 inline-block px-5 py-2.5 bg-forest-700 text-white rounded-xl text-xs font-bold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 sm:p-6"
            >
              {/* Header row: Order ID, Date, Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 font-mono font-bold text-xs flex items-center justify-center border border-forest-100">
                    #{order.id.split('-')[1] || 'GCO'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base font-mono">
                      {order.id}
                    </h3>
                    <span className="text-xs text-slate-400">
                      Placed on {formatDateTime(order.orderDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={order.paymentStatus} type="payment" />
                  <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
                </div>
              </div>

              {/* Body row: Items and details */}
              <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Product thumbnails & names */}
                <div className="md:col-span-6 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ordered Items ({order.items.length} items · {formatKg(order.totalWeightKg)})
                  </span>
                  <div className="text-xs text-slate-700 font-medium leading-relaxed">
                    {order.items.map((it, idx) => (
                      <span key={it.id || idx}>
                        {it.name} ({it.quantityKg} kg)
                        {idx < order.items.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Farm & Delivery Destination */}
                <div className="md:col-span-3 text-xs text-slate-500 space-y-1 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                  <div className="flex items-center text-slate-700">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-forest-600 shrink-0" />
                    <span className="truncate">{order.customer.locality || 'Bengaluru'}</span>
                  </div>
                  <div className="text-slate-500 truncate">
                    {order.assignedFarmerId
                      ? `Farm: ${order.assignedFarmerId === 'farmer-1' ? 'Patel Organic' : order.assignedFarmerId === 'farmer-2' ? 'Cauvery Bio' : 'Green Leaf'}`
                      : 'Farmer: Matching Regional Farm'}
                  </div>
                </div>

                {/* Amount and Action */}
                <div className="md:col-span-3 flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <div className="text-xs text-slate-400">Total Amount</div>
                    <div className="text-lg font-black text-slate-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>

                  <Link
                    to={`/customer/orders/${order.id}`}
                    className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-bold text-xs border border-forest-200 transition"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
