// src/pages/VerificationPage.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { requestVerificationViaWhatsApp } from '@/services/productService';
import { VERIFICATION_PRICE } from '@/types';

interface VerificationPageProps {
  onBack: () => void;
}

const STEPS_INFO = [
  { icon: '💳', title: 'Paiement Mobile Money', desc: `Envoie ${VERIFICATION_PRICE.toLocaleString('fr-FR')} FCFA via Wave ou Orange Money au +225 08 68 67 693` },
  { icon: '📲', title: 'Contact WhatsApp', desc: "Appuie sur le bouton ci-dessous pour envoyer ta demande avec ton reçu de paiement en photo" },
  { icon: '✅', title: 'Activation sous 24h', desc: "Notre équipe vérifie et active ton badge. Tu recevras une confirmation par WhatsApp" },
];

export function VerificationPage({ onBack }: VerificationPageProps) {
  const { userProfile } = useAuth();
  const [sent, setSent] = useState(false);

  const handleRequest = () => {
    if (!userProfile) return;
    const link = requestVerificationViaWhatsApp({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
    });
    window.open(link, '_blank');
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="font-bold text-base">Badge Vendeur Vérifié</h1>
      </div>

      <div className="px-4 py-6">
        {/* Hero card */}
        <div
          className="rounded-2xl p-5 mb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(155deg, #15803D 0%, #16A34A 55%, #22C55E 100%)' }}
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10"/>
          <div className="absolute -left-4 -bottom-8 w-24 h-24 rounded-full bg-white/8"/>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-2xl">🏅</span>
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">Vendeur Vérifié</h2>
                <p className="text-white/80 text-sm">Badge de confiance Brumerie</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <p className="text-white font-bold text-xl">{VERIFICATION_PRICE.toLocaleString('fr-FR')} FCFA</p>
              <p className="text-white/80 text-xs">Paiement unique · Badge permanent</p>
            </div>
          </div>
        </div>

        {/* Already verified */}
        {userProfile?.isVerified ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-bold text-green-800 text-lg">Tu es déjà vérifié !</h3>
            <p className="text-green-600 text-sm mt-1">Ton badge de confiance est actif sur ton profil</p>
          </div>
        ) : (
          <>
            {/* Benefits */}
            <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h3 className="font-bold text-gray-900 mb-3 text-sm">✨ Les avantages du badge vérifié</h3>
              <div className="space-y-2">
                {[
                  'Badge ✓ Vérifié visible sur ton profil et tes annonces',
                  'Les acheteurs te font davantage confiance',
                  'Meilleure visibilité dans les résultats',
                  'Accès prioritaire aux futures fonctionnalités',
                  'Signe de sérieux et de légitimité',
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-green-500 text-sm mt-0.5">✓</span>
                    <p className="text-gray-700 text-sm">{b}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-2xl p-4 mb-5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">📋 Comment ça marche ?</h3>
              <div className="space-y-4">
                {STEPS_INFO.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                      {step.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        <span className="text-green-600 mr-1">{i + 1}.</span>
                        {step.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              <p className="text-amber-800 text-sm font-medium mb-2">💰 Paiement Mobile Money</p>
              <div className="space-y-1">
                <p className="text-amber-700 text-sm">Wave CI · Orange Money</p>
                <p className="text-amber-900 font-bold">📱 +225 08 68 67 693</p>
                <p className="text-amber-600 text-xs">Nom : Brumerie · Motif : Badge Vérification</p>
              </div>
            </div>

            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center fade-in">
                <div className="text-3xl mb-2">📲</div>
                <p className="text-green-800 font-semibold text-sm">Demande envoyée sur WhatsApp !</p>
                <p className="text-green-600 text-xs mt-1">Notre équipe activera ton badge sous 24h après confirmation du paiement</p>
              </div>
            ) : (
              <button
                onClick={handleRequest}
                className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 4px 20px rgba(37,211,102,0.3)' }}
              >
                <svg width="20" height="20" viewBox="0 0 32 32" fill="white">
                  <path d="M16 0C7.163 0 0 7.163 0 16c0 2.82.736 5.469 2.027 7.766L0 32l8.437-2.016A15.942 15.942 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.091c-2.65 0-5.116-.71-7.228-1.943l-.518-.307-5.01 1.197 1.239-4.859-.338-.527A12.987 12.987 0 013.014 16C3.014 8.902 8.902 3.014 16 3.014S28.986 8.902 28.986 16 23.098 29.086 16 29.086v.005z"/>
                </svg>
                Envoyer ma demande sur WhatsApp
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
