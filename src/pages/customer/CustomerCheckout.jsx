import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatKg } from '../../utils/formatters';
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const DRAFT_CHECKOUT_KEY = 'gco_v1_checkout_draft';

export const CustomerCheckout = () => {
  const navigate = useNavigate();
  const {
    cart,
    users,
    isMinimumRequirementMet,
    vegetablesCount,
    fruitsCount,
    totalCartWeightKg,
    cartSubtotal,
    cartDeliveryFee,
    cartTotalAmount,
    showToast,
  } = useApp();

  // Load initial draft from localStorage if present or user default
  const [formData, setFormData] = useState(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_CHECKOUT_KEY);
      if (savedDraft) return JSON.parse(savedDraft);
    } catch {}

    const def = users.customer.defaultAddress || {};
    return {
      fullName: def.fullName || 'Priya Sharma',
      phone: def.phone || '+91 98765 43210',
      addressLine: def.addressLine || 'Flat 402, Green Meadows Residency, 12th Main Road',
      locality: def.locality || 'Indiranagar',
      city: def.city || 'Bengaluru',
      pincode: def.pincode || '560038',
      deliveryInstructions: def.deliveryInstructions || 'Leave at door if not answered.',
      preferredSlot: 'Tomorrow Morning (08:00 AM - 11:00 AM)',
    };
  });

  const [formErrors, setFormErrors] = useState({});

  // Sync draft to localStorage so refresh doesn't lose inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    try {
      localStorage.setItem(DRAFT_CHECKOUT_KEY, JSON.stringify(updated));
    } catch {}
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) errors.phone = 'Mobile number is required';
    if (!formData.addressLine.trim()) errors.addressLine = 'Delivery address is required';
    if (!formData.locality.trim()) errors.locality = 'Area / locality is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.pincode.trim()) errors.pincode = 'Pincode is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();

    if (!isMinimumRequirementMet) {
      showToast(
        `Order requirement incomplete! Current: ${vegetablesCount}/3 veg, ${fruitsCount}/3 fruit.`,
        'error'
      );
      return;
    }

    if (!validate()) {
      showToast('Please fill in all required delivery details.', 'error');
      return;
    }

    // Save final verified draft and navigate to Payment page
    localStorage.setItem(DRAFT_CHECKOUT_KEY, JSON.stringify(formData));
    navigate('/customer/payment');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mt-2">Add produce to your basket before checking out.</p>
        <Link
          to="/customer/shop"
          className="mt-4 inline-block px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-bold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
            Step 1 of 2: Delivery Details
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Checkout & Delivery Address
          </h1>
        </div>
        <Link
          to="/customer/cart"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Delivery Address */}
        <div className="lg:col-span-7">
          <form onSubmit={handleProceedToPayment} className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-5 h-5 text-forest-700" />
                Shipping & Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 ${
                      formErrors.fullName ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                    }`}
                    placeholder="e.g. Priya Sharma"
                  />
                  {formErrors.fullName && (
                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                      {formErrors.fullName}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number (For Delivery OTP) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 ${
                      formErrors.phone ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                    }`}
                    placeholder="e.g. +91 98765 43210"
                  />
                  {formErrors.phone && (
                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                      {formErrors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street Address & Flat / House No. *
                </label>
                <input
                  type="text"
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 ${
                    formErrors.addressLine ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                  }`}
                  placeholder="e.g. Flat 402, Green Meadows, 12th Main Road"
                />
                {formErrors.addressLine && (
                  <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                    {formErrors.addressLine}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Locality / Area *
                  </label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 ${
                      formErrors.locality ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                    }`}
                    placeholder="e.g. Indiranagar"
                  />
                  {formErrors.locality && (
                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                      {formErrors.locality}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 ${
                      formErrors.city ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                    }`}
                    placeholder="e.g. Bengaluru"
                  />
                  {formErrors.city && (
                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                      {formErrors.city}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 ${
                      formErrors.pincode ? 'border-rose-400 bg-rose-50' : 'border-slate-200'
                    }`}
                    placeholder="e.g. 560038"
                  />
                  {formErrors.pincode && (
                    <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
                      {formErrors.pincode}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional Delivery Instructions
                </label>
                <textarea
                  rows="2"
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                  placeholder="e.g. Ring bell twice or leave with building security guard."
                />
              </div>

              {/* Delivery Slot Choice */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Preferred Delivery Slot
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Tomorrow Morning (08:00 AM - 11:00 AM)',
                    'Tomorrow Afternoon (01:00 PM - 04:00 PM)',
                    'Tomorrow Evening (05:00 PM - 08:00 PM)',
                    'Express Slot (Within 18 Hours)',
                  ].map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs cursor-pointer transition ${
                        formData.preferredSlot === slot
                          ? 'bg-forest-50 border-forest-600 text-forest-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredSlot"
                        value={slot}
                        checked={formData.preferredSlot === slot}
                        onChange={handleChange}
                        className="text-forest-700 focus:ring-forest-500"
                      />
                      <span>{slot}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-forest-700/20 active:scale-95 transition"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Summary: Itemized Produce & Kilograms */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Farm Produce in Order</span>
              <span className="text-xs font-normal text-slate-500">
                {cart.length} items · {formatKg(totalCartWeightKg)}
              </span>
            </h3>

            {/* Produce Items preview */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cart.map(({ product, quantityKg }) => (
                <div key={product.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{product.name}</div>
                      <span className="text-[10px] text-slate-500">
                        {formatCurrency(product.pricePerKg)}/kg × {quantityKg} kg
                      </span>
                    </div>
                  </div>
                  <div className="font-extrabold text-slate-800">
                    {formatCurrency(product.pricePerKg * quantityKg)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Produce Subtotal:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cold-Chain Transit:</span>
                <span className="font-semibold text-slate-800">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatCurrency(cartDeliveryFee)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-extrabold text-sm text-slate-900">Total Payable:</span>
                <span className="text-xl font-black text-forest-900">
                  {formatCurrency(cartTotalAmount)}
                </span>
              </div>
            </div>

            {/* Reassurance */}
            <div className="p-3 bg-forest-50/60 rounded-xl border border-forest-100 text-xs text-forest-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-forest-700" />
                Guaranteed Chemical-Free Sourcing
              </div>
              <p className="text-[11px] text-forest-700 leading-snug">
                Upon order confirmation, farmer will harvest fresh and hand over to our EV collection truck.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
