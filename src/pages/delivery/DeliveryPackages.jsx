import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DeliveryConfirmModal } from '../../components/delivery/DeliveryConfirmModal';
import { formatCurrency, formatKg } from '../../utils/formatters';
import { Package, Bike, KeyRound, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DeliveryPackages = () => {
  const { orders, markOutForDelivery, showToast } = useApp();
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState(null);

  const assignedPackages = orders.filter((o) =>
    ['ASSIGNED_TO_DELIVERY', 'OUT_FOR_DELIVERY'].includes(o.fulfillmentStatus)
  );

  const handleStartDelivery = (orderId) => {
    markOutForDelivery(orderId);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Assigned Customer Deliveries"
        subtitle="Last-mile doorstep handovers with OTP verification"
        breadcrumb={['Delivery Agent', 'Assigned Packages']}
      />

      <div className="px-6 space-y-6">
        {assignedPackages.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              No packages currently assigned
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Packages packed at the City Hub and assigned to your route will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedPackages.map((order) => {
              const isAssigned = order.fulfillmentStatus === 'ASSIGNED_TO_DELIVERY';
              const isOut = order.fulfillmentStatus === 'OUT_FOR_DELIVERY';
              const isCod = order.paymentMethod === 'COD';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 font-mono font-bold text-xs flex items-center justify-center">
                        #{order.id.split('-')[1] || 'GCO'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm font-mono">
                          Order #{order.id} · {order.packingRecord?.packageLabel || 'PKG-ECO'}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          Recipient: {order.customer.name} ({order.customer.phone})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
                      <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
                    <div className="md:col-span-5 space-y-1">
                      <div className="flex items-start text-slate-800 font-medium">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-forest-700 shrink-0 mt-0.5" />
                        <span>{order.customer.address}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] pl-4">
                        Produce: {order.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                      </div>
                    </div>

                    <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 space-y-1">
                      <div>
                        <span className="text-slate-400">Package Weight:</span>
                        <div className="font-bold text-slate-900">
                          {formatKg(order.packingRecord?.packageWeightKg || order.totalWeightKg)}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Amount to Collect:</span>
                        <div className="font-extrabold text-forest-800 text-sm">
                          {isCod ? formatCurrency(order.totalAmount) : 'Prepaid (₹0)'}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4 flex items-center justify-end space-x-2 border-t md:border-t-0 pt-3 md:pt-0">
                      {isAssigned ? (
                        <button
                          onClick={() => handleStartDelivery(order.id)}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center space-x-1.5"
                        >
                          <Bike className="w-4 h-4" />
                          <span>Start Run (Out for Delivery)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedOrderForDelivery(order)}
                          className="px-6 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center space-x-1.5"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span>Enter Customer OTP & Handover</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedOrderForDelivery && (
        <DeliveryConfirmModal
          order={selectedOrderForDelivery}
          onClose={() => setSelectedOrderForDelivery(null)}
        />
      )}
    </div>
  );
};
