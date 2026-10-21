import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardHeader } from '../../components/common/DashboardHeader';
import { StatCard } from '../../components/common/StatCard';
import { formatCurrency, formatKg } from '../../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Leaf
} from 'lucide-react';

export const AdminReports = () => {
  const { orders, products, resetDemoData } = useApp();
  const [showResetModal, setShowResetModal] = useState(false);

  // Calculate demand for vegetables vs fruits
  let totalVegKg = 0;
  let totalFruitKg = 0;

  orders.forEach((o) => {
    o.items.forEach((it) => {
      if (it.category === 'vegetables') totalVegKg += it.quantityKg;
      else if (it.category === 'fruits') totalFruitKg += it.quantityKg;
    });
  });

  const totalProduceKg = totalVegKg + totalFruitKg || 1;
  const vegPercent = ((totalVegKg / totalProduceKg) * 100).toFixed(0);
  const fruitPercent = ((totalFruitKg / totalProduceKg) * 100).toFixed(0);

  // Status breakdown
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.fulfillmentStatus] = (acc[o.fulfillmentStatus] || 0) + 1;
    return acc;
  }, {});

  const deliveredCount = statusCounts['DELIVERED'] || 0;
  const deliveryCompletionRate =
    orders.length > 0 ? ((deliveredCount / orders.length) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Reports, Supply Dynamics & System Analytics"
        subtitle="Data-driven supply-chain metrics generated from live order records"
        breadcrumb={['Admin Portal', 'Reports & Analytics']}
      />

      <div className="px-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Delivery Success Rate"
            value={`${deliveryCompletionRate}%`}
            subtitle="OTP confirmed doorsteps"
            icon={CheckCircle2}
            color="forest"
          />
          <StatCard
            title="Total Harvest Handled"
            value={formatKg(totalProduceKg)}
            subtitle="Calculated from real items"
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="Veg / Fruit Parity Ratio"
            value={`${vegPercent}% : ${fruitPercent}%`}
            subtitle="Balanced farm basket"
            icon={Leaf}
            color="amber"
          />
        </div>

        {/* Chart 1: Vegetable vs Fruit Demand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4 text-forest-700" />
              Category Demand Breakdown (Vegetables vs Fruits)
            </h3>
            <p className="text-slate-500">
              Ratio of customer orders satisfying the 3-vegetables and 3-fruits minimum basket rule.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-emerald-800">🥦 Vegetables: {formatKg(totalVegKg)}</span>
                  <span>{vegPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${vegPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-amber-800">🍎 Fruits: {formatKg(totalFruitKg)}</span>
                  <span>{fruitPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${fruitPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Orders by Fulfillment Stage */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-700" />
              Active Orders by Lifecycle Stage
            </h3>
            <p className="text-slate-500">Live order distribution across supply-chain stages.</p>

            <div className="space-y-2 pt-1">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between py-1">
                  <span className="font-mono text-slate-700">{status}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600"
                        style={{ width: `${(count / orders.length) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reset Database Button with Confirmation */}
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-rose-950 text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              Reset Demonstration System
            </h4>
            <p className="text-xs text-rose-700">
              Restore all mock data in browser localStorage to original initial state.
            </p>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">
                Reset Demo Database?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                This will clear all localStorage keys and reinitialize the factory catalog, initial users, sample orders, and audit logs.
              </p>
            </div>
            <div className="flex justify-center space-x-2 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetModal(false);
                }}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
