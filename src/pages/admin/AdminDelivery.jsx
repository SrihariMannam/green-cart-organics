import React from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { formatKg } from '../../utils/formatters';
import { Truck, Bike, CheckCircle2, ShieldCheck, MapPin, Scale } from 'lucide-react';

export const AdminDelivery = () => {
  const { users, orders } = useApp();

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Fleet Management: Rural Trucks vs Last-Mile 2-Wheelers"
        subtitle="Distinguishing heavy EV farm collection trucks from urban 2-wheeler express delivery agents"
        breadcrumb={['Admin Portal', 'Delivery Operations']}
      />

      <div className="px-6 space-y-8">
        {/* Section A: Rural Farm Collection Fleet (Trucks) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                1. Rural Farm Collection Fleet (Heavy EV & Insulated Trucks)
              </h3>
              <p className="text-xs text-slate-500">
                Moves bulk harvests from regional farm gates to Bengaluru Central Hub.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.collectionDrivers.map((driver) => {
              const driverOrders = orders.filter((o) => o.pickupRecord?.driverId === driver.id);
              const totalKgPicked = driverOrders.reduce(
                (acc, o) => acc + (o.pickupRecord.collectedKg || 0),
                0
              );

              return (
                <div
                  key={driver.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-black text-slate-900 text-base">{driver.name}</h4>
                      <span className="text-slate-500">{driver.vehicleModel}</span>
                    </div>
                    <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      {driver.vehicleNumber}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Corridor Route:</span>
                      <strong className="text-slate-800">{driver.allocatedRoute}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payload Capacity:</span>
                      <span className="font-bold text-forest-800">{driver.capacityKg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Completed Trips:</span>
                      <span className="font-bold text-slate-800">{driver.totalTripsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Driver Phone:</span>
                      <span className="font-semibold text-slate-700">{driver.phone}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section B: Urban 2-Wheeler Delivery Agents (Last-Mile) */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-cyan-100 text-cyan-800 rounded-xl">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                2. Urban Doorstep Delivery Fleet (2-Wheeler Electric Scooters)
              </h3>
              <p className="text-xs text-slate-500">
                Delivers packed organic crates from Central Hub directly to customer doorsteps with OTP verification.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.deliveryAgents.map((agent) => {
              const agentOrders = orders.filter((o) => o.deliveryAssignment?.agentId === agent.id);

              return (
                <div
                  key={agent.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-black text-slate-900 text-base">{agent.name}</h4>
                      <span className="text-slate-500">{agent.vehicle}</span>
                    </div>
                    <span className="font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-200">
                      Rider ID: {agent.id}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Delivery Zone:</span>
                      <strong className="text-slate-800">{agent.zone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Assigned Crates:</span>
                      <span className="font-bold text-cyan-800">{agentOrders.length} packages</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rider Contact:</span>
                      <span className="font-semibold text-slate-700">{agent.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Customer Rating:</span>
                      <span className="font-bold text-amber-600">★ {agent.rating} / 5.0</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
