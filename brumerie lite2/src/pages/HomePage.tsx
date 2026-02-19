// src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/services/productService';
import { Product, CATEGORIES, NEIGHBORHOODS } from '@/types';

interface HomePageProps {
  onProductClick: (product: Product) => void;
  onProfileClick: () => void;
}

const ALL_CATEGORIES = [
  { id: 'all', name: 'Tout', icon: '✨' },
  ...CATEGORIES,
];

export function HomePage({ onProductClick, onProfileClick }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [showNeighborhoodFilter, setShowNeighborhoodFilter] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const filters = {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      neighborhood: selectedNeighborhood !== 'all' ? selectedNeighborhood : undefined,
      searchTerm: searchTerm || undefined,
    };
    const data = await getProducts(filters);
    setProducts(data);
    setLoading(false);
  }, [selectedCategory, selectedNeighborhood, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedNeighborhood !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header with integrated search */}
      <Header
        onProfileClick={onProfileClick}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
      />

      {/* Hero banner - only when no search */}
      {!searchTerm && selectedCategory === 'all' && (
        <div
          className="mx-3 mt-3 rounded-2xl p-5 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #16A34A 0%, #16A34A 60%, #15803D 100%)' }}
        >
          <div className="relative z-10">
            <p className="text-white/80 text-xs font-medium mb-1">Abidjan · Côte d'Ivoire</p>
            <h2 className="text-white text-xl font-bold leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              Le marché de<br />ton quartier, en ligne
            </h2>
            <p className="text-white/70 text-xs mt-2">
              {products.length > 0 ? `${products.length} articles disponibles` : 'Chargement...'}
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-10 w-40 h-40 rounded-full bg-white/8" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-60">🛍️</span>
        </div>
      )}

      {/* Category pills */}
      <div className="px-3 mt-4">
        <div className="cat-scroll">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-green-600 text-white border-green-600 shadow-green'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter row */}
      <div className="px-3 mt-3 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? (
            <span className="skeleton inline-block w-24 h-4 rounded" />
          ) : (
            <span>{products.length} article{products.length > 1 ? 's' : ''}</span>
          )}
        </p>

        <button
          onClick={() => setShowNeighborhoodFilter(!showNeighborhoodFilter)}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border transition-all ${
            selectedNeighborhood !== 'all'
              ? 'bg-green-50 border-green-500 text-green-700'
              : 'border-gray-200 text-gray-600'
          }`}
        >
          <span>📍</span>
          <span>{selectedNeighborhood !== 'all' ? selectedNeighborhood : 'Quartier'}</span>
          <span className={`transition-transform ${showNeighborhoodFilter ? 'rotate-180' : ''}`}>▾</span>
        </button>
      </div>

      {/* Neighborhood dropdown */}
      {showNeighborhoodFilter && (
        <div className="mx-3 mt-2 bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden fade-in z-20 relative">
          <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-gray-50">
            <button
              onClick={() => { setSelectedNeighborhood('all'); setShowNeighborhoodFilter(false); }}
              className={`px-4 py-3 text-sm text-left transition-colors ${selectedNeighborhood === 'all' ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              🗺️ Tous les quartiers
            </button>
            {NEIGHBORHOODS.map((n) => (
              <button
                key={n}
                onClick={() => { setSelectedNeighborhood(n); setShowNeighborhoodFilter(false); }}
                className={`px-4 py-3 text-sm text-left transition-colors ${selectedNeighborhood === n ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                📍 {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product grid */}
      <div className="px-3 mt-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 stagger">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl overflow-hidden fade-up">
                <div className="skeleton aspect-square" />
                <div className="p-2.5 space-y-2">
                  <div className="skeleton h-4 w-20 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              Aucun article trouvé
            </h3>
            <p className="text-gray-500 text-sm max-w-48 mx-auto leading-relaxed">
              Essaie d'autres filtres ou sois le premier à publier dans cette catégorie
            </p>
            {(selectedCategory !== 'all' || selectedNeighborhood !== 'all' || searchTerm) && (
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedNeighborhood('all'); setSearchTerm(''); }}
                className="mt-4 text-green-600 text-sm font-medium underline"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 stagger">
            {products.map((product, i) => (
              <div key={product.id} className="fade-up">
                <ProductCard
                  product={product}
                  onClick={() => onProductClick(product)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom padding for nav */}
      <div className="h-8" />
    </div>
  );
}
