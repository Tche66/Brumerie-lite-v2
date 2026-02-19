// src/pages/ProductDetailPage.tsx
import React, { useState } from 'react';
import { Product } from '@/types';
import { generateWhatsAppLink, formatPrice, formatRelativeDate } from '@/utils/helpers';
import { incrementWhatsAppClick } from '@/services/productService';
import { useAuth } from '@/contexts/AuthContext';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onSellerClick: (sellerId: string) => void;
}

const CONDITION_LABELS: Record<string, string> = {
  new: 'Neuf',
  'like-new': 'Comme neuf',
  good: 'Bon état',
  fair: 'État correct',
};

export function ProductDetailPage({ product, onBack, onSellerClick }: ProductDetailPageProps) {
  const { currentUser } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [contacted, setContacted] = useState(false);

  const handleWhatsAppClick = () => {
    if (!currentUser) return;
    setShowWhatsAppModal(true);
  };

  const handleConfirmWhatsApp = () => {
    incrementWhatsAppClick(product.id);
    const link = generateWhatsAppLink(product.sellerPhone, product.title, product.price);
    window.open(link, '_blank');
    setShowWhatsAppModal(false);
    setContacted(true);
  };

  const isNew = new Date().getTime() - (product.createdAt instanceof Date ? product.createdAt.getTime() : 0) < 48 * 60 * 60 * 1000;

  return (
    <div className="min-h-screen bg-white">
      {/* Image hero + back btn */}
      <div className="relative bg-gray-100" style={{ aspectRatio: '1/1' }}>
        <img
          src={product.images[currentImageIndex] || 'https://via.placeholder.com/600'}
          alt={product.title}
          className="w-full h-full object-cover"
        />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Image dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`rounded-full transition-all ${idx === currentImageIndex ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/60'}`}
              />
            ))}
          </div>
        )}

        {/* Image thumbnails if multiple */}
        {product.images.length > 1 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-green-600' : 'border-white/60'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 right-16 flex flex-col gap-1">
          {isNew && <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NOUVEAU</span>}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5">
        {/* Price + category */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
              {formatPrice(product.price)}
            </p>
            <p className="text-sm text-gray-400 mt-0.5">
              📍 {product.neighborhood} · {formatRelativeDate(product.createdAt)}
            </p>
          </div>
          <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-xl border border-green-100">
            {CATEGORIES_MAP[product.category] || product.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          {product.title}
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-5 whitespace-pre-wrap">
          {product.description}
        </p>

        {/* Stats row */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-gray-800">{product.whatsappClickCount || 0}</p>
            <p className="text-xs text-gray-500">contacts</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-gray-800">{formatRelativeDate(product.createdAt)}</p>
            <p className="text-xs text-gray-500">publié</p>
          </div>
        </div>

        {/* Seller card */}
        <button
          onClick={() => onSellerClick(product.sellerId)}
          className="w-full border border-gray-100 rounded-2xl p-4 mb-6 hover:bg-gray-50 transition-all text-left"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <p className="text-xs text-gray-400 mb-2 font-medium">VENDEUR</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-green-100 flex-shrink-0">
              {product.sellerPhoto ? (
                <img src={product.sellerPhoto} alt={product.sellerName} className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-green-600 text-xl font-bold">
                  {product.sellerName?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{product.sellerName}</p>
                {product.sellerVerified && (
                  <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✓ Vérifié
                  </span>
                )}
              </div>
              <p className="text-xs text-green-600 mt-0.5">Voir le profil →</p>
            </div>
          </div>
        </button>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 px-4 py-3 z-40">
        <button
          onClick={handleWhatsAppClick}
          disabled={product.status === 'sold'}
          className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-200 ${
            product.status === 'sold'
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : contacted
              ? 'bg-green-500 text-white'
              : 'text-white'
          }`}
          style={product.status !== 'sold' && !contacted ? {
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.35)',
          } : {}}
        >
          {product.status === 'sold' ? (
            '❌ Article vendu'
          ) : contacted ? (
            '✅ Message envoyé sur WhatsApp'
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 32 32" fill="white">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.82.736 5.469 2.027 7.766L0 32l8.437-2.016A15.942 15.942 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.091c-2.65 0-5.116-.71-7.228-1.943l-.518-.307-5.01 1.197 1.239-4.859-.338-.527A12.987 12.987 0 013.014 16C3.014 8.902 8.902 3.014 16 3.014S28.986 8.902 28.986 16 23.098 29.086 16 29.086v.005zm7.174-9.866c-.393-.197-2.327-1.148-2.688-1.278-.362-.131-.625-.197-.889.197-.262.393-1.018 1.278-1.247 1.54-.23.263-.46.296-.854.099-.394-.197-1.662-.614-3.164-1.95-1.169-1.043-1.96-2.33-2.19-2.724-.23-.394-.025-.606.173-.802.177-.176.394-.46.59-.689.197-.23.263-.394.394-.657.131-.262.066-.492-.033-.689-.099-.197-.889-2.143-1.22-2.934-.32-.77-.646-.665-.889-.677-.229-.01-.492-.012-.754-.012s-.689.099-.1049.492c-.362.394-1.38 1.345-1.38 3.28s1.412 3.806 1.609 4.069c.197.263 2.778 4.243 6.73 5.951.941.406 1.675.649 2.247.83.945.3 1.804.257 2.483.157.757-.114 2.327-.951 2.656-1.87.329-.919.329-1.707.23-1.871-.099-.164-.362-.263-.755-.46z"/>
              </svg>
              Contacter sur WhatsApp
            </>
          )}
        </button>
      </div>

      {/* Bottom spacer for CTA */}
      <div className="h-24" />

      {/* WhatsApp confirmation modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 modal-backdrop z-50 flex items-end justify-center" onClick={() => setShowWhatsAppModal(false)}>
          <div
            className="bg-white w-full max-w-[480px] rounded-t-3xl p-6 slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              Contacter {product.sellerName}
            </h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              Tu vas être redirigé vers WhatsApp avec un message pré-rempli pour cet article.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>⚠️ Conseil :</strong> Brumerie facilite la mise en relation. Privilégie les vendeurs vérifiés (badge vert) et évite les paiements à distance avant de voir l'article.
              </p>
            </div>

            {/* Product preview */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-5">
              <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-semibold text-gray-800 line-clamp-1">{product.title}</p>
                <p className="text-green-600 font-bold text-sm">{formatPrice(product.price)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmWhatsApp}
                className="flex-1 py-3.5 rounded-xl text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
              >
                💬 Ouvrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper map
const CATEGORIES_MAP: Record<string, string> = {
  electronics: '📱 Électronique',
  fashion: '👕 Mode',
  home: '🏠 Maison',
  beauty: '💄 Beauté',
  sports: '⚽ Sport',
  books: '📚 Livres',
  toys: '🧸 Jouets',
  other: '📦 Autre',
};
