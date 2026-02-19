// src/components/ProductCard.tsx
import React, { useState } from 'react';
import { Product } from '@/types';
import { formatPrice, formatRelativeDate } from '@/utils/helpers';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isNew = new Date().getTime() - (product.createdAt instanceof Date ? product.createdAt.getTime() : 0) < 48 * 60 * 60 * 1000;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer card-press"
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {!imgLoaded && <div className="skeleton absolute inset-0" />}
        <img
          src={product.images[0] || 'https://via.placeholder.com/400x400?text=Photo'}
          alt={product.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badges top */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              NOUVEAU
            </span>
          )}
          {product.status === 'sold' && (
            <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              VENDU
            </span>
          )}
        </div>

        {/* WhatsApp count badge */}
        {product.whatsappClickCount > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            <span>👁</span>
            <span>{product.whatsappClickCount}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5">
        {/* Price */}
        <p className="text-base font-bold text-gray-900" style={{ fontFamily: 'Syne, sans-serif' }}>
          {formatPrice(product.price)}
        </p>

        {/* Title */}
        <h3 className="text-xs text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
          {product.title}
        </h3>

        {/* Seller row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-green-100 flex-shrink-0">
              {product.sellerPhoto ? (
                <img src={product.sellerPhoto} alt={product.sellerName} className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-green-600 text-[9px] font-bold">
                  {product.sellerName?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-500 truncate max-w-[70px]">{product.sellerName}</span>
            {product.sellerVerified && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="5" fill="#22C55E" />
                <path d="M3 5l1.5 1.5L7 3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-[10px] text-gray-400">📍{product.neighborhood}</span>
        </div>
      </div>
    </div>
  );
}
