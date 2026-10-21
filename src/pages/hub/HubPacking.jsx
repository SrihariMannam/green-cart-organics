import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PackingModal } from '../../components/hub/PackingModal';
import { formatKg } from '../../utils/formatters';
import { PackageCheck, CheckCircle2, QrCode, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HubPacking = () => {
  const { orders } = useApp();
  const [selectedOrderForPacking, setSelectedOrderForPacking] = useState(null);

  // Orders that are quality checked (ready for packing) or already packed
  const packableOrders = orders.filter((o) =>
    ['QUALITY_CHECKED', 'PACKED', 'ASSIGNED_TO_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(
      o.fulfillmentStatus
    )
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Order Sorting, Packaging & Labeling"
        subtitle="Sort inspected organic produce into sustainable eco-crates with custom barcode labels"
        breadcrumb={['City Hub Staff', 'Sorting & Packing']}
      />

      <div className="px-6 space-y-6">
        {packableOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <PackageCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              No orders waiting for packaging
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Produce must pass Quality Inspection before it can be sorted and packed into customer crates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {packableOrders.map((order) => {
              const isReadyToPack = order.fulfillmentStatus === 'QUALITY_CHECKED';
              const isPacked = !!order.packingRecord;

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
                          Order #{order.id}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          Destination: {order.customer.locality} ({order.customer.city})
                        </span>
                      </div>
                    </div>

                    <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
                    <div className="md:col-span-5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Produce To Pack ({order.items.length} items)
                      </span>
                      <div className="text-slate-700 leading-relaxed font-medium">
                        {order.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                      </div>
                    </div>

                    <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 space-y-1">
                      {isPacked ? (
                        <div>
                          <div className="font-mono font-bold text-cyan-800">
                            {order.packingRecord.packageLabel}
                          </div>
                          <div className="text-slate-600 mt-0.5">
                            Crates: {order.packingRecord.packageCount} · Weight: {formatKg(order.packingRecord.packageWeightKg)}
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                            Sealed & ready for 2-wheeler rider handoff
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-slate-400">Inspected Weight to Pack:</span>
                          <div className="font-extrabold text-slate-800 text-sm">
                            {formatKg(order.qualityInspection?.acceptedKg || order.totalWeightKg)}
                          </div>
                          <span className="text-[10px] text-amber-700 font-semibold">
                            Awaiting barcode crate labeling
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-3 flex justify-end border-t md:border-t-0 pt-3 md:pt-0">
                      {isReadyToPack ? (
                        <button
                          onClick={() => setSelectedOrderForPacking(order)}
                          className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-md shadow-cyan-600/20 active:scale-95 transition flex items-center justify-center space-x-1.5"
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>Sort & Pack Box</span>
                        </button>
                      ) : (
                        <Link
                          to="/city-hub/dispatch"
                          className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs border border-indigo-200 transition"
                        >
                          Dispatch to Rider →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedOrderForPacking && (
        <PackingModal
          order={selectedOrderForPacking}
          onClose={() => setSelectedOrderForPacking(null)}
        />
      )}
    </div>
  );
};
