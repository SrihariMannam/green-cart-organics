import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, HeartHandshake, PhoneCall, Mail } from 'lucide-react';

export const CustomerFooter = () => {
  return (
    <footer className="bg-forest-950 text-slate-300 text-xs border-t border-forest-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-forest-700 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 text-lime-300" />
              </div>
              <span className="font-extrabold text-white text-base">Green Cart Organics</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Direct farm-to-doorstep organic produce aggregator. Fair prices to farmers, residue-free health to homes.
            </p>
            <div className="flex items-center gap-1.5 text-lime-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>NPOP & PGS India Certified Organic</span>
            </div>
          </div>

          {/* Sourcing Links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Organic Produce
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/customer/vegetables" className="hover:text-white transition">🥦 Farm Vegetables</Link></li>
              <li><Link to="/customer/fruits" className="hover:text-white transition">🍎 Orchard Fruits</Link></li>
              <li><Link to="/customer/shop" className="hover:text-white transition">✨ All Seasonal Harvest</Link></li>
              <li><Link to="/customer/orders" className="hover:text-white transition">📦 Track Live Order</Link></li>
            </ul>
          </div>

          {/* Supply Chain Portals */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Supply Chain Portals
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/farmer" className="hover:text-lime-300 transition">🌾 Farmer Portal</Link></li>
              <li><Link to="/collection-driver" className="hover:text-amber-300 transition">🚛 Collection Truck Driver</Link></li>
              <li><Link to="/city-hub" className="hover:text-indigo-300 transition">🏢 City Hub Aggregation & QC</Link></li>
              <li><Link to="/delivery-agent" className="hover:text-cyan-300 transition">🛵 2-Wheeler Delivery Agent</Link></li>
              <li><Link to="/admin" className="hover:text-purple-300 transition">🛡️ Platform Admin Console</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Customer & Farm Care
            </h4>
            <div className="text-slate-400">Toll-Free Helpline:</div>
            <div className="font-mono font-bold text-white text-sm">+91 80 4123 9900</div>
            <div className="text-slate-400 pt-1">Peenya Industrial Area Phase II, Bengaluru</div>
          </div>
        </div>

        <div className="pt-8 border-t border-forest-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Green Cart Organics. All rights reserved. Built as a full multi-role frontend application.
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/roles" className="hover:text-slate-300 transition">Role Gateway</Link>
            <Link to="/customer/support" className="hover:text-slate-300 transition">FAQ & Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
