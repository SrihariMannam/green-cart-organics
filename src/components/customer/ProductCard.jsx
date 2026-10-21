import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatKg } from '../../utils/formatters';
import { Plus, Minus, ShoppingBag, Star, ShieldCheck, MapPin } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart, cart } = useApp();
  const [selectedKg, setSelectedKg] = useState(1);

  // Check if item is already in cart
  const cartItem = cart.find((item) => item.product.id === product.id);

  const handleDecrease = () => {
    if (selectedKg > 0.5) {
      setSelectedKg((prev) => Math.max(0.5, prev - 0.5));
    }
  };

  const handleIncrease = () => {
    if (selectedKg < product.availableStock) {
      setSelectedKg((prev) => prev + 0.5);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedKg);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category tag */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs uppercase tracking-wider backdrop-blur-md ${
            product.category === 'vegetables'
              ? 'bg-emerald-600/90 text-white'
              : 'bg-amber-500/90 text-white'
          }`}
        >
          {product.category === 'vegetables' ? '🥦 Vegetable' : '🍎 Fruit'}
        </span>

        {/* Stock tag */}
        <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          Stock: {product.availableStock} kg
        </span>

        {product.bestSeller && (
          <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
            Bestseller
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Farm Origin & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center text-[11px] text-forest-700 font-medium truncate max-w-[180px]">
              <MapPin className="w-3 h-3 mr-1 shrink-0 text-forest-600" />
              {product.originFarm.split(',')[0]}
            </span>
            <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-forest-700 transition">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Quantity Selector */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xl font-black text-forest-900">
                {formatCurrency(product.pricePerKg)}
              </span>
              <span className="text-xs text-slate-500 font-medium"> / kg</span>
            </div>

            {/* Calculated item cost preview */}
            <div className="text-right">
              <span className="text-xs text-slate-400">Subtotal: </span>
              <span className="text-sm font-bold text-slate-700">
                {formatCurrency(product.pricePerKg * selectedKg)}
              </span>
            </div>
          </div>

          {/* Controls: Stepper & Add to Cart */}
          <div className="flex items-center space-x-2">
            {/* Quantity Stepper in KG */}
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 shrink-0">
              <button
                onClick={handleDecrease}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-2xs hover:bg-slate-100 text-slate-700 active:scale-90 transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center text-xs font-bold text-slate-800">
                {selectedKg} kg
              </span>
              <button
                onClick={handleIncrease}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-2xs hover:bg-slate-100 text-slate-700 active:scale-90 transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold transition shadow-sm active:scale-95 ${
                cartItem
                  ? 'bg-forest-100 text-forest-900 hover:bg-forest-200 border border-forest-300'
                  : 'bg-forest-700 hover:bg-forest-800 text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{cartItem ? `In Cart (${cartItem.quantityKg} kg)` : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
