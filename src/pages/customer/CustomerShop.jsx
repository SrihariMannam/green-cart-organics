import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/customer/ProductCard';
import { Search, Filter, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerShop = ({ initialCategory = 'all' }) => {
  const { products, cart, vegetablesCount, fruitsCount, isMinimumRequirementMet } = useApp();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filtered = products
    .filter((p) => {
      if (selectedCategory === 'all') return true;
      return p.category === selectedCategory;
    })
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.originFarm.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerKg - b.pricePerKg;
      if (sortBy === 'price-high') return b.pricePerKg - a.pricePerKg;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header & Live 3+3 Status Banner */}
      <div className="bg-gradient-to-r from-forest-900 to-forest-800 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span className="text-lime-300 text-xs font-bold uppercase tracking-wider">
              Organic Catalog
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-1 tracking-tight">
              {selectedCategory === 'vegetables'
                ? 'Fresh Farm Vegetables'
                : selectedCategory === 'fruits'
                ? 'Harvested Orchard Fruits'
                : 'All Farm-Fresh Organic Produce'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              All produce is priced and sold in kilograms. Direct farm harvest with guaranteed chemical-free certification.
            </p>
          </div>

          {/* 3 Veg + 3 Fruit Progress Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shrink-0">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold text-lime-300 flex items-center gap-1.5">
                {isMinimumRequirementMet ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                Order Requirement
              </span>
              <span className="text-[11px] text-slate-300">Min 3 Veg + 3 Fruit</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>🥦 Vegetables: {vegetablesCount}/3</span>
                  <span className={vegetablesCount >= 3 ? 'text-emerald-300' : 'text-amber-300'}>
                    {vegetablesCount >= 3 ? 'Ready' : `Need ${3 - vegetablesCount} more`}
                  </span>
                </div>
                <div className="w-48 h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (vegetablesCount / 3) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>🍎 Fruits: {fruitsCount}/3</span>
                  <span className={fruitsCount >= 3 ? 'text-emerald-300' : 'text-amber-300'}>
                    {fruitsCount >= 3 ? 'Ready' : `Need ${3 - fruitsCount} more`}
                  </span>
                </div>
                <div className="w-48 h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (fruitsCount / 3) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {cart.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">{cart.length} distinct items</span>
                <Link
                  to="/customer/cart"
                  className="text-xs font-bold text-lime-300 hover:text-lime-200 underline"
                >
                  Go to Cart →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Filter & Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Produce ({products.length})
          </button>
          <button
            onClick={() => setSelectedCategory('vegetables')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'vegetables'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🥦 Vegetables</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-900">
              {vegetablesCount}/3 in cart
            </span>
          </button>
          <button
            onClick={() => setSelectedCategory('fruits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'fruits'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🍎 Fruits</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900">
              {fruitsCount}/3 in cart
            </span>
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="default">Sort by: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* 3. Product Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No produce found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or switching categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
