import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Tractor,
  Truck,
  Building2,
  Bike,
  ShieldCheck,
  RotateCcw,
  Users,
  ChevronDown
} from 'lucide-react';

export const RoleSwitcherBar = () => {
  const navigate = useNavigate();
  const {
    activeRole,
    activeProfileId,
    switchRole,
    setRoleProfile,
    users,
    resetDemoData,
  } = useApp();

  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const roles = [
    { id: 'customer', label: '1. Customer', path: '/customer', icon: ShoppingBag, color: 'bg-emerald-600' },
    { id: 'farmer', label: '2. Farmer', path: '/farmer', icon: Tractor, color: 'bg-lime-600' },
    { id: 'driver', label: '3. Collection Truck', path: '/collection-driver', icon: Truck, color: 'bg-amber-600' },
    { id: 'hub', label: '4. City Hub Staff', path: '/city-hub', icon: Building2, color: 'bg-indigo-600' },
    { id: 'delivery', label: '5. Delivery Agent', path: '/delivery-agent', icon: Bike, color: 'bg-cyan-600' },
    { id: 'admin', label: '6. Admin Portal', path: '/admin', icon: ShieldCheck, color: 'bg-purple-600' },
  ];

  const handleRoleClick = (role) => {
    switchRole(role.id);
    navigate(role.path);
  };

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Role Switcher Tag */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-600 text-white uppercase tracking-wider">
            Demo Control Bar
          </span>
          <span className="hidden sm:inline text-slate-400">Switch Live Portals:</span>
        </div>

        {/* Center: Six Role Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleRoleClick(r)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-all font-medium ${
                  isActive
                    ? `${r.color} text-white shadow-sm ring-1 ring-white/30 scale-105`
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Sub-profile Selector & Reset */}
        <div className="flex items-center space-x-3">
          {/* Sub-profile switcher for Farmer simulation (First-come first-served) */}
          {activeRole === 'farmer' && (
            <div className="flex items-center space-x-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-[10px] text-lime-400 font-semibold">Active Farmer:</span>
              <select
                value={activeProfileId}
                onChange={(e) => setRoleProfile(e.target.value)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
              >
                {users.farmers.map((f) => (
                  <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                    {f.name} ({f.farmName.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sub-profile switcher for Driver */}
          {activeRole === 'driver' && (
            <div className="flex items-center space-x-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-[10px] text-amber-400 font-semibold">Driver:</span>
              <select
                value={activeProfileId}
                onChange={(e) => setRoleProfile(e.target.value)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
              >
                {users.collectionDrivers.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                    {d.name} ({d.vehicleNumber})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sub-profile switcher for Delivery */}
          {activeRole === 'delivery' && (
            <div className="flex items-center space-x-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-[10px] text-cyan-400 font-semibold">Agent:</span>
              <select
                value={activeProfileId}
                onChange={(e) => setRoleProfile(e.target.value)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
              >
                {users.deliveryAgents.map((a) => (
                  <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                    {a.name} ({a.zone.split(':')[0]})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Demo State Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center space-x-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 px-2 py-1 rounded transition"
            title="Reset all demo data in localStorage to initial values"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-800 rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              Reset Demo State?
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              This will restore all products, sample orders, inventory records, and notifications to their initial state.
            </p>
            <div className="flex justify-end space-x-2 mt-5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
