import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatKg, formatCurrency } from '../../utils/formatters';
import { X, CheckCircle, AlertTriangle, Scale, Package } from 'lucide-react';

export const PrepareProduceModal = ({ order, onClose }) => {
  const { prepareProduceForOrder, showToast } = useApp();

  // Initialize prepared kg with ordered kg
  const [items, setItems] = useState(() =>
    order.items.map((it) => ({
      id: it.id,
      name: it.name,
      category: it.category,
      orderedKg: it.quantityKg,
      preparedKg: it.quantityKg,
      status: 'Harvested & Weighed',
    }))
  );

  const [notes, setNotes] = useState('Fresh morning harvest completed. Packed in ventilated eco-crates.');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleQtyChange = (id, newQty) => {
    const val = parseFloat(newQty);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, preparedKg: isNaN(val) ? 0 : Math.max(0, val) } : item
      )
    );
  };

  const totalOrderedKg = items.reduce((acc, it) => acc + it.orderedKg, 0);
  const totalPreparedKg = items.reduce((acc, it) => acc + (it.preparedKg || 0), 0);
  const isShortage = totalPreparedKg < totalOrderedKg;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (totalPreparedKg <= 0) {
      showToast('Prepared quantity must be greater than 0 kg.', 'error');
      return;
    }
    setShowConfirm(true);
  };

  const handleFinalConfirm = () => {
    const res = prepareProduceForOrder(order.id, {
      preparedItems: items,
      actualPreparedKg: totalPreparedKg,
      notes,
    });
    if (res.success) {
      setShowConfirm(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div>
            <span className="text-xs font-bold text-lime-700 uppercase tracking-wider">
              Produce Preparation & Harvest Weighing
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">
              Order #{order.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-xs text-slate-600">
            Enter the exact weighed produce in kilograms for each harvested item. If any crop has lower yield due to grading, record the actual available kilograms.
          </p>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Produce</th>
                  <th className="py-3 px-4 text-center">Ordered</th>
                  <th className="py-3 px-4 text-center">Actual Harvested (kg)</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <span className="text-[10px] text-slate-400 capitalize">{item.category}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-600">
                      {item.orderedKg} kg
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.preparedKg}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        className="w-20 text-center font-bold text-slate-900 px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 bg-slate-50"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.preparedKg < item.orderedKg ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Shortage: -{(item.orderedKg - item.preparedKg).toFixed(1)} kg
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Ready
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Weight Summary & Shortage warning */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Total Ordered:</span>{' '}
              <strong className="text-slate-800">{formatKg(totalOrderedKg)}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Total Prepared:</span>{' '}
              <strong className="text-forest-800 text-sm font-black">{formatKg(totalPreparedKg)}</strong>
            </div>
          </div>

          {isShortage && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Shortage Recorded:</strong> Actual prepared weight ({formatKg(totalPreparedKg)}) is lower than ordered weight ({formatKg(totalOrderedKg)}). The City Hub QC and invoice will reflect the exact actual quantity.
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Farmer Packing & Harvest Notes
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="e.g. Harvested at 8:00 AM, moisture wiped, packed in breathable perforated crates."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-xs shadow-md transition active:scale-95"
            >
              Mark Ready for Collection Pickup
            </button>
          </div>
        </form>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 bg-lime-100 text-lime-700 rounded-2xl flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  Confirm Dispatch to Collection?
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  This will mark Order #{order.id} as <strong>READY_FOR_PICKUP</strong> ({formatKg(totalPreparedKg)}) and dispatch a collection truck pickup notification to drivers.
                </p>
              </div>
              <div className="flex justify-center space-x-2 pt-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Go Back
                </button>
                <button
                  onClick={handleFinalConfirm}
                  className="px-5 py-2 text-xs font-bold bg-forest-700 hover:bg-forest-800 text-white rounded-xl shadow-md"
                >
                  Yes, Send to Collection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
