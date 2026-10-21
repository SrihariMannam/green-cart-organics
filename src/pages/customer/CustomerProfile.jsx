import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatKg } from '../../utils/formatters';
import { User, MapPin, Phone, Mail, Package, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerProfile = () => {
  const { users, orders } = useApp();
  const customer = users.customer;

  const customerOrders = orders.filter((o) => o.customer?.name === customer.name);
  const totalSpent = customerOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalKgBought = customerOrders.reduce((acc, o) => acc + (o.totalWeightKg || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-forest-800 text-lime-300 flex items-center justify-center font-black text-3xl shadow-lg shadow-forest-900/20 shrink-0">
          {customer.name.charAt(0)}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900">{customer.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Verified Organic Member
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {customer.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              {customer.phone}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {customer.defaultAddress.locality}, {customer.defaultAddress.city}
            </span>
          </div>
        </div>
      </div>

      {/* Highlights metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Farm Orders
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{customerOrders.length}</div>
          <span className="text-xs text-slate-500 mt-1 block">Harvest-to-home deliveries</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Organic Produce Consumed
          </span>
          <div className="text-2xl font-black text-forest-800 mt-1">{formatKg(totalKgBought)}</div>
          <span className="text-xs text-slate-500 mt-1 block">Certified pesticide-free weight</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Contribution
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalSpent)}</div>
          <span className="text-xs text-slate-500 mt-1 block">Direct farmer livelihood value</span>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-forest-700" />
          Saved Delivery Locations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {customer.savedAddresses?.map((addr) => (
            <div key={addr.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>{addr.title}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <div className="text-slate-600 leading-snug">{addr.addressLine}</div>
              <div className="text-slate-500">{addr.locality}, {addr.city} - {addr.pincode}</div>
              <div className="text-slate-400 pt-1">Phone: {addr.phone}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
