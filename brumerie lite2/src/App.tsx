// src/App.tsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { SellPage } from '@/pages/SellPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SellerProfilePage } from '@/pages/SellerProfilePage';
import { EditProfilePage } from '@/pages/EditProfilePage';
import { VerificationPage } from '@/pages/VerificationPage';
import { SupportPage } from '@/pages/SupportPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { BottomNav } from '@/components/BottomNav';
import { Product } from '@/types';

type Page =
  | 'home' | 'profile' | 'sell'
  | 'product-detail' | 'seller-profile'
  | 'edit-profile' | 'verification' | 'support'
  | 'settings' | 'privacy' | 'terms' | 'about';

function AppContent() {
  const { currentUser } = useAuth();
  const [activePage, setActivePage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<Page>('home');

  if (!currentUser) return <AuthPage />;

  const MAIN_PAGES: Page[] = ['home', 'profile'];

  const navigate = (page: Page) => {
    setPrevPage(activePage);
    setActivePage(page);
  };

  const goBack = () => setActivePage(prevPage);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigate('product-detail');
  };

  const handleSellerClick = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    navigate('seller-profile');
  };

  const handleNavigate = (page: string) => {
    setSelectedProduct(null);
    setSelectedSellerId(null);
    navigate(page as Page);
  };

  return (
    <div className="min-h-screen bg-white">
      {activePage === 'home' && (
        <HomePage
          onProductClick={handleProductClick}
          onProfileClick={() => navigate('profile')}
        />
      )}

      {activePage === 'product-detail' && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => navigate('home')}
          onSellerClick={handleSellerClick}
        />
      )}

      {activePage === 'seller-profile' && selectedSellerId && (
        <SellerProfilePage
          sellerId={selectedSellerId}
          onBack={() => navigate('product-detail')}
          onProductClick={handleProductClick}
        />
      )}

      {activePage === 'profile' && (
        <ProfilePage
          onProductClick={handleProductClick}
          onNavigate={(page) => navigate(page as Page)}
        />
      )}

      {activePage === 'edit-profile' && (
        <EditProfilePage
          onBack={goBack}
          onSaved={() => navigate('profile')}
        />
      )}

      {activePage === 'settings' && (
        <SettingsPage
          onBack={goBack}
          onNavigate={(page) => navigate(page as Page)}
        />
      )}

      {activePage === 'verification' && (
        <VerificationPage onBack={goBack} />
      )}

      {activePage === 'support' && (
        <SupportPage onBack={goBack} />
      )}

      {activePage === 'privacy' && (
        <PrivacyPage onBack={goBack} />
      )}

      {activePage === 'terms' && (
        <PrivacyPage onBack={goBack} isTerms />
      )}

      {activePage === 'about' && (
        <PrivacyPage onBack={goBack} isAbout />
      )}

      {/* Sell overlay */}
      {activePage === 'sell' && (
        <SellPage
          onClose={() => navigate('home')}
          onSuccess={() => navigate('home')}
        />
      )}

      {/* Bottom nav - only on main pages */}
      {MAIN_PAGES.includes(activePage) && (
        <BottomNav activePage={activePage} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
