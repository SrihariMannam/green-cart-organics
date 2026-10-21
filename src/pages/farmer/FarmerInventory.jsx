import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { formatKg } from '../../utils/formatters';
import { Boxes, Plus, Edit2, Check, X, Sparkles } from 'lucide-react';

export const FarmerInventory = () => {
  const { inventory, activeProfileId, users, showToast } = useApp();

  // Local state for adding new stock entry
  const [stockList, setStockList] = useState(
    inventory.filter((inv) => inv.farmerId === activeProfileId)
  );

  const [newProduce, setNewProduce] = useState({
    product: '',
    availableKg: '',
    harvestDate: new Date().toISOString().split('T')[0],
    grade: 'Grade A+',
  });

  const [editingId, setEditingId] = useState(null);
  const [editKg, setEditKg] = useState('');

  const currentFarmer =
    users.farmers.find((f) => f.id === activeProfileId) || users.farmers[0];

  const handleAddStock = (e) => {
    e.preventDefault();
    if (!newProduce.product.trim() || !newProduce.availableKg || Number(newProduce.availableKg) <= 0) {
      showToast('Please provide valid product name and positive quantity in kg', 'error');
      return;
    }

    const newEntry = {
      id: `inv-${Date.now()}`,
      farmerId: activeProfileId,
      product: newProduce.product,
      availableKg: Number(newProduce.availableKg),
      reservedKg: 0,
      harvestDate: newProduce.harvestDate,
      grade: newProduce.grade,
    };

    setStockList([newEntry, ...stockList]);
    setNewProduce({
      product: '',
      availableKg: '',
      harvestDate: new Date().toISOString().split('T')[0],
      grade: 'Grade A+',
    });
    showToast(`Added ${newEntry.availableKg} kg of ${newEntry.product} to farm stock!`, 'success');
  };

  const handleSaveEdit = (id) => {
    const val = parseFloat(editKg);
    if (isNaN(val) || val < 0) {
      showToast('Quantity must be a non-negative number in kg', 'error');
      return;
    }
    setStockList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, availableKg: val } : item))
    );
    setEditingId(null);
    showToast('Inventory quantity updated', 'success');
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Farm Produce Inventory"
        subtitle={`Available standing harvest & barn inventory for ${currentFarmer.farmName}`}
        breadcrumb={['Farmer Portal', 'Produce Inventory']}
      />

      <div className="px-6 space-y-6">
        {/* Add Produce Form */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-forest-700" />
            Register Harvest Yield / Add Produce Batch
          </h3>
          <form onSubmit={handleAddStock} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Produce Name</label>
              <input
                type="text"
                placeholder="e.g. Organic Tomatoes"
                value={newProduce.product}
                onChange={(e) => setNewProduce({ ...newProduce, product: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Available Quantity (kg)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                placeholder="e.g. 150"
                value={newProduce.availableKg}
                onChange={(e) => setNewProduce({ ...newProduce, availableKg: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Quality Grade</label>
              <select
                value={newProduce.grade}
                onChange={(e) => setNewProduce({ ...newProduce, grade: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                <option value="Grade A+">Grade A+ (Premium / Export)</option>
                <option value="Grade A">Grade A (Standard Organic)</option>
                <option value="Grade B">Grade B (Processing Grade)</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl transition shadow-xs"
              >
                + Add Batch
              </button>
            </div>
          </form>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Boxes className="w-4 h-4 text-forest-700" />
              Active Barn & Standing Crop Inventory
            </h3>
            <span className="text-xs text-slate-400">All quantities expressed in kilograms (kg)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Produce</th>
                  <th className="py-3 px-4 text-center">Available Stock</th>
                  <th className="py-3 px-4 text-center">Reserved for Orders</th>
                  <th className="py-3 px-4 text-center">Total Quantity</th>
                  <th className="py-3 px-4">Harvest Date</th>
                  <th className="py-3 px-4">Quality Grade</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.product}</td>
                    <td className="py-3.5 px-4 text-center">
                      {editingId === item.id ? (
                        <div className="flex items-center justify-center space-x-1">
                          <input
                            type="number"
                            step="0.5"
                            value={editKg}
                            onChange={(e) => setEditKg(e.target.value)}
                            className="w-20 px-2 py-1 text-center font-bold border border-lime-500 rounded-lg text-xs"
                          />
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-extrabold text-forest-800 text-sm">
                          {formatKg(item.availableKg)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center text-amber-700 font-semibold">
                      {formatKg(item.reservedKg || 0)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {formatKg(item.availableKg + (item.reservedKg || 0))}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{item.harvestDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-100 text-lime-900">
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {editingId !== item.id && (
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditKg(item.availableKg.toString());
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:text-forest-800 hover:bg-forest-50 rounded-lg font-semibold transition"
                        >
                          Edit Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
