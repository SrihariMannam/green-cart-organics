import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Tractor,
  Truck,
  Building2,
  Bike,
  ShieldCheck,
  ArrowRight,
  Leaf,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const RoleSelectPage = () => {
  const navigate = useNavigate();
  const { switchRole, resetDemoData, orders } = useApp();

  const portals = [
    {
      id: 'customer',
      title: 'Customer Portal',
      roleSubtitle: 'Shop, Order & Track Live',
      desc: 'Browse organic produce, fulfill the 3-veg + 3-fruit requirement, checkout with simulated UPI or COD, and track the 8-step farm journey.',
      icon: ShoppingBag,
      path: '/customer',
      color: 'from-emerald-600 to-teal-700',
      badge: 'Active Shopping',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      features: ['Minimum 3 Veg + 3 Fruit validation', 'Simulated UPI & COD', 'Live 8-Step Timeline', 'Delivery OTP view'],
    },
    {
      id: 'farmer',
      title: 'Farmer Portal',
      roleSubtitle: 'First-Come Claim & Harvest',
      desc: 'Regional farmers claim customer requests on a first-come, first-served basis, enter actual harvested kilograms, and send produce to collection trucks.',
      icon: Tractor,
      path: '/farmer',
      color: 'from-lime-600 to-emerald-700',
      badge: 'Farm Gates',
      badgeColor: 'bg-lime-100 text-lime-900',
      features: ['First-come claim concurrency', 'Harvest weighing in kg', 'Shortage recording', 'Pickup schedule'],
    },
    {
      id: 'driver',
      title: 'Collection Driver Portal',
      roleSubtitle: 'Rural Farm to City Hub',
      desc: 'Truck drivers verify weighed crates at farm gates, audit produce condition, transport through rural EV corridors, and unload at the city hub dock.',
      icon: Truck,
      path: '/collection-driver',
      color: 'from-amber-600 to-orange-700',
      badge: 'Heavy EV Truck',
      badgeColor: 'bg-amber-100 text-amber-900',
      features: ['Farm-gate weighing', 'Cold-chain telemetry', 'Corridor route stops', 'City hub arrival handoff'],
    },
    {
      id: 'hub',
      title: 'City Hub Staff Portal',
      roleSubtitle: 'QC, Sorting & Packaging',
      desc: 'Inspect incoming truck consignments, record accepted vs rejected kilograms, sort into customer eco-crates, print barcode labels, and dispatch to riders.',
      icon: Building2,
      path: '/city-hub',
      color: 'from-indigo-600 to-purple-700',
      badge: 'Aggregation Hub',
      badgeColor: 'bg-indigo-100 text-indigo-900',
      features: ['Accepted + Rejected kg check', 'Grade A+ export grading', 'Eco-crate barcode labels', 'Assign to 2-wheeler riders'],
    },
    {
      id: 'delivery',
      title: 'Delivery Agent Portal',
      roleSubtitle: 'Last-Mile Express Doorstep',
      desc: 'Two-wheeler electric delivery riders receive dispatched packages, navigate route stops, verify customer OTP, and confirm cash collection for COD.',
      icon: Bike,
      path: '/delivery-agent',
      color: 'from-cyan-600 to-blue-700',
      badge: '2-Wheeler Fleet',
      badgeColor: 'bg-cyan-100 text-cyan-900',
      features: ['Urban delivery route', '4-digit OTP validation', 'COD cash recording', 'Delivery issue reporting'],
    },
    {
      id: 'admin',
      title: 'Admin Operations Portal',
      roleSubtitle: 'Complete End-to-End Control',
      desc: 'Full operational visibility across all customers, farmers, drivers, transit stages, itemized kilograms, financial settlements, and live analytics.',
      icon: ShieldCheck,
      path: '/admin',
      color: 'from-purple-700 to-slate-900',
      badge: 'Full Platform View',
      badgeColor: 'bg-purple-100 text-purple-900',
      features: ['Live derived statistics', 'Itemized kilograms audit', 'Multi-stage transit tracker', 'Reset demo database'],
    },
  ];

  const handleEnterPortal = (portal) => {
    switchRole(portal.id);
    navigate(portal.path);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Background radial glow */}
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-forest-900 border border-forest-700 text-xs font-bold text-lime-300">
            <Leaf className="w-4 h-4 text-lime-400" />
            <span>Farm-to-Customer Supply Chain Web Application</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Green Cart Organics
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Select any role below to enter the live connected prototype. All six portals share underlying data in browser localStorage to demonstrate the entire agricultural supply chain.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleEnterPortal(portals[0])}
              className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center space-x-2"
            >
              <span>Start as Customer Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEnterPortal(portals[5])}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
            >
              View Admin Control Panel
            </button>
          </div>
        </div>

        {/* Six Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                onClick={() => handleEnterPortal(portal)}
                className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700/80 hover:border-forest-500 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${portal.badgeColor}`}
                    >
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-lime-300 transition-colors">
                    {portal.title}
                  </h3>
                  <div className="text-xs font-semibold text-slate-400 mt-0.5">
                    {portal.roleSubtitle}
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {portal.desc}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-1.5">
                    {portal.features.map((feat, i) => (
                      <div key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between text-xs font-bold text-lime-400 group-hover:text-lime-300">
                  <span>Enter Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Reset Bar */}
        <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <strong className="text-slate-200">Shared Data Persistence:</strong> State is saved in browser localStorage (<code className="text-lime-400 font-mono">gco_v1_*</code>). Actions in one portal immediately update all other dashboards.
          </div>
          <button
            onClick={() => resetDemoData()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold rounded-xl border border-slate-700 transition flex items-center space-x-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Factory Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
