import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatKg, formatDateTime } from '../../utils/formatters';
import { Send, Bike, CheckCircle2, UserCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HubDispatch = () => {
  const { orders, users, dispatchToDeliveryAgent, showToast } = useApp();

  const deliveryAgents = users.deliveryAgents;

  // Selected agent for each order in form state
  const [selectedAgents, setSelectedAgents] = useState({});
  const [selectedSlots, setSelectedSlots] = useState({});

  const packedOrders = orders.filter((o) =>
    ['PACKED', 'ASSIGNED_TO_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(
      o.fulfillmentStatus
    )
  );

  const handleAgentChange = (orderId, agentId) => {
    setSelectedAgents((prev) => ({ ...prev, [orderId]: agentId }));
  };

  const handleSlotChange = (orderId, slot) => {
    setSelectedSlots((prev) => ({ ...prev, [orderId]: slot }));
  };

  const handleDispatch = (orderId) => {
    const agentId = selectedAgents[orderId] || deliveryAgents[0].id;
    const slot = selectedSlots[orderId] || 'Immediate Dispatch (Within 2 Hours)';

    const res = dispatchToDeliveryAgent(orderId, {
      agentId,
      estimatedSlot: slot,
    });

    if (res.success) {
      showToast(`Order dispatched to delivery agent!`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Last-Mile 2-Wheeler Dispatch Desk"
        subtitle="Handoff packed eco-crates to electric two-wheeler delivery riders for doorstep fulfillment"
        breadcrumb={['City Hub Staff', 'Dispatch to 2-Wheelers']}
      />

      <div className="px-6 space-y-6">
        {packedOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              No packages currently awaiting dispatch
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Once orders are packed and labeled with barcode tags, they will appear here to be assigned to last-mile riders.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {packedOrders.map((order) => {
              const isPacked = order.fulfillmentStatus === 'PACKED';
              const isDispatched = [
                'ASSIGNED_TO_DELIVERY',
                'OUT_FOR_DELIVERY',
                'DELIVERED',
              ].includes(order.fulfillmentStatus);

              const currentAgentId =
                selectedAgents[order.id] ||
                order.deliveryAssignment?.agentId ||
                deliveryAgents[0].id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-mono font-bold text-xs flex items-center justify-center">
                        #{order.id.split('-')[1] || 'GCO'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm font-mono">
                          Order #{order.id} · {order.packingRecord?.packageLabel || 'PKG-ECO'}
                        </h3>
                        <span className="text-[11px] text-slate-400">
                          Customer: {order.customer.name} · {order.customer.locality}
                        </span>
                      </div>
                    </div>

                    <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
                    <div className="md:col-span-4 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Package Specifications
                      </span>
                      <div className="font-bold text-slate-800">
                        {order.packingRecord?.packageCount || 1} Box(es) · {formatKg(order.packingRecord?.packageWeightKg || order.totalWeightKg)}
                      </div>
                      <div className="text-slate-500 leading-snug">
                        Delivery Address: {order.customer.address}
                      </div>
                    </div>

                    {/* Agent selector */}
                    <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 space-y-2">
                      {isPacked ? (
                        <>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Assign Two-Wheeler Delivery Agent
                            </label>
                            <select
                              value={currentAgentId}
                              onChange={(e) => handleAgentChange(order.id, e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              {deliveryAgents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                  {agent.name} — {agent.zone} ({agent.vehicle.split('(')[0]})
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Dispatch Priority Window
                            </label>
                            <select
                              value={selectedSlots[order.id] || 'Immediate Dispatch'}
                              onChange={(e) => handleSlotChange(order.id, e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-[11px]"
                            >
                              <option value="Immediate Dispatch">Immediate Express Dispatch</option>
                              <option value="Standard Slot (11:00 AM - 01:00 PM)">Standard Slot (11:00 AM - 01:00 PM)</option>
                              <option value="Evening Slot (05:00 PM - 07:00 PM)">Evening Slot (05:00 PM - 07:00 PM)</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                            <Bike className="w-4 h-4 text-indigo-600" />
                            Assigned to: {order.deliveryAssignment?.agentName || 'Arun Nair'}
                          </div>
                          <div className="text-slate-500 mt-0.5">
                            Assigned on: {formatDateTime(order.deliveryAssignment?.assignedAt)}
                          </div>
                          <div className="text-amber-800 font-bold mt-1 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                            Simulated Customer OTP: {order.deliveryAssignment?.deliveryOtp}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dispatch Button */}
                    <div className="md:col-span-3 flex justify-end border-t md:border-t-0 pt-3 md:pt-0">
                      {isPacked ? (
                        <button
                          onClick={() => handleDispatch(order.id)}
                          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition flex items-center justify-center space-x-1.5"
                        >
                          <Send className="w-4 h-4" />
                          <span>Dispatch to Delivery Agent</span>
                        </button>
                      ) : (
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>In Rider Queue</span>
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
    </div>
  );
};
