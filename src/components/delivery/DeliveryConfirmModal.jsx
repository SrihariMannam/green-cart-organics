import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatKg } from '../../utils/formatters';
import {
  X,
  CheckCircle,
  KeyRound,
  Camera,
  Banknote,
  AlertTriangle,
  Bike,
  ShieldCheck
} from 'lucide-react';

export const DeliveryConfirmModal = ({ order, onClose }) => {
  const { confirmDelivery, reportDeliveryIssue, showToast } = useApp();

  const isCod = order.paymentMethod === 'COD';
  const expectedOtp = order.deliveryAssignment?.deliveryOtp || '4829';

  const [enteredOtp, setEnteredOtp] = useState('');
  const [proofNotes, setProofNotes] = useState('Handed over fresh organic produce crate directly to customer at door.');
  const [codCollected, setCodCollected] = useState(isCod);
  const [showIssueMode, setShowIssueMode] = useState(false);
  const [issueReason, setIssueReason] = useState('Customer Doorbell Unanswered');
  const [issueNotes, setIssueNotes] = useState('Called customer phone twice. No response. Security informed.');
  const [photoPreview, setPhotoPreview] = useState(
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&auto=format&fit=crop&q=80'
  );

  const handleConfirm = (e) => {
    e.preventDefault();

    if (!enteredOtp.trim()) {
      showToast('Please enter the 4-digit customer delivery OTP.', 'error');
      return;
    }

    if (enteredOtp.trim() !== expectedOtp.trim()) {
      showToast(
        `Incorrect OTP! Entered: "${enteredOtp}". Expected OTP is: "${expectedOtp}" (see order card for demo).`,
        'error'
      );
      return;
    }

    const res = confirmDelivery(order.id, {
      enteredOtp,
      proofNotes,
      photoUrl: photoPreview,
      paymentCollected: isCod ? codCollected : true,
    });

    if (res.success) {
      onClose();
    }
  };

  const handleReportIssue = (e) => {
    e.preventDefault();
    reportDeliveryIssue(order.id, {
      reason: issueReason,
      notes: issueNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-100 text-cyan-800 rounded-xl">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                Doorstep Delivery Handshake
              </span>
              <h3 className="text-lg font-black text-slate-900 font-mono mt-0.5">
                Order #{order.id}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showIssueMode ? (
          <form onSubmit={handleConfirm} className="space-y-4 text-xs">
            {/* Customer & Address Details */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <strong className="text-slate-900">{order.customer.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <strong className="text-slate-800">{order.customer.phone}</strong>
              </div>
              <div className="text-slate-600 pt-1 leading-snug">
                Address: {order.customer.address}
              </div>
            </div>

            {/* OTP Verification Input with Demo Helper */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-amber-950 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  Enter 4-Digit Customer Delivery OTP *
                </label>
                <button
                  type="button"
                  onClick={() => setEnteredOtp(expectedOtp)}
                  className="text-[10px] font-bold text-amber-800 underline hover:text-amber-950"
                  title="Click to auto-fill for demo testing"
                >
                  Auto-fill Demo OTP ({expectedOtp})
                </button>
              </div>

              <input
                type="text"
                maxLength="4"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="4-digit OTP"
                className="w-full text-center text-2xl font-mono font-black tracking-widest px-4 py-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
              />
              <span className="text-[10px] text-amber-800 block text-center">
                Simulated OTP sent to customer: <strong>{expectedOtp}</strong>
              </span>
            </div>

            {/* COD Cash Collection Notice */}
            {isCod && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    Cash on Delivery (COD) Amount Due
                  </span>
                  <span className="font-black text-emerald-950 text-base">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                <label className="flex items-center space-x-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={codCollected}
                    onChange={(e) => setCodCollected(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="font-semibold text-emerald-900">
                    I confirm that cash or QR payment of {formatCurrency(order.totalAmount)} has been received from the customer.
                  </span>
                </label>
              </div>
            )}

            {/* Photo Proof */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Proof of Delivery Photo
              </label>
              <div className="aspect-16/7 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                <img
                  src={photoPreview}
                  alt="Proof of Delivery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                  Timestamped Geo-Handover Verified
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Delivery Notes
              </label>
              <input
                type="text"
                value={proofNotes}
                onChange={(e) => setProofNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowIssueMode(true)}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold hover:underline"
              >
                Report Delivery Issue / Unavailable
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center space-x-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Delivery Handover</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Issue Mode */
          <form onSubmit={handleReportIssue} className="space-y-4 text-xs">
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900">
              <h4 className="font-bold text-sm mb-1">Report Failed Delivery / Exception</h4>
              <p className="text-[11px] text-rose-800">
                This flags the order for Hub operations and customer rescheduling without incorrectly marking it as delivered.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Issue Reason</label>
              <select
                value={issueReason}
                onChange={(e) => setIssueReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Customer Doorbell Unanswered">Customer Doorbell Unanswered</option>
                <option value="Customer Phone Unreachable">Customer Phone Unreachable</option>
                <option value="Customer Requested Reschedule">Customer Requested Reschedule to Evening</option>
                <option value="Incorrect Address / Access Denied">Incorrect Address / Gated Access Denied</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Field Notes</label>
              <textarea
                rows="3"
                value={issueNotes}
                onChange={(e) => setIssueNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowIssueMode(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md"
              >
                Submit Issue Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
