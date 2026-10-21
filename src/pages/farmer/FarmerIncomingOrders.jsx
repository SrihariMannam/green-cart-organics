import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatKg, formatDateTime } from '../../utils/formatters';
import {
  Inbox,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Scale,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FarmerIncomingOrders = () => {
  const navigate = useNavigate();
  const {
    orders,
    users,
    activeProfileId,
    acceptOrderByFarmer,
    showToast,
  } = useApp();

  const [claimingOrderId, setClaimingOrderId] = useState(null);

  const currentFarmer =
    users.farmers.find((f) => f.id === activeProfileId) || users.farmers[0];

  // Only open orders that are CONFIRMED and unassigned
  const incomingOrders = orders.filter(
    (o) => o.fulfillmentStatus === 'CONFIRMED' && !o.assignedFarmerId
  );

  const handleClaim = (orderId) => {
    setClaimingOrderId(orderId);

    setTimeout(() => {
      const res = acceptOrderByFarmer(orderId, activeProfileId);
      setClaimingOrderId(null);

      if (res.success) {
        navigate('/farmer/accepted');
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Incoming Order Requests"
        subtitle={`First-Come First-Served Harvest Marketplace · Claiming as ${currentFarmer.name}`}
        breadcrumb={['Farmer Portal', 'Incoming Orders']}
      />

      <div className="px-6 space-y-6">
        {/* Concurrency Rule Information Card */}
        <div className="bg-lime-50 rounded-2xl p-4 sm:p-5 border border-lime-200 text-xs text-lime-950 flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-lime-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-lime-900">
              Simulated First-Come, First-Served Concurrency Model
            </h4>
            <p className="text-lime-800 leading-relaxed">
              When an order is placed by a customer, all regional farmers receive the broadcast. The first farmer to accept an order locks and claims it in browser localStorage. You can switch farmers in the top demo bar to test this locking rule!
            </p>
          </div>
        </div>

        {incomingOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No Open Incoming Orders at this Moment
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All confirmed customer orders have already been claimed by farmers, or no new orders have been placed. Place a new order in the Customer Portal to see it appear here immediately!
            </p>
            <div className="mt-5">
              <button
                onClick={() => navigate('/customer/shop')}
                className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold transition"
              >
                Switch to Customer Portal to Place New Order
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {incomingOrders.map((order) => {
              const totalItemsWeight = order.items.reduce(
                (acc, it) => acc + it.quantityKg,
                0
              );
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 font-mono font-bold text-xs flex items-center justify-center border border-forest-100">
                        #{order.id.split('-')[1] || 'GCO'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm font-mono">
                          Order {order.id}
                        </h3>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          Placed at {formatDateTime(order.orderDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        Open for Claim
                      </span>
                      <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
                    </div>
                  </div>

                  {/* Order Contents & Locality */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Destination area */}
                    <div className="md:col-span-4 text-xs space-y-1">
                      <div className="flex items-center text-slate-800 font-bold">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-forest-600" />
                        <span>Delivery Locality: {order.customer.locality}</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Address details protected until accepted by farmer.
                      </p>
                      <div className="text-slate-700 font-semibold pt-1">
                        Est. Revenue: <span className="text-forest-800 font-extrabold">{formatCurrency(order.itemSubtotal)}</span>
                      </div>
                    </div>

                    {/* Requested Produce Breakdown */}
                    <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Requested Produce ({order.items.length} items · {formatKg(totalItemsWeight)})
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {order.items.map((it) => (
                          <div
                            key={it.id}
                            className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/60 truncate"
                          >
                            <span className="font-semibold text-slate-800 truncate block">
                              {it.name}
                            </span>
                            <span className="text-[10px] text-forest-700 font-bold">
                              {it.quantityKg} kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Claim Button */}
                    <div className="md:col-span-3 flex justify-end border-t md:border-t-0 pt-3 md:pt-0">
                      <button
                        onClick={() => handleClaim(order.id)}
                        disabled={claimingOrderId === order.id}
                        className="w-full md:w-auto px-6 py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-xs shadow-md shadow-forest-700/20 active:scale-95 transition flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {claimingOrderId === order.id
                            ? 'Claiming Order...'
                            : `Accept as ${currentFarmer.name.split(' ')[0]}`}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
