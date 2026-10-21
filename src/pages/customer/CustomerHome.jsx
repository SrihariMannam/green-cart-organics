import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/customer/ProductCard';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Clock,
  HeartHandshake,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CustomerHome = () => {
  const navigate = useNavigate();
  const { products, cart, vegetablesCount, fruitsCount, isMinimumRequirementMet } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredVegetables = products.filter((p) => p.category === 'vegetables');
  const featuredFruits = products.filter((p) => p.category === 'fruits');

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-forest-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-lime-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-forest-800/80 border border-forest-600/50 text-xs font-semibold text-lime-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified 100% Residue-Free Organic Produce</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Fresh from our farms <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400">
                to your home.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Experience the authentic taste of harvest-fresh fruits and vegetables. Directly connected with organic farmers, aggregated at temperature-controlled hubs, and delivered to your doorstep in 24 hours.
            </p>

            {/* Minimum 3 Veg + 3 Fruit Requirement Callout Card */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-lime-300 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5" />
                  Wholesome Farm Basket Rule
                </span>
                <span className="text-[11px] text-slate-300">Min 3 Veg + 3 Fruits</span>
              </div>
              <p className="text-xs text-slate-200 leading-snug">
                To support farm biodiversity, each order includes at least 3 distinct vegetables and 3 distinct fruits.
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs font-semibold">
                <span className={`px-2.5 py-1 rounded-lg ${vegetablesCount >= 3 ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30' : 'bg-white/10 text-slate-300'}`}>
                  🥦 Vegetables: {vegetablesCount}/3
                </span>
                <span className={`px-2.5 py-1 rounded-lg ${fruitsCount >= 3 ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30' : 'bg-white/10 text-slate-300'}`}>
                  🍎 Fruits: {fruitsCount}/3
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/customer/shop"
                className="px-6 py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-forest-950 font-extrabold text-sm flex items-center space-x-2 transition shadow-lg shadow-lime-400/20 active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/customer/vegetables"
                className="px-6 py-3.5 rounded-xl bg-forest-800/80 hover:bg-forest-700 text-white font-bold text-sm border border-forest-600/60 transition active:scale-95"
              >
                Explore Vegetables
              </Link>
              <Link
                to="/customer/fruits"
                className="px-6 py-3.5 rounded-xl bg-forest-800/80 hover:bg-forest-700 text-white font-bold text-sm border border-forest-600/60 transition active:scale-95"
              >
                Explore Fruits
              </Link>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-4/3 group">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                alt="Farm fresh vegetables and fruits"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-lime-300 text-xs font-bold uppercase tracking-wider">
                  Direct Farm Sourcing
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  Mandya & Mysore Bio-Valleys
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Harvested at 5:00 AM daily, quality checked at central hub, delivered by afternoon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & QUICK FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search organic tomatoes, apples, carrots, spinach, mangoes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/customer/vegetables"
              className="flex-1 sm:flex-none text-center px-4 py-3 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-bold transition border border-forest-200"
            >
              🥦 Vegetables ({featuredVegetables.length})
            </Link>
            <Link
              to="/customer/fruits"
              className="flex-1 sm:flex-none text-center px-4 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition border border-amber-200"
            >
              🍎 Fruits ({featuredFruits.length})
            </Link>
          </div>
        </div>

        {/* Live Search Results if search query is typed */}
        {searchQuery.trim() && (
          <div className="mt-4 bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-800 mb-4">
              Search Results for “{searchQuery}” ({filteredProducts.length} items found)
            </h2>
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">
                No organic produce matches your search. Try searching for "Tomato", "Apple", "Carrot", etc.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. SUPPLY CHAIN HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">100% Organic Farms</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Zero synthetic pesticides or chemicals. Directly sourced from certified regional growers.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-800 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Harvested on Order</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Farmers harvest only upon order confirmation to ensure zero cold-storage aging.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-800 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Hub Quality Inspection</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Trucks transit to city hub where every batch is graded and sorted before packaging.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-cyan-100 text-cyan-800 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Transparent Tracking</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Full visibility from farmer claim to collection truck to 2-wheeler doorstep agent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED VEGETABLES CATALOG (Min 6 items) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <span>🥦 Fresh From Farm Soil</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Select Min 3</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Organic Farm Vegetables
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tomatoes, onions, carrots, potatoes, spinach, brinjals & bell peppers weighed in kilograms.
            </p>
          </div>
          <Link
            to="/customer/vegetables"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest-700 hover:text-forest-900 group"
          >
            <span>View All Vegetables ({featuredVegetables.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredVegetables.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. SPECIAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider">
              Special Organic Offer
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Enjoy Free Delivery on all farm baskets above ₹500
            </h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              Combine your favourite daily veggies with seasonal fruits. No delivery charges, harvested at dawn and at your door by afternoon.
            </p>
            <div className="pt-2">
              <Link
                to="/customer/shop"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-orange-900 font-extrabold text-xs shadow-md hover:bg-amber-50 active:scale-95 transition"
              >
                <span>Complete Your 3+3 Basket</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURED FRUITS CATALOG (Min 6 items) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <span>🍎 Tree-Ripened & Sweet</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Select Min 3</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Fresh Orchard Fruits
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kinnaur apples, Yellaki bananas, Nagpur oranges, Alphonso mangoes, grapes & pomegranates.
            </p>
          </div>
          <Link
            to="/customer/fruits"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest-700 hover:text-forest-900 group"
          >
            <span>View All Fruits ({featuredFruits.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredFruits.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
