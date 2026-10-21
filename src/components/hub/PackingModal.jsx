import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatKg } from '../../utils/formatters';
import { X, CheckCircle, PackageCheck, QrCode, Tag } from 'lucide-react';

export const PackingModal = ({ order, onClose }) => {
  const { packOrderAtHub, showToast } = useApp();

  const [packageCount, setPackageCount] = useState(1);
  const [packageWeightKg, setPackageWeightKg] = useState(
    order.qualityInspection?.acceptedKg || order.totalWeightKg
  );
  const [packageLabel, setPackageLabel] = useState(`PKG-${order.id}-CRATE1`);
  const [checkedItems, setCheckedItems] = useState(
    order.items.reduce((acc, it) => ({ ...acc, [it.id]: true }), {})
  );

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerateLabel = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setPackageLabel(`PKG-${order.id}-ECO${randomSuffix}`);
    showToast('Generated verified eco-crate barcode label!', 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allChecked = order.items.every((it) => checkedItems[it.id]);
    if (!allChecked) {
      showToast('Please verify and check all items before sealing the box.', 'warning');
      return;
    }

    const res = packOrderAtHub(order.id, {
      packedBy: 'Deepak Verma (Hub Packing Desk)',
      packageCount,
      packageWeightKg,
      packageLabel,
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
            <div className="p-2.5 bg-cyan-100 text-cyan-800 rounded-xl">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                Eco-Packaging & Labeling Station
              </span>
              <h3 className="text-lg font-black text-slate-900 font-mono mt-0.5">
                Pack Order #{order.id}
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
          {/* Packing checklist */}
          <div>
            <label className="block font-bold text-slate-700 mb-2">
              Produce Verification Checklist (Click to verify in box) *
            </label>
            <div className="space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50">
              {order.items.map((it) => (
                <label
                  key={it.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/60 cursor-pointer hover:bg-slate-50 transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={!!checkedItems[it.id]}
                      onChange={() => toggleCheck(it.id)}
                      className="w-4 h-4 text-cyan-600 rounded focus:ring-cyan-500 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800">{it.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-forest-800">
                    {it.quantityKg} kg
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Package Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Number of Eco-Crates / Boxes
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={packageCount}
                onChange={(e) => setPackageCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold bg-slate-50"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Final Sealed Box Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={packageWeightKg}
                onChange={(e) => setPackageWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold bg-slate-50 text-forest-800"
              />
            </div>
          </div>

          {/* Package Barcode Label */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Package Barcode Tracking ID
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={packageLabel}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold text-xs bg-slate-100 text-slate-800"
              />
              <button
                type="button"
                onClick={handleGenerateLabel}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                Regenerate
              </button>
            </div>
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
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition flex items-center space-x-1.5"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Mark as Packed & Ready for Dispatch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
