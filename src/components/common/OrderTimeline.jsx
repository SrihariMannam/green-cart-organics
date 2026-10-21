import React from 'react';
import { CUSTOMER_TRACKING_STEPS, FULFILLMENT_STAGES } from '../../data/orderLifecycle';
import { Check, Clock, AlertTriangle, Truck, Package, Bike, CheckCircle2 } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const OrderTimeline = ({ order }) => {
  if (!order) return null;

  const currentStageConfig = FULFILLMENT_STAGES[order.fulfillmentStatus] || {};
  const currentStepNumber = currentStageConfig.customerStep || 1;
  const isCancelled = order.fulfillmentStatus === 'CANCELLED';
  const isIssue = order.fulfillmentStatus === 'ISSUE_REPORTED';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-800">
        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <h4 className="font-bold text-base">Order Cancelled</h4>
        <p className="text-sm mt-1">{order.notes || 'This order was cancelled.'}</p>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 relative z-10">
          {CUSTOMER_TRACKING_STEPS.map((stepItem) => {
            const isCompleted = currentStepNumber > stepItem.step || order.fulfillmentStatus === 'DELIVERED';
            const isCurrent = currentStepNumber === stepItem.step && order.fulfillmentStatus !== 'DELIVERED';

            return (
              <div
                key={stepItem.step}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-forest-50/80 ring-2 ring-forest-600/30 shadow-xs'
                    : ''
                }`}
              >
                {/* Node circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    isCompleted
                      ? 'bg-forest-600 text-white'
                      : isCurrent
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    stepItem.step
                  )}
                </div>

                {/* Step title */}
                <span
                  className={`mt-2 text-xs font-semibold leading-tight ${
                    isCompleted
                      ? 'text-forest-900'
                      : isCurrent
                      ? 'text-amber-800 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {stepItem.title}
                </span>

                {/* Subtitle / micro text */}
                <span className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-1">
                  {stepItem.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Stage Detail Callout */}
      <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 font-medium">Current Status:</span>{' '}
          <strong className="text-forest-800 text-sm font-bold">
            {currentStageConfig.label || order.fulfillmentStatus}
          </strong>
          <p className="text-slate-600 mt-0.5">{currentStageConfig.description}</p>
        </div>

        {/* Dynamic Contextual Information based on stage */}
        <div className="flex items-center gap-2">
          {order.assignedFarmerId && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-lime-100 text-lime-900 font-medium text-xs">
              🌾 Farm: {order.assignedFarmerId === 'farmer-1' ? 'Patel Farms' : order.assignedFarmerId === 'farmer-2' ? 'Cauvery Bio' : 'Green Leaf'}
            </span>
          )}

          {order.pickupRecord && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-100 text-purple-900 font-medium text-xs">
              <Truck className="w-3.5 h-3.5 mr-1" />
              Collected: {order.pickupRecord.collectedKg} kg
            </span>
          )}

          {order.qualityInspection && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-teal-100 text-teal-900 font-medium text-xs">
              <Package className="w-3.5 h-3.5 mr-1" />
              QC: {order.qualityInspection.grade}
            </span>
          )}

          {order.deliveryAssignment && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-cyan-100 text-cyan-900 font-medium text-xs">
              <Bike className="w-3.5 h-3.5 mr-1" />
              Agent: {order.deliveryAssignment.agentName || 'Arun Nair'}
              {order.fulfillmentStatus === 'OUT_FOR_DELIVERY' && (
                <span className="ml-1.5 font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  OTP: {order.deliveryAssignment.deliveryOtp}
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
