import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatKg } from '../../utils/formatters';
import { X, CheckCircle, AlertTriangle, FileCheck2, Camera } from 'lucide-react';

export const QualityCheckModal = ({ order, onClose }) => {
  const { submitQualityInspection, showToast } = useApp();

  const receivedKg = order.hubReceipt?.receivedKg || order.pickupRecord?.collectedKg || order.totalWeightKg;

  const [acceptedKg, setAcceptedKg] = useState(receivedKg);
  const [rejectedKg, setRejectedKg] = useState(0);
  const [grade, setGrade] = useState('Grade A+ (Certified Organic Export Quality)');
  const [notes, setNotes] = useState('Passed physical firmness, pesticide residue test, and sugar brix standards.');
  const [photoPreview, setPhotoPreview] = useState(
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&auto=format&fit=crop&q=80'
  );

  const handleAcceptedChange = (val) => {
    const num = parseFloat(val) || 0;
    setAcceptedKg(num);
    const remainder = Math.max(0, receivedKg - num);
    setRejectedKg(Number(remainder.toFixed(1)));
  };

  const handleRejectedChange = (val) => {
    const num = parseFloat(val) || 0;
    setRejectedKg(num);
    const remainder = Math.max(0, receivedKg - num);
    setAcceptedKg(Number(remainder.toFixed(1)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const acc = Number(acceptedKg);
    const rej = Number(rejectedKg);

    if (acc < 0 || rej < 0) {
      showToast('Quantities cannot be negative.', 'error');
      return;
    }

    if (acc + rej > receivedKg + 0.05) {
      showToast(
        `Validation Error: Accepted (${acc} kg) + Rejected (${rej} kg) cannot exceed received quantity (${receivedKg} kg).`,
        'error'
      );
      return;
    }

    if (acc <= 0) {
      showToast('At least some produce must be accepted to pack the customer order.', 'error');
      return;
    }

    const res = submitQualityInspection(order.id, {
      inspectedBy: 'Deepak Verma (QC Lead)',
      acceptedKg: acc,
      rejectedKg: rej,
      grade,
      notes,
      photoUrl: photoPreview,
    });

    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-teal-100 text-teal-800 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                City Hub Quality Assurance
              </span>
              <h3 className="text-lg font-black text-slate-900 font-mono mt-0.5">
                Inspect Batch for Order #{order.id}
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Produce & Received Info */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Produce Consignment:</span>
              <strong className="text-slate-800">
                {order.items.map((it) => it.name).join(', ')}
              </strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Total Received at Hub:</span>
              <span className="font-extrabold text-forest-800 text-sm">{formatKg(receivedKg)}</span>
            </div>
          </div>

          {/* Accepted and Rejected Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Accepted Quantity (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={receivedKg}
                value={acceptedKg}
                onChange={(e) => handleAcceptedChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-forest-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                Eligible for packing
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Rejected / Defect Quantity (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={receivedKg}
                value={rejectedKg}
                onChange={(e) => handleRejectedChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-rose-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                Segregated for compost
              </span>
            </div>
          </div>

          {rejectedKg > 0 && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Rejection Noted:</strong> {formatKg(rejectedKg)} will be excluded from the customer box and logged in the farmer quality report.
              </div>
            </div>
          )}

          {/* Quality Grade */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Quality Grade Classification
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Grade A+ (Certified Organic Export Quality)">
                Grade A+ (Certified Organic Export Quality)
              </option>
              <option value="Grade A (Standard Fresh Direct Market)">
                Grade A (Standard Fresh Direct Market)
              </option>
              <option value="Grade B (Approved for Cooking / Juicing)">
                Grade B (Approved for Cooking / Juicing)
              </option>
            </select>
          </div>

          {/* Photo Preview */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Inspection Photo Record
            </label>
            <div className="aspect-16/7 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative">
              <img
                src={photoPreview}
                alt="QC Produce inspection"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                Brix Sugar: 12.4 · Moisture: Safe
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              QC Inspection Notes
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition"
            >
              Approve Quality & Move to Packing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
