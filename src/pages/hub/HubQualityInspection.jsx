import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QualityCheckModal } from '../../components/hub/QualityCheckModal';
import { formatKg, formatDateTime } from '../../utils/formatters';
import { FileCheck2, CheckCircle2, AlertTriangle, Scale, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HubQualityInspection = () => {
  const { orders } = useApp();
  const [selectedOrderForQc, setSelectedOrderForQc] = useState(null);

  // Orders eligible for QC or already inspected
  const qcOrders = orders.filter((o) =>
    ['RECEIVED_AT_HUB', 'QUALITY_CHECKED', 'PACKED', 'ASSIGNED_TO_DELIVERY'].includes(
      o.fulfillmentStatus
    )
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Quality Control & Defect Segregation"
        subtitle="Rigorous inspection protocol for moisture, sugar brix, and certified residue tests"
        breadcrumb={['City Hub Staff', 'Quality Inspection']}
      />

      <div className="px-6 space-y-6">
        {qcOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              No shipments awaiting quality inspection
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              When collection trucks arrive and shipments are confirmed at the dock, they queue here for quality grading.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {qcOrders.map((order) => {
              const isPendingQc = order.fulfillmentStatus === 'RECEIVED_AT_HUB';
              const isQcCompleted = !!order.qualityInspection;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-mono font-bold text-xs flex items-center justify-center">
                        #{order.id.split('-')[1] || 'GCO'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm font-mono">
                          Order #{order.id}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          Farm Source: {order.assignedFarmerId === 'farmer-1' ? 'Patel Organic Farms' : 'Cauvery Bio Valley'}
                        </span>
                      </div>
                    </div>

                    <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
                    <div className="md:col-span-5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Batch Produce Details
                      </span>
                      <div className="text-slate-700 leading-relaxed font-medium">
                        {order.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                      </div>
                    </div>

                    <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 space-y-1">
                      {isQcCompleted ? (
                        <div>
                          <div className="font-bold text-teal-800">
                            Grade: {order.qualityInspection.grade}
                          </div>
                          <div className="text-slate-600 mt-0.5">
                            Accepted: <strong>{formatKg(order.qualityInspection.acceptedKg)}</strong> · Rejected: <strong>{formatKg(order.qualityInspection.rejectedKg)}</strong>
                          </div>
                          <p className="text-[11px] text-slate-500 italic mt-0.5">
                            "{order.qualityInspection.notes}"
                          </p>
                        </div>
                      ) : (
                        <div>
                          <span className="text-slate-400">Received Weight to Inspect:</span>
                          <div className="font-extrabold text-slate-800 text-sm">
                            {formatKg(order.hubReceipt?.receivedKg || order.pickupRecord?.collectedKg || order.totalWeightKg)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-3 flex justify-end border-t md:border-t-0 pt-3 md:pt-0">
                      {isPendingQc ? (
                        <button
                          onClick={() => setSelectedOrderForQc(order)}
                          className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 active:scale-95 transition flex items-center justify-center space-x-1.5"
                        >
                          <FileCheck2 className="w-4 h-4" />
                          <span>Perform QC & Grade</span>
                        </button>
                      ) : (
                        <Link
                          to="/city-hub/packing"
                          className="px-4 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs border border-cyan-200 transition"
                        >
                          Proceed to Packing →
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

      {selectedOrderForQc && (
        <QualityCheckModal
          order={selectedOrderForQc}
          onClose={() => setSelectedOrderForQc(null)}
        />
      )}
    </div>
  );
};
