import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatKg } from '../../utils/formatters';
import {
  ShoppingBag,
  Leaf,
  Bell,
  User,
  Search,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

export const CustomerNavbar = () => {
  const navigate = useNavigate();
  const {
    cart,
    vegetablesCount,
    fruitsCount,
    isMinimumRequirementMet,
    totalCartWeightKg,
    cartTotalAmount,
    notifications,
    users,
    markNotificationAsRead,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const customerNotifications = notifications.filter(
    (n) => n.targetRole === 'customer' || !n.targetRole
  );
  const unreadCount = customerNotifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-8 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top green accent strip */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-700 text-forest-100 text-xs py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Leaf className="w-3.5 h-3.5 text-forest-300" />
        <span>100% Certified Organic · Farm-to-Kitchen Direct Supply in 24 Hours · Free Delivery above ₹500</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/customer" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-forest-600 to-forest-900 flex items-center justify-center text-white shadow-md shadow-forest-900/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 text-lime-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-forest-950 font-sans">
                  Green Cart
                </span>
                <span className="text-xs font-bold uppercase tracking-wider bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full">
                  Organics
                </span>
              </div>
              <p className="text-[11px] text-forest-700 font-medium italic">
                “Fresh from our farms to your home.”
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink
              to="/customer"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? 'bg-forest-50 text-forest-800 font-bold'
                    : 'text-slate-600 hover:text-forest-700 hover:bg-slate-50'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/customer/shop"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? 'bg-forest-50 text-forest-800 font-bold'
                    : 'text-slate-600 hover:text-forest-700 hover:bg-slate-50'
                }`
              }
            >
              All Produce
            </NavLink>
            <NavLink
              to="/customer/vegetables"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-forest-50 text-forest-800 font-bold'
                    : 'text-slate-600 hover:text-forest-700 hover:bg-slate-50'
                }`
              }
            >
              <span>🥦 Vegetables</span>
            </NavLink>
            <NavLink
              to="/customer/fruits"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-forest-50 text-forest-800 font-bold'
                    : 'text-slate-600 hover:text-forest-700 hover:bg-slate-50'
                }`
              }
            >
              <span>🍎 Fruits</span>
            </NavLink>
            <NavLink
              to="/customer/orders"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? 'bg-forest-50 text-forest-800 font-bold'
                    : 'text-slate-600 hover:text-forest-700 hover:bg-slate-50'
                }`
              }
            >
              My Orders
            </NavLink>
            <NavLink
              to="/customer/support"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? 'bg-forest-50 text-forest-800 font-bold'
                    : 'text-slate-600 hover:text-forest-700 hover:bg-slate-50'
                }`
              }
            >
              Help & Support
            </NavLink>
          </nav>

          {/* Right Action Icons: 3-Veg & 3-Fruit Requirement Pill + Cart + Notifications + Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Requirement Indicator Pill */}
            <div
              onClick={() => navigate('/customer/cart')}
              className={`hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition ${
                isMinimumRequirementMet
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
              title="Requirement: Order at least 3 vegetables and 3 fruits in one order"
            >
              {isMinimumRequirementMet ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <div className="font-semibold">
                <span className={vegetablesCount >= 3 ? 'text-emerald-700 font-bold' : 'text-amber-800'}>
                  Veg: {vegetablesCount}/3
                </span>
                <span className="mx-1 text-slate-300">·</span>
                <span className={fruitsCount >= 3 ? 'text-emerald-700 font-bold' : 'text-amber-800'}>
                  Fruit: {fruitsCount}/3
                </span>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-600 hover:text-forest-800 hover:bg-forest-50 rounded-xl relative transition"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                    <span className="text-xs text-forest-700 font-medium">Customer Portal</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {customerNotifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      customerNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.orderId) {
                              navigate(`/customer/orders/${notif.orderId}`);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${
                            !notif.read ? 'bg-forest-50/50' : ''
                          }`}
                        >
                          <div className="font-semibold text-slate-800 flex items-center justify-between">
                            <span>{notif.title}</span>
                            <span className="text-[10px] text-slate-400">{notif.time}</span>
                          </div>
                          <p className="text-slate-600 mt-1 leading-snug">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <Link
              to="/customer/cart"
              className="flex items-center space-x-2 bg-forest-700 hover:bg-forest-800 text-white px-3.5 py-2 rounded-xl font-semibold text-sm transition shadow-sm hover:shadow-md active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cart.length > 0 ? formatCurrency(cartTotalAmount) : 'Cart'}
              </span>
            </Link>

            {/* Profile Avatar / Link */}
            <Link
              to="/customer/profile"
              className="hidden sm:flex items-center space-x-2 p-1.5 pl-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-slate-700 text-xs font-semibold"
            >
              <span>{users.customer.name.split(' ')[0]}</span>
              <div className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center text-xs font-bold">
                P
              </div>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/customer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-forest-50"
          >
            Home
          </Link>
          <Link
            to="/customer/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-forest-50"
          >
            All Produce
          </Link>
          <Link
            to="/customer/vegetables"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-forest-50"
          >
            🥦 Vegetables ({vegetablesCount}/3 in cart)
          </Link>
          <Link
            to="/customer/fruits"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-forest-50"
          >
            🍎 Fruits ({fruitsCount}/3 in cart)
          </Link>
          <Link
            to="/customer/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-forest-50"
          >
            My Orders
          </Link>
          <Link
            to="/customer/support"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-forest-50"
          >
            Help & Support
          </Link>
          <Link
            to="/customer/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-forest-50"
          >
            My Profile
          </Link>
        </div>
      )}
    </header>
  );
};
