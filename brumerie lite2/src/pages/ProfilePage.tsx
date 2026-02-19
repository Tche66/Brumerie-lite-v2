// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCard } from '@/components/ProductCard';
import { getSellerProducts, markProductAsSold, deleteProduct } from '@/services/productService';
import { Product } from '@/types';
import { formatPrice } from '@/utils/helpers';

interface ProfilePageProps {
  onProductClick: (product: Product) => void;
  onNavigate?: (page: string) => void;
}

export function ProfilePage({ onProductClick, onNavigate }: ProfilePageProps) {
  const { userProfile, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active');
  const [actionProduct, setActionProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (userProfile) loadUserProducts();
  }, [userProfile]);

  async function loadUserProducts() {
    if (!userProfile) return;
    setLoading(true);
    const data = await getSellerProducts(userProfile.id);
    setProducts(data);
    setLoading(false);
  }

  const activeProducts = products.filter(p => p.status === 'active');
  const soldProducts = products.filter(p => p.status === 'sold');
  const displayProducts = activeTab === 'active' ? activeProducts : soldProducts;

  if (!userProfile) return null;

  const totalWhatsAppClicks = products.reduce((acc, p) => acc + (p.whatsappClickCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Profile hero */}
      <div className="bg-white px-4 pt-6 pb-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-18 h-18 rounded-2xl overflow-hidden bg-green-100" style={{ width: 72, height: 72 }}>
              {userProfile.photoURL ? (
                <img src={userProfile.photoURL} alt={userProfile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-green-600 text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {userProfile.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {userProfile.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{userProfile.name}</h1>
              {userProfile.isVerified && (
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                  VÉRIFIÉ
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-0.5">📍 {userProfile.neighborhood}</p>
            <p className="text-gray-400 text-xs mt-0.5">{userProfile.email}</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-green-600" style={{ fontFamily: 'Syne, sans-serif' }}>
              {activeProducts.length}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">En ligne</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-green-600" style={{ fontFamily: 'Syne, sans-serif' }}>
              {userProfile.salesCount || soldProducts.length}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Vendus</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-blue-600" style={{ fontFamily: 'Syne, sans-serif' }}>
              {totalWhatsAppClicks}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Contacts</p>
          </div>
        </div>

        {/* Publication limit bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Publications ce mois</span>
            <span className={userProfile.publicationCount >= userProfile.publicationLimit ? 'text-red-500 font-bold' : 'text-green-600 font-medium'}>
              {userProfile.publicationCount}/{userProfile.publicationLimit}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (userProfile.publicationCount / userProfile.publicationLimit) * 100)}%`,
                background: userProfile.publicationCount >= userProfile.publicationLimit
                  ? '#EF4444'
                  : 'linear-gradient(90deg, #16A34A, #15803D)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white mt-2 px-4 border-b border-gray-100">
        <div className="flex">
          {['active', 'sold'].map((tab) => {
            const isActive = activeTab === tab;
            const count = tab === 'active' ? activeProducts.length : soldProducts.length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3.5 text-sm font-medium transition-all border-b-2 ${
                  isActive ? 'text-green-600 border-green-600' : 'text-gray-400 border-transparent'
                }`}
              >
                {tab === 'active' ? '🟢 En ligne' : '✅ Vendus'} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products */}
      <div className="px-3 pt-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl overflow-hidden">
                <div className="skeleton aspect-square" />
                <div className="p-2.5 space-y-2">
                  <div className="skeleton h-4 w-20 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-14">
            <div className="text-5xl mb-3">{activeTab === 'active' ? '📦' : '🎉'}</div>
            <p className="text-gray-500 text-sm">
              {activeTab === 'active' ? 'Aucun article en ligne' : 'Aucun article vendu pour l\'instant'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 stagger">
            {displayProducts.map((product) => (
              <div key={product.id} className="relative fade-up">
                <ProductCard product={product} onClick={() => onProductClick(product)} />
                {/* Action button */}
                {activeTab === 'active' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setActionProduct(product); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-green-600 transition-colors z-10"
                  >
                    ···
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 mt-8 space-y-2">
        <button
          onClick={() => onNavigate?.('settings')}
          className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
        >
          ⚙️ Paramètres & Infos
        </button>
        <button
          onClick={() => onNavigate?.('verification')}
          className={`w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all border ${
            userProfile.isVerified
              ? 'border-green-200 text-green-700 bg-green-50'
              : 'border-green-500 text-green-700 bg-green-50 hover:bg-green-100'
          }`}
        >
          🏅 {userProfile.isVerified ? '✓ Badge Vérifié actif' : 'Obtenir le badge Vérifié'}
        </button>
      </div>

      {/* Product action bottom sheet */}
      {actionProduct && (
        <div
          className="fixed inset-0 modal-backdrop z-50 flex items-end justify-center"
          onClick={() => setActionProduct(null)}
        >
          <div
            className="bg-white w-full max-w-[480px] rounded-t-3xl p-5 slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            {/* Product mini preview */}
            <div className="flex items-center gap-3 mb-5 bg-gray-50 rounded-xl p-3">
              <img src={actionProduct.images[0]} alt={actionProduct.title} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-semibold line-clamp-1">{actionProduct.title}</p>
                <p className="text-green-600 font-bold text-sm">{formatPrice(actionProduct.price)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={async () => {
                  await markProductAsSold(actionProduct.id);
                  await loadUserProducts();
                  setActionProduct(null);
                }}
                className="w-full py-3.5 rounded-xl bg-green-50 text-green-700 font-medium text-sm hover:bg-green-100 transition-all"
              >
                ✅ Marquer comme vendu
              </button>
              <button
                onClick={async () => {
                  if (confirm('Supprimer cet article ?')) {
                    await deleteProduct(actionProduct.id, userProfile.id);
                    await loadUserProducts();
                    setActionProduct(null);
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-all"
              >
                🗑️ Supprimer l'article
              </button>
              <button
                onClick={() => setActionProduct(null)}
                className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
