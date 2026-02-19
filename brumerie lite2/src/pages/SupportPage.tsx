// src/pages/SupportPage.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sendFeedbackViaEmail } from '@/services/productService';
import { SUPPORT_EMAIL, SUPPORT_WHATSAPP } from '@/types';

interface SupportPageProps {
  onBack: () => void;
}

const FEEDBACK_TYPES = [
  { id: 'question', label: '❓ Question', desc: 'Tu as une question sur le service' },
  { id: 'bug', label: '🐛 Signaler un bug', desc: 'Quelque chose ne fonctionne pas' },
  { id: 'suggestion', label: '💡 Suggestion', desc: 'Une idée pour améliorer Brumerie' },
  { id: 'complaint', label: '⚠️ Réclamation', desc: 'Un problème avec un vendeur ou acheteur' },
];

export function SupportPage({ onBack }: SupportPageProps) {
  const { userProfile } = useAuth();
  const [type, setType] = useState<string>('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendEmail = () => {
    if (!type || !message.trim()) return;
    const link = sendFeedbackViaEmail({
      type,
      message: message.trim(),
      name: userProfile?.name || 'Utilisateur',
      email: userProfile?.email || '',
    });
    window.open(link, '_blank');
    setSent(true);
  };

  const handleWhatsApp = () => {
    const msg = `Bonjour Brumerie Support 👋\n\nJe suis ${userProfile?.name || 'un utilisateur'} et j'ai besoin d'aide :\n\n${message || '...'}`;
    window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="font-bold text-base">Aide & Support</h1>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Contact cards */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleWhatsApp}
            className="bg-white rounded-2xl p-4 text-center border border-gray-100 hover:border-green-300 transition-all"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
          >
            <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
              <span className="text-white text-lg">💬</span>
            </div>
            <p className="text-sm font-semibold text-gray-800">WhatsApp</p>
            <p className="text-xs text-gray-400 mt-0.5">Réponse rapide</p>
          </button>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="bg-white rounded-2xl p-4 text-center border border-gray-100 hover:border-green-300 transition-all block"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
          >
            <div className="w-10 h-10 mx-auto bg-green-50 rounded-xl flex items-center justify-center mb-2">
              <span className="text-green-600 text-lg">📧</span>
            </div>
            <p className="text-sm font-semibold text-gray-800">Email</p>
            <p className="text-xs text-gray-400 mt-0.5">Sous 24h</p>
          </a>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <h3 className="font-bold text-gray-900 mb-3 text-sm">📋 Questions fréquentes</h3>
          {[
            { q: 'Comment contacter un vendeur ?', a: "Clique sur l'article puis sur « Contacter sur WhatsApp ». Le vendeur te répond directement." },
            { q: 'Comment publier un article ?', a: "Appuie sur le bouton + en bas. Ajoute des photos, un titre, un prix et ton quartier." },
            { q: 'Comment obtenir le badge vérifié ?', a: "Va dans Paramètres → Badge Vérifié. Paiement de 2 000 FCFA par Mobile Money, activation sous 24h." },
            { q: 'Puis-je supprimer mon annonce ?', a: "Oui, depuis ton profil, appuie sur les ··· en haut de l'annonce pour la supprimer ou la marquer comme vendue." },
          ].map((faq, i) => (
            <details key={i} className="border-b border-gray-100 last:border-0 py-2 group">
              <summary className="text-sm font-medium text-gray-800 cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-xs ml-2">▾</span>
              </summary>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>

        {/* Feedback form */}
        {!sent ? (
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <h3 className="font-bold text-gray-900 mb-3 text-sm">✉️ Envoyer un message</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {FEEDBACK_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    type === t.id
                      ? 'bg-green-50 border-green-500 text-green-800'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <p className="text-xs font-semibold">{t.label}</p>
                </button>
              ))}
            </div>

            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Décris ta question ou ton problème..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none mb-3"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSendEmail}
                disabled={!type || !message.trim()}
                className="flex-1 py-3 rounded-xl font-semibold text-sm btn-primary disabled:opacity-50"
              >
                📧 Envoyer par email
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
              >
                💬 Via WhatsApp
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center fade-in">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-green-800 font-semibold">Message envoyé !</p>
            <p className="text-green-600 text-xs mt-1">Notre équipe te répondra sous 24h à {userProfile?.email}</p>
            <button onClick={() => setSent(false)} className="text-green-600 text-xs underline mt-3">
              Envoyer un autre message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
