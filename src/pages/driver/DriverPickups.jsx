import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PickupVerifyModal } from '../../components/driver/PickupVerifyModal';
import { formatKg, formatDateTime } from '../../utils/formatters';
import { ClipboardCheck, Truck, Scale, MapPin, CheckCircle } from 'lucide-react';

export const DriverPickups = () => {
  const { orders, users, activeProfileId } = useApp();
  const [selectedOrderForVerify, setSelectedOrderForVerify] = useState(null);

  const currentDriver =
    users.collectionDrivers.find((d) => d.id === activeProfileId) ||
    users.collectionDrivers[0];

  // Pickups ready for verification or currently loaded
  const eligibleOrders = orders.filter((o) =>
    ['READY_FOR_PICKUP', 'PICKED_UP'].includes(o.fulfillmentStatus)
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Farm-Gate Pickup & Verification"
        subtitle={`Audit harvest weight and record condition for truck loading`}
        breadcrumb={['Collection Driver', 'Pickup Verification']}
      />

      <div className="px-6 space-y-6">
        {eligibleOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              No orders waiting for pickup
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              When farmers accept orders and mark their harvest "Ready for Pickup", they will appear here for weighing and collection.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {eligibleOrders.map((order) => {
              const isReady = order.fulfillmentStatus === 'READY_FOR_PICKUP';
              const isPickedUp = order.fulfillmentStatus === 'PICKED_UP';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-mono font-bold text-xs flex items-center justify-center">
                        #{order.id.split('-')[1] || 'GCO'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm font-mono">
                          Order #{order.id}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          Farm: {order.assignedFarmerId === 'farmer-1' ? 'Patel Organic Farms (Mandya)' : 'Cauvery Bio Valley'}
                        </span>
                      </div>
                    </div>

                    <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
                    <div className="md:col-span-5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Harvested Items ({order.items.length} items)
                      </span>
                      <div className="text-slate-700 leading-relaxed font-medium">
                        {order.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                      </div>
                    </div>

                    <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 space-y-1">
                      <div>
                        <span className="text-slate-400">Farmer Prepared Weight:</span>
                        <div className="font-bold text-slate-900 text-sm">
                          {formatKg(order.actualPreparedKg || order.totalWeightKg)}
                        </div>
                      </div>
                      {isPickedUp && order.pickupRecord && (
                        <div>
                          <span className="text-slate-400">Actual Collected Weight:</span>
                          <div className="font-black text-forest-800">
                            {formatKg(order.pickupRecord.collectedKg)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-4 flex justify-end border-t md:border-t-0 pt-3 md:pt-0">
                      {isReady ? (
                        <button
                          onClick={() => setSelectedOrderForVerify(order)}
                          className="w-full md:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/20 active:scale-95 transition flex items-center justify-center space-x-1.5"
                        >
                          <Scale className="w-4 h-4" />
                          <span>Weigh & Verify Pickup</span>
                        </button>
                      ) : (
                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Loaded on Truck · In Transit to Hub</span>
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

      {selectedOrderForVerify && (
        <PickupVerifyModal
          order={selectedOrderForVerify}
          onClose={() => setSelectedOrderForVerify(null)}
        />
      )}
    </div>
  );
};
