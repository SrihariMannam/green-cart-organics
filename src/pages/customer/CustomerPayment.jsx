import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatKg } from '../../utils/formatters';
import {
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Truck,
  Sparkles
} from 'lucide-react';

const DRAFT_CHECKOUT_KEY = 'gco_v1_checkout_draft';

export const CustomerPayment = () => {
  const navigate = useNavigate();
  const {
    cart,
    totalCartWeightKg,
    cartSubtotal,
    cartDeliveryFee,
    cartTotalAmount,
    placeOrder,
    showToast,
  } = useApp();

  // Load customer delivery address draft
  const [customerDetails, setCustomerDetails] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_CHECKOUT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'COD'
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [demoUpiId, setDemoUpiId] = useState('priyasharma@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // If cart is empty and no confirmed order yet, redirect to shop
  useEffect(() => {
    if (cart.length === 0 && !confirmedOrder) {
      navigate('/customer/shop');
    }
  }, [cart, confirmedOrder, navigate]);

  const handleProcessPayment = () => {
    if (!customerDetails) {
      showToast('Delivery address information missing. Please check out again.', 'error');
      navigate('/customer/checkout');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const res = placeOrder({
        customerDetails,
        paymentMethod,
        paymentDetails:
          paymentMethod === 'UPI'
            ? {
                txnId: `UPI-TXN-${Date.now().toString().slice(-6)}`,
                mockApp: selectedUpiApp,
                upiId: demoUpiId,
              }
            : null,
      });

      setIsProcessing(false);

      if (res.success) {
        setConfirmedOrder(res.order);
        // Clear draft from localStorage
        localStorage.removeItem(DRAFT_CHECKOUT_KEY);
      }
    }, 1200);
  };

  // If order was confirmed, show the successful confirmation screen!
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
              Order Confirmed & Broadcast to Farms
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
              Thank you for supporting organic farmers!
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
              Your order <strong className="text-slate-800">#{confirmedOrder.id}</strong> has been confirmed and is now broadcast to local organic farmers for morning harvest.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left text-xs space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-slate-500">Order ID:</span>{' '}
                <strong className="text-slate-900 font-mono text-sm">{confirmedOrder.id}</strong>
              </div>
              <div>
                <span className="text-slate-500">Payment Status:</span>{' '}
                <span className={`font-bold px-2 py-0.5 rounded-full ${confirmedOrder.paymentMethod === 'UPI' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {confirmedOrder.paymentMethod === 'UPI' ? 'Paid (Demo UPI)' : 'Pay on Delivery (COD)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-slate-400 block font-semibold">Delivery To:</span>
                <div className="font-bold text-slate-800 mt-0.5">{confirmedOrder.customer.name}</div>
                <div className="text-slate-600 leading-snug">{confirmedOrder.customer.address}</div>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Produce Summary:</span>
                <div className="font-bold text-slate-800 mt-0.5">
                  {confirmedOrder.items.length} products ({formatKg(confirmedOrder.totalWeightKg)})
                </div>
                <div className="text-forest-800 font-black text-base mt-1">
                  Total: {formatCurrency(confirmedOrder.totalAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Supply Chain Notice */}
          <div className="p-4 bg-lime-50 rounded-2xl border border-lime-200 text-left text-xs text-lime-950 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-lime-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-lime-900">Next Step: Farmer Acceptance</div>
              <p className="mt-0.5 text-lime-800 leading-relaxed">
                Eligible farmers are reviewing this order request now. Once claimed, harvest preparation and EV truck collection will begin.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to={`/customer/orders/${confirmedOrder.id}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-forest-700/20 transition active:scale-95"
            >
              <span>Track Farm-to-Home Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/customer/orders"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
            >
              View All My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
            Step 2 of 2: Simulated Payment
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Select Payment Method
          </h1>
        </div>
        <Link
          to="/customer/checkout"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          ← Edit Delivery Details
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Select Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* Option 1: Demo UPI */}
          <div
            onClick={() => setPaymentMethod('UPI')}
            className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer ${
              paymentMethod === 'UPI'
                ? 'border-forest-600 ring-4 ring-forest-50 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="w-4 h-4 text-forest-700 focus:ring-forest-500 cursor-pointer"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-forest-700" />
                    UPI Instant Payment (Simulated Demo)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fast & cashless. Simulates instant payment via UPI app.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Recommended
              </span>
            </div>

            {/* UPI Details when selected */}
            {paymentMethod === 'UPI' && (
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-4 text-xs animate-fade-in">
                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    Select Preferred Demo UPI App
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                      <button
                        type="button"
                        key={app}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUpiApp(app);
                        }}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                          selectedUpiApp === app
                            ? 'bg-forest-700 text-white border-forest-700 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Demo Virtual Payment Address (VPA)
                  </label>
                  <input
                    type="text"
                    value={demoUpiId}
                    onChange={(e) => setDemoUpiId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50 text-slate-700"
                    placeholder="name@upi"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Demo Simulation Notice:</strong> No real bank account will be charged. Clicking "Pay Now" will instantly simulate a successful UPI transaction and generate an official order ID.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Option 2: Cash on Delivery (COD) */}
          <div
            onClick={() => setPaymentMethod('COD')}
            className={`bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer ${
              paymentMethod === 'COD'
                ? 'border-forest-600 ring-4 ring-forest-50 shadow-md'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
                className="w-4 h-4 text-forest-700 focus:ring-forest-500 cursor-pointer"
              />
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-amber-600" />
                  Cash on Delivery (Pay on Delivery)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pay cash or scan QR code with delivery partner Arun Nair upon receiving your produce.
                </p>
              </div>
            </div>

            {paymentMethod === 'COD' && (
              <div className="mt-5 pt-4 border-t border-slate-100 text-xs animate-fade-in">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Fulfillment Rule:</strong> Your order will be placed as "Confirmed" and sent to farmers immediately. The payment status will remain <strong>Pay on Delivery</strong> until collected by the 2-wheeler delivery agent.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action CTA Button based on selected payment method */}
          <div className="pt-2">
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-xl transition active:scale-95 ${
                paymentMethod === 'UPI'
                  ? 'bg-forest-700 hover:bg-forest-800 text-white shadow-forest-700/20'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
              }`}
            >
              {isProcessing ? (
                <span>Simulating Secure Order Handshake...</span>
              ) : paymentMethod === 'UPI' ? (
                <>
                  <span>Pay Now ({formatCurrency(cartTotalAmount)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Confirm COD Order ({formatCurrency(cartTotalAmount)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Order Verification Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
              Order Details Verification
            </h3>

            {/* Destination Address */}
            {customerDetails && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Delivering To
                </span>
                <div className="font-bold text-slate-800">{customerDetails.fullName} ({customerDetails.phone})</div>
                <div className="text-slate-600">{customerDetails.addressLine}, {customerDetails.locality}, {customerDetails.city} - {customerDetails.pincode}</div>
                <div className="text-forest-700 font-semibold pt-1">
                  Slot: {customerDetails.preferredSlot}
                </div>
              </div>
            )}

            {/* Produce item list */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
              {cart.map(({ product, quantityKg }) => (
                <div key={product.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-slate-800">{product.name}</div>
                      <div className="text-[10px] text-slate-400">{quantityKg} kg × {formatCurrency(product.pricePerKg)}</div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">
                    {formatCurrency(product.pricePerKg * quantityKg)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span className="font-semibold">{cartDeliveryFee === 0 ? 'FREE' : formatCurrency(cartDeliveryFee)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-extrabold text-sm text-slate-900">Final Amount:</span>
                <span className="text-2xl font-black text-forest-900">
                  {formatCurrency(cartTotalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
