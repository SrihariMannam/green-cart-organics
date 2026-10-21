import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PrepareProduceModal } from '../../components/farmer/PrepareProduceModal';
import { formatCurrency, formatKg, formatDateTime } from '../../utils/formatters';
import {
  CheckCircle,
  Clock,
  Truck,
  Scale,
  MapPin,
  Package,
  Calendar
} from 'lucide-react';

export const FarmerAcceptedOrders = () => {
  const { orders, users, activeProfileId } = useApp();
  const [selectedOrderForPrep, setSelectedOrderForPrep] = useState(null);

  const currentFarmer =
    users.farmers.find((f) => f.id === activeProfileId) || users.farmers[0];

  const myOrders = orders.filter((o) => o.assignedFarmerId === activeProfileId);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Accepted Orders"
        subtitle={`Produce Commitments for ${currentFarmer.name} (${currentFarmer.farmName})`}
        breadcrumb={['Farmer Portal', 'Accepted Orders']}
      />

      <div className="px-6 space-y-6">
        {myOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No accepted orders yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Go to Incoming Orders to review and claim customer orders.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => {
              const isReadyForPrep = order.fulfillmentStatus === 'FARMER_ACCEPTED';
              const isReadyForPickup = order.fulfillmentStatus === 'READY_FOR_PICKUP';
              const isPastPickup = [
                'PICKED_UP',
                'RECEIVED_AT_HUB',
                'QUALITY_CHECKED',
                'PACKED',
                'ASSIGNED_TO_DELIVERY',
                'OUT_FOR_DELIVERY',
                'DELIVERED',
              ].includes(order.fulfillmentStatus);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 font-mono font-bold text-xs flex items-center justify-center">
                        #{order.id.split('-')[1] || 'GCO'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm font-mono">
                          Order #{order.id}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          Accepted on {formatDateTime(order.farmerAcceptedAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
                      <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Item list */}
                    <div className="md:col-span-6 space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Committed Crops ({order.items.length} items)
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {order.items.map((it) => (
                          <div
                            key={it.id}
                            className="bg-slate-50 p-2 rounded-lg border border-slate-200/60"
                          >
                            <span className="font-semibold text-slate-800 block truncate">
                              {it.name}
                            </span>
                            <span className="text-[10px] text-forest-700 font-bold">
                              {it.quantityKg} kg @ {formatCurrency(it.pricePerKg)}/kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weight & Revenue */}
                    <div className="md:col-span-3 text-xs space-y-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                      <div>
                        <span className="text-slate-400">Target Harvest Weight:</span>
                        <div className="font-bold text-slate-800 text-sm">
                          {formatKg(order.actualPreparedKg || order.totalWeightKg)}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Farmer Revenue Credit:</span>
                        <div className="font-black text-forest-800 text-base">
                          {formatCurrency(order.itemSubtotal)}
                        </div>
                      </div>
                    </div>

                    {/* Action Column */}
                    <div className="md:col-span-3 flex flex-col justify-center items-end border-t md:border-t-0 pt-3 md:pt-0">
                      {isReadyForPrep && (
                        <button
                          onClick={() => setSelectedOrderForPrep(order)}
                          className="w-full px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-sm active:scale-95 transition flex items-center justify-center space-x-1.5"
                        >
                          <Scale className="w-4 h-4" />
                          <span>Weigh & Mark Ready</span>
                        </button>
                      )}

                      {isReadyForPickup && (
                        <div className="w-full text-center p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                          <Truck className="w-4 h-4 text-amber-600 mx-auto mb-1 animate-bounce" />
                          <span className="font-bold block">Ready for Pickup</span>
                          <span className="text-[10px] text-slate-500">Collection truck dispatched</span>
                        </div>
                      )}

                      {isPastPickup && (
                        <div className="w-full text-center p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                          <span className="font-bold block">Collected & In Transit</span>
                          <span className="text-[10px] text-slate-500">
                            Collected: {order.pickupRecord?.collectedKg || order.totalWeightKg} kg
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Prepare Produce Modal */}
      {selectedOrderForPrep && (
        <PrepareProduceModal
          order={selectedOrderForPrep}
          onClose={() => setSelectedOrderForPrep(null)}
        />
      )}
    </div>
  );
};
