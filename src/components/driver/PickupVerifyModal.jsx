import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatKg, formatCurrency } from '../../utils/formatters';
import { X, CheckCircle, Scale, Truck, Camera, AlertCircle } from 'lucide-react';

export const PickupVerifyModal = ({ order, onClose }) => {
  const { confirmPickupByDriver, activeProfileId, showToast } = useApp();

  const [collectedKg, setCollectedKg] = useState(
    order.actualPreparedKg || order.totalWeightKg || 1
  );
  const [condition, setCondition] = useState('Fresh & Excellent Condition (Sealed in EV Crates)');
  const [notes, setNotes] = useState('Weighed at farm scale. Inspected and loaded into temperature-controlled bay.');
  const [photoPreview, setPhotoPreview] = useState(
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=400&auto=format&fit=crop&q=80'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(collectedKg);
    if (isNaN(val) || val <= 0) {
      showToast('Please enter a valid collected weight in kg.', 'error');
      return;
    }

    const res = confirmPickupByDriver(order.id, {
      driverId: activeProfileId,
      collectedKg: val,
      condition,
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
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Farm-Gate Verification & Truck Loading
              </span>
              <h3 className="text-lg font-black text-slate-900 font-mono mt-0.5">
                Pickup for Order #{order.id}
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
          {/* Farm info banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Farm Location:</span>
              <strong className="text-slate-800">{order.customer.locality || 'Mandya Organic Zone'}</strong>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-slate-500">Ordered Produce:</span>
              <strong className="text-slate-800">
                {order.items.map((it) => `${it.name} (${it.quantityKg} kg)`).join(', ')}
              </strong>
            </div>
          </div>

          {/* Actual Collected Quantity */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Actual Weighed Produce Collected (kg) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={collectedKg}
                onChange={(e) => setCollectedKg(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                kg
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Farmer stated weight: {formatKg(order.actualPreparedKg || order.totalWeightKg)}
            </span>
          </div>

          {/* Condition Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Produce Physical Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Fresh & Excellent Condition (Sealed in EV Crates)">
                Fresh & Excellent Condition (Sealed in EV Crates)
              </option>
              <option value="Good Condition - Minor surface soil (Natural)">
                Good Condition - Minor surface soil (Natural)
              </option>
              <option value="Satisfactory - Slight moisture condensation">
                Satisfactory - Slight moisture condensation
              </option>
            </select>
          </div>

          {/* Photo Preview Placeholder */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Farm Gate Photo Verification</span>
              <span className="text-[10px] text-emerald-600 font-normal">Photo Verified</span>
            </label>
            <div className="aspect-16/7 w-full rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100">
              <img
                src={photoPreview}
                alt="Farm crate loading"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                Mandya EV Bay #3 · Crates Locked
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Driver Transit Notes
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. Crated and secured on EV chassis. Temp at 14°C."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm Pickup & Start Truck Transit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
