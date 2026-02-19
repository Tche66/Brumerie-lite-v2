// src/pages/SellerProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { getUserById } from '@/services/userService';
import { getSellerProducts } from '@/services/productService';
import { Product, User } from '@/types';

interface SellerProfilePageProps {
  sellerId: string;
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

export function SellerProfilePage({ sellerId, onBack, onProductClick }: SellerProfilePageProps) {
  const [seller, setSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [sellerData, sellerProducts] = await Promise.all([
        getUserById(sellerId),
        getSellerProducts(sellerId),
      ]);
      setSeller(sellerData);
      setProducts(sellerProducts);
      setLoading(false);
    })();
  }, [sellerId]);

  const totalContacts = products.reduce((acc, p) => acc + (p.whatsappClickCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="font-bold text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
          {loading ? 'Chargement...' : `Profil de ${seller?.name || 'ce vendeur'}`}
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center pt-20 gap-4">
          <div className="w-12 h-12 border-3 border-green-200 border-t-orange-500 rounded-full animate-spin" style={{ borderWidth: 3 }} />
          <p className="text-gray-400 text-sm">Chargement du profil...</p>
        </div>
      ) : seller ? (
        <>
          {/* Seller card */}
          <div className="bg-white px-5 pt-6 pb-5 mb-2">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-green-100 flex-shrink-0">
                {seller.photoURL ? (
                  <img src={seller.photoURL} alt={seller.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-green-600 text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
                      {seller.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{seller.name}</h2>
                  {seller.isVerified && (
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      ✓ VÉRIFIÉ
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mt-0.5">📍 {seller.neighborhood}</p>
                <p className="text-gray-400 text-xs mt-0.5">Membre depuis {new Date(seller.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-green-600" style={{ fontFamily: 'Syne, sans-serif' }}>{products.length}</p>
                <p className="text-xs text-gray-500">Articles</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-green-600" style={{ fontFamily: 'Syne, sans-serif' }}>{seller.salesCount || 0}</p>
                <p className="text-xs text-gray-500">Ventes</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-blue-600" style={{ fontFamily: 'Syne, sans-serif' }}>{totalContacts}</p>
                <p className="text-xs text-gray-500">Contacts</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="px-3 pt-3">
            <h3 className="text-base font-bold mb-3 px-1" style={{ fontFamily: 'Syne, sans-serif' }}>
              Articles de {seller.name} ({products.length})
            </h3>
            {products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-500 text-sm">Aucun article en ligne</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 stagger">
                {products.map((product) => (
                  <div key={product.id} className="fade-up">
                    <ProductCard product={product} onClick={() => onProductClick(product)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center pt-20 text-center px-6">
          <div className="text-5xl mb-4">😕</div>
          <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Vendeur introuvable</h3>
          <p className="text-gray-500 text-sm">Ce profil n'existe pas ou a été supprimé</p>
          <button onClick={onBack} className="mt-4 text-green-600 underline text-sm">Retour</button>
        </div>
      )}
    </div>
  );
}
