import React from 'react';
import { HelpCircle, PhoneCall, Mail, MessageSquare, ShieldCheck, Leaf, Truck } from 'lucide-react';

export const CustomerSupport = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
          Customer Care
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
          Help & Customer Support
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Everything you need to know about Green Cart Organics farm sourcing, delivery timelines, and demo workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center mb-3">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Farm Helpline</h3>
          <p className="text-xs text-slate-500 mt-1">+91 80 4123 9900</p>
          <span className="text-[10px] text-slate-400 mt-2 block">Mon - Sat, 6:00 AM - 9:00 PM</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Email Support</h3>
          <p className="text-xs text-slate-500 mt-1">care@greencartorganics.in</p>
          <span className="text-[10px] text-slate-400 mt-2 block">Response within 2 hours</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">WhatsApp Farm Alerts</h3>
          <p className="text-xs text-slate-500 mt-1">+91 98765 00112</p>
          <span className="text-[10px] text-slate-400 mt-2 block">Live harvest photos & dispatch updates</span>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>

        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <h4 className="font-bold text-slate-900 text-sm">
              Why must each order contain at least 3 vegetables and 3 fruits?
            </h4>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Green Cart Organics practices regenerative community farming. Rather than monoculture harvests, our partner farmers cultivate biodiversity plots. Guaranteeing a multi-produce basket enables smallholder farmers to sell diverse yields without wastage while providing your household a well-rounded organic diet.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl">
            <h4 className="font-bold text-slate-900 text-sm">
              How does the First-Come, First-Served Farmer acceptance work?
            </h4>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              When a customer confirms an order, it is broadcast to certified farmers in that regional catchment. The first farmer who verifies stock availability claims the order. Once claimed, the order is locked so other farmers cannot claim it, ensuring accountability and prompt harvest.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl">
            <h4 className="font-bold text-slate-900 text-sm">
              How does the City Hub ensure freshness and quality?
            </h4>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Collection EV trucks transport produce from farm gates to the Central Aggregation Center. City Hub quality inspectors inspect every batch for physical defects, brix sweetness, and weigh the harvest. Any damaged produce is segregated, and only Grade A produce is packed into eco-crates for 2-wheeler delivery agents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
