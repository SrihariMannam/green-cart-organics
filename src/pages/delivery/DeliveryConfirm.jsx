import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { DeliveryConfirmModal } from '../../components/delivery/DeliveryConfirmModal';
import { formatCurrency, formatKg } from '../../utils/formatters';
import { KeyRound, Bike, CheckCircle2, MapPin } from 'lucide-react';

export const DeliveryConfirm = () => {
  const { orders } = useApp();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const activeDeliveries = orders.filter((o) =>
    ['ASSIGNED_TO_DELIVERY', 'OUT_FOR_DELIVERY'].includes(o.fulfillmentStatus)
  );

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Doorstep Delivery & OTP Verification"
        subtitle="Confirm customer OTP handovers and collect COD cash"
        breadcrumb={['Delivery Agent', 'Delivery Confirmation']}
      />

      <div className="px-6 space-y-6">
        {activeDeliveries.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <KeyRound className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No pending handovers</h3>
            <p className="text-xs text-slate-500 mt-1">
              All assigned deliveries have been confirmed and completed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeDeliveries.map((order) => {
              const isCod = order.paymentMethod === 'COD';
              const otp = order.deliveryAssignment?.deliveryOtp || '4829';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold ${isCod ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {isCod ? `COD Due: ${formatCurrency(order.totalAmount)}` : 'Prepaid (UPI)'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">{order.customer.name}</div>
                    <div className="text-slate-600">{order.customer.address}</div>
                    <div className="text-slate-400">Phone: {order.customer.phone}</div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-800 font-bold block uppercase">
                        Demo OTP Notice
                      </span>
                      <span className="font-mono font-black text-amber-950 text-base">{otp}</span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl shadow-xs transition"
                    >
                      Enter OTP & Deliver
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedOrder && (
        <DeliveryConfirmModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};
