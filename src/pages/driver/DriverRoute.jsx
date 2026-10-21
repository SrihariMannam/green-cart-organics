import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { formatKg } from '../../utils/formatters';
import {
  MapPin,
  Truck,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DriverRoute = () => {
  const navigate = useNavigate();
  const { orders, users, activeProfileId, confirmDeliveryToHub, showToast } = useApp();

  const currentDriver =
    users.collectionDrivers.find((d) => d.id === activeProfileId) ||
    users.collectionDrivers[0];

  const inTransitOrders = orders.filter((o) => o.fulfillmentStatus === 'PICKED_UP');
  const totalWeightInTruck = inTransitOrders.reduce(
    (acc, o) => acc + (o.pickupRecord?.collectedKg || o.totalWeightKg || 0),
    0
  );

  const [deliveringOrderId, setDeliveringOrderId] = useState(null);

  const handleConfirmHubArrival = (orderId) => {
    confirmDeliveryToHub(orderId, {
      bayNumber: 'Bay 3 (Insulated Unloading Dock)',
      receivedBy: 'hub-1',
    });
  };

  const handleDeliverAllToHub = () => {
    if (inTransitOrders.length === 0) {
      showToast('No cargo currently in transit on this truck.', 'warning');
      return;
    }
    inTransitOrders.forEach((o) => {
      confirmDeliveryToHub(o.id, {
        bayNumber: 'Bay 3 (Insulated Dock)',
        receivedBy: 'hub-1',
      });
    });
    showToast('All collected shipments delivered to City Hub!', 'success');
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Active Collection Corridor & Route Map"
        subtitle={`Mandya → Ramanagara → Bengaluru Central Hub (Route A)`}
        breadcrumb={['Collection Driver', 'My Route']}
      />

      <div className="px-6 space-y-6">
        {/* Hub Delivery Action Card */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                Destination Terminal
              </span>
              <h2 className="text-2xl font-black tracking-tight">
                Bengaluru Central Aggregation & QC Center
              </h2>
              <p className="text-xs text-indigo-200 max-w-xl">
                Current Truck Cargo: <strong>{inTransitOrders.length} orders</strong> ({formatKg(totalWeightInTruck)}) ready to be unloaded at Dock Bay 3 for Quality Control.
              </p>
            </div>

            <div className="shrink-0">
              <button
                onClick={handleDeliverAllToHub}
                disabled={inTransitOrders.length === 0}
                className={`px-6 py-4 rounded-2xl font-black text-xs flex items-center space-x-2 shadow-xl transition active:scale-95 ${
                  inTransitOrders.length > 0
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Delivery to City Hub ({inTransitOrders.length} Shipments)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Corridor Stops Map Illustration */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-extrabold text-slate-900 text-base">
            Corridor Waypoints & Loading Sequence
          </h3>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-amber-300 space-y-8 my-4">
            {/* Stop 1 */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full bg-lime-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                1
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800 text-sm">
                  <span>Patel Organic Farms (Mandya)</span>
                  <span className="text-emerald-700 text-xs bg-emerald-100 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
                <p className="text-slate-500">Pickup Stop · Organic Tomatoes, Carrots, Spinach</p>
              </div>
            </div>

            {/* Stop 2 */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                2
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-800 text-sm">
                  <span>Cauvery Bio Valley (Mysore Road)</span>
                  <span className="text-amber-800 text-xs bg-amber-100 px-2 py-0.5 rounded-full">
                    Active Stop
                  </span>
                </div>
                <p className="text-slate-500">Pickup Stop · Royal Apples, Red Onions, Hill Potatoes</p>
              </div>
            </div>

            {/* Stop 3 (Hub Terminal) */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                3
              </div>
              <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-indigo-950 text-sm">
                  <span>Bengaluru Central Aggregation Hub</span>
                  <span className="text-indigo-800 text-xs bg-indigo-100 px-2 py-0.5 rounded-full font-bold">
                    Terminal Handoff
                  </span>
                </div>
                <p className="text-indigo-700">Dock Bay 3 · Unloading, Quality Control & Packing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consignments in Truck */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">
            Consignments Currently in Truck ({inTransitOrders.length})
          </h3>
          {inTransitOrders.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              No produce in transit. Once you verify pickups, they appear here.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {inTransitOrders.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{o.id}</span>
                    <span className="text-slate-500 ml-2">
                      {o.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Collected: {formatKg(o.pickupRecord?.collectedKg || o.totalWeightKg)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleConfirmHubArrival(o.id)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition"
                  >
                    Unload at Hub
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
