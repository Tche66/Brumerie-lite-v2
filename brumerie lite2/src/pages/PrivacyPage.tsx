// src/pages/PrivacyPage.tsx
import React from 'react';

interface PrivacyPageProps {
  onBack: () => void;
  isTerms?: boolean;
  isAbout?: boolean;
}

export function PrivacyPage({ onBack, isTerms, isAbout }: PrivacyPageProps) {
  const title = isAbout ? 'À propos de Brumerie' : isTerms ? "Conditions d'utilisation" : 'Politique de confidentialité';

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="font-bold text-sm">{title}</h1>
      </div>

      <div className="px-4 py-5 space-y-5 fade-in">
        {isAbout && <AboutContent />}
        {isTerms && <TermsContent />}
        {!isTerms && !isAbout && <PrivacyContent />}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
      <h2 className="font-bold text-green-700 mb-2 text-sm">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function AboutContent() {
  return (
    <>
      {/* Hero */}
      <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(155deg, #15803D 0%, #16A34A 55%, #22C55E 100%)' }}>
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-3xl font-black text-green-600" style={{ fontFamily: 'Syne, sans-serif' }}>B</span>
        </div>
        <h2 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Brumerie</h2>
        <p className="text-white/80 text-sm">Le marché de ton quartier, en ligne</p>
        <div className="bg-white/20 rounded-xl px-4 py-2 mt-3 inline-block">
          <p className="text-white text-xs font-medium">MVP v1.0 · Abidjan, Côte d'Ivoire · 2025</p>
        </div>
      </div>

      <Section title="🎯 Notre mission">
        <p>
          Brumerie est né d'un constat simple : le commerce local en Côte d'Ivoire regorge de potentiel,
          mais manque d'infrastructure fiable. Notre objectif est de créer des solutions fiables et
          sécurisées pour permettre à chacun de vendre et d'acheter sans risque.
        </p>
      </Section>

      <Section title="⚠️ Le problème que nous résolvons">
        <p>Le commerce social aujourd'hui est truffé d'obstacles :</p>
        <ul className="space-y-1.5 mt-2">
          {[
            "Acheter un produit qui n'arrive jamais, ou auprès de faux commerçants",
            "Produits authentiques mais prix ou frais de livraison exorbitants",
            "Décalage géographique : le vendeur est à 100 km mais apparaît sur ton fil",
            "Livraison non conforme, impossible de retourner, aucun moyen de contacter",
          ].map((p, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-red-400 text-xs mt-1">✗</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-gray-400 italic">
          Ces frustrations font perdre confiance aux utilisateurs et limitent le développement du commerce local.
        </p>
      </Section>

      <Section title="💡 Notre solution">
        <p>Brumerie résout tout cela via :</p>
        <ul className="space-y-1.5 mt-2">
          {[
            "Vérification des vendeurs avec badges de confiance",
            "Localisation intelligente : produits visibles dans ton quartier",
            "Contact direct WhatsApp entre acheteur et vendeur",
            "Transparence totale : prix, photos réelles, profils vérifiés",
            "Futur : paiement escrow sécurisé et logistique locale",
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-500 text-xs mt-1">✓</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="🚀 Notre traction">
        <p>
          Pour valider le modèle, nous avons lancé un mini-MVP via WhatsApp Business à Jacqueville :
          prise de photos des articles, catalogue en ligne, livraisons locales.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { val: '10+', label: 'Commandes' },
            { val: '100%', label: 'Satisfaction' },
            { val: '1 mois', label: 'Pour tester' },
          ].map((stat, i) => (
            <div key={i} className="bg-green-50 rounded-xl p-2 text-center">
              <p className="text-green-700 font-bold text-base">{stat.val}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="📬 Nous contacter">
        <p>Brumerie est une startup ivoirienne en phase MVP. Nous sommes ouverts aux partenariats, retours et suggestions.</p>
        <div className="mt-2 space-y-1">
          <p>📧 brumerieciv.email@gmail.com</p>
          <p>📱 +225 08 68 67 693</p>
          <p>📍 Abidjan, Côte d'Ivoire</p>
        </div>
      </Section>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
        <p><strong>Dernière mise à jour :</strong> Janvier 2025</p>
        <p className="mt-1">Brumerie s'engage à protéger ta vie privée et tes données personnelles.</p>
      </div>

      <Section title="1. Données collectées">
        <p>Lors de ton inscription et utilisation de Brumerie, nous collectons :</p>
        <ul className="space-y-1 mt-2">
          {[
            "Nom complet et adresse email",
            "Numéro de téléphone WhatsApp",
            "Quartier de résidence à Abidjan",
            "Photos de profil (optionnel)",
            "Photos et descriptions des articles publiés",
            "Données d'utilisation (clics, pages visitées)",
          ].map((d, i) => <li key={i} className="flex gap-2"><span className="text-green-500">·</span><span>{d}</span></li>)}
        </ul>
      </Section>

      <Section title="2. Utilisation des données">
        <p>Tes données sont utilisées exclusivement pour :</p>
        <ul className="space-y-1 mt-2">
          {[
            "Créer et gérer ton compte Brumerie",
            "Afficher tes annonces aux acheteurs de ton quartier",
            "Faciliter la mise en relation via WhatsApp",
            "Envoyer des notifications importantes",
            "Améliorer nos services",
          ].map((u, i) => <li key={i} className="flex gap-2"><span className="text-green-500">·</span><span>{u}</span></li>)}
        </ul>
        <p className="mt-2 font-medium text-green-700">Nous ne vendons jamais tes données à des tiers.</p>
      </Section>

      <Section title="3. Stockage et sécurité">
        <p>
          Tes données sont stockées de manière sécurisée sur Firebase (Google Cloud), avec chiffrement
          en transit (HTTPS) et au repos. L'accès est restreint aux seuls membres autorisés de l'équipe Brumerie.
        </p>
      </Section>

      <Section title="4. Partage des données">
        <p>
          Ton numéro WhatsApp est partagé avec les acheteurs uniquement lorsqu'ils cliquent sur
          « Contacter sur WhatsApp » sur ton annonce. Tu es informé du nombre de contacts via
          le compteur sur chaque annonce.
        </p>
        <p className="mt-2">Nous ne partageons aucune autre donnée sans ton consentement explicite.</p>
      </Section>

      <Section title="5. Tes droits">
        <ul className="space-y-1">
          {[
            "Accéder à tes données : via ton profil",
            "Modifier tes données : via Paramètres → Modifier mon profil",
            "Supprimer ton compte : contacte-nous sur WhatsApp",
            "Retirer ton consentement : à tout moment",
          ].map((r, i) => <li key={i} className="flex gap-2"><span className="text-green-500">·</span><span>{r}</span></li>)}
        </ul>
      </Section>

      <Section title="6. Contact">
        <p>Pour toute question relative à tes données :</p>
        <p className="mt-1 font-medium">📧 brumerieciv.email@gmail.com</p>
        <p>📱 +225 08 68 67 693 (WhatsApp)</p>
      </Section>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
        <p><strong>Dernière mise à jour :</strong> Janvier 2025</p>
        <p className="mt-1">En utilisant Brumerie, tu acceptes les présentes conditions.</p>
      </div>

      <Section title="1. Présentation du service">
        <p>
          Brumerie est une marketplace sociale permettant aux habitants d'Abidjan de vendre et acheter
          des articles de seconde main ou neufs entre particuliers et petits commerçants.
          Brumerie est actuellement en phase MVP (Minimum Viable Product).
        </p>
      </Section>

      <Section title="2. Inscription et compte">
        <p>Tu t'engages à :</p>
        <ul className="space-y-1 mt-2">
          {[
            "Fournir des informations exactes lors de l'inscription",
            "Ne créer qu'un seul compte par personne",
            "Garder tes identifiants confidentiels",
            "Être âgé d'au moins 18 ans",
          ].map((r, i) => <li key={i} className="flex gap-2"><span className="text-green-500">·</span><span>{r}</span></li>)}
        </ul>
      </Section>

      <Section title="3. Règles pour les vendeurs">
        <ul className="space-y-1">
          {[
            "Les photos doivent correspondre à l'article réel",
            "Les prix doivent être honnêtes et visibles",
            "Interdiction de vendre des produits illégaux, contrefaits ou dangereux",
            "Maximum 50 publications par mois en phase MVP",
            "Les transactions se font entre acheteur et vendeur via WhatsApp",
          ].map((r, i) => <li key={i} className="flex gap-2"><span className="text-green-500">·</span><span>{r}</span></li>)}
        </ul>
      </Section>

      <Section title="4. Responsabilité de Brumerie">
        <p>
          Brumerie est une plateforme de mise en relation. Nous ne sommes pas partie prenante des
          transactions entre acheteurs et vendeurs. Nous ne pouvons pas garantir la qualité des
          articles ni la fiabilité des transactions effectuées hors plateforme.
        </p>
        <p className="mt-2">
          Le badge "Vendeur Vérifié" atteste de l'identité du vendeur, mais ne constitue pas une
          garantie de la qualité des articles vendus.
        </p>
      </Section>

      <Section title="5. Suspension de compte">
        <p>
          Brumerie se réserve le droit de suspendre ou supprimer tout compte en cas de :
          fraude, fausses informations, comportement inapproprié envers d'autres utilisateurs,
          ou violation des présentes conditions.
        </p>
      </Section>

      <Section title="6. Modification des CGU">
        <p>
          Brumerie peut modifier ces conditions à tout moment. Les utilisateurs seront informés
          des changements importants via l'application.
        </p>
        <p className="mt-2">📧 brumerieciv.email@gmail.com · 📱 +225 08 68 67 693</p>
      </Section>
    </>
  );
}
