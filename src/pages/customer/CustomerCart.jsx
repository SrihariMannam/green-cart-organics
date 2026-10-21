import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatKg } from '../../utils/formatters';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const CustomerCart = () => {
  const navigate = useNavigate();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    vegetablesCount,
    fruitsCount,
    isVegetableRequirementMet,
    isFruitRequirementMet,
    isMinimumRequirementMet,
    totalCartWeightKg,
    cartSubtotal,
    cartDeliveryFee,
    cartTotalAmount,
  } = useApp();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-forest-50 text-forest-700 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-forest-100 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your organic cart is empty</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Explore our certified organic vegetables and fruits fresh from our local farmer partners.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/customer/vegetables"
            className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-sm transition"
          >
            🥦 Pick 3 Vegetables
          </Link>
          <Link
            to="/customer/fruits"
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition"
          >
            🍎 Pick 3 Fruits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Your Farm Basket
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {cart.length} distinct organic products ({formatKg(totalCartWeightKg)})
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Requirement Status Card */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              isMinimumRequirementMet
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-amber-50/80 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-start space-x-3">
              {isMinimumRequirementMet ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-bold text-sm">
                    {isMinimumRequirementMet
                      ? 'Farm Basket Requirement Met!'
                      : 'Minimum Selection Requirement Incomplete'}
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/60">
                    Rule: Min 3 Veg + 3 Fruits
                  </span>
                </div>
                <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                  {isMinimumRequirementMet
                    ? 'Great! Your basket contains at least 3 distinct vegetables and 3 distinct fruits. You are ready to proceed to checkout.'
                    : 'To support sustainable multi-crop farming, every customer order must include at least 3 distinct vegetables and 3 distinct fruits.'}
                </p>

                {/* Progress Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-black/10 text-xs font-semibold">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/80">
                    <span className="flex items-center gap-1.5">
                      <span>🥦 Vegetables:</span>
                      <strong className={vegetablesCount >= 3 ? 'text-emerald-700' : 'text-amber-800'}>
                        {vegetablesCount}/3 selected
                      </strong>
                    </span>
                    {vegetablesCount < 3 && (
                      <Link
                        to="/customer/vegetables"
                        className="text-xs font-bold text-forest-700 underline"
                      >
                        + Add {3 - vegetablesCount} more
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/80">
                    <span className="flex items-center gap-1.5">
                      <span>🍎 Fruits:</span>
                      <strong className={fruitsCount >= 3 ? 'text-emerald-700' : 'text-amber-800'}>
                        {fruitsCount}/3 selected
                      </strong>
                    </span>
                    {fruitsCount < 3 && (
                      <Link
                        to="/customer/fruits"
                        className="text-xs font-bold text-amber-700 underline"
                      >
                        + Add {3 - fruitsCount} more
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Table Cards */}
          <div className="space-y-3">
            {cart.map(({ product, quantityKg }) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                {/* Product Info */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                  />
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        product.category === 'vegetables'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {product.category === 'vegetables' ? 'Vegetable' : 'Fruit'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{product.originFarm.split(',')[0]}</p>
                    <div className="text-xs font-semibold text-forest-800 mt-1">
                      {formatCurrency(product.pricePerKg)} / kg
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end space-x-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                  {/* KG Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => updateCartQuantity(product.id, Math.max(0.5, quantityKg - 0.5))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-2xs hover:bg-slate-100 text-slate-700 active:scale-90 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-14 text-center text-xs font-bold text-slate-800">
                      {quantityKg} kg
                    </span>
                    <button
                      onClick={() => updateCartQuantity(product.id, quantityKg + 0.5)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-2xs hover:bg-slate-100 text-slate-700 active:scale-90 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-xs text-slate-400">Total</div>
                    <div className="text-base font-extrabold text-slate-900">
                      {formatCurrency(product.pricePerKg * quantityKg)}
                    </div>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/customer/shop"
              className="inline-flex items-center space-x-2 text-xs font-bold text-forest-700 hover:text-forest-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md sticky top-32 space-y-5">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Total Weight:</span>
                <span className="font-bold text-slate-800">{formatKg(totalCartWeightKg)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Delivery Fee:</span>
                <span className="font-semibold text-slate-800">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE (Above ₹500)</span>
                  ) : (
                    formatCurrency(cartDeliveryFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <div className="font-extrabold text-base text-slate-900">Grand Total</div>
                  <div className="text-[10px] text-slate-400">All taxes included</div>
                </div>
                <div className="text-2xl font-black text-forest-900">
                  {formatCurrency(cartTotalAmount)}
                </div>
              </div>
            </div>

            {/* Validation Notice & Checkout Button */}
            {!isMinimumRequirementMet ? (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Action Required:</strong>
                    {!isVegetableRequirementMet && !isFruitRequirementMet && (
                      <p className="mt-0.5">Please add at least 3 distinct vegetables and 3 distinct fruits before proceeding.</p>
                    )}
                    {!isVegetableRequirementMet && isFruitRequirementMet && (
                      <p className="mt-0.5">Please add at least {3 - vegetablesCount} more vegetable(s) to fulfill the 3-vegetable requirement.</p>
                    )}
                    {isVegetableRequirementMet && !isFruitRequirementMet && (
                      <p className="mt-0.5">Please add at least {3 - fruitsCount} more fruit(s) to fulfill the 3-fruit requirement.</p>
                    )}
                  </div>
                </div>

                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-200 text-slate-400 font-bold text-sm cursor-not-allowed text-center"
                >
                  Proceed to Checkout (Incomplete)
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/customer/checkout')}
                className="w-full py-4 px-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-forest-700/20 active:scale-95 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Reassurance points */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Certified Chemical-Free Organic</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-forest-600" />
                <span>Temperature controlled EV truck collection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
