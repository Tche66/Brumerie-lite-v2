// src/pages/SettingsPage.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SettingsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

function SettingItem({ icon, label, sublabel, onClick, danger, badge }: {
  icon: string; label: string; sublabel?: string;
  onClick: () => void; danger?: boolean; badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
    >
      <span className="text-xl w-8 text-center">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-gray-800'}`}>{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
      {badge && (
        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 mr-1">
          {badge}
        </span>
      )}
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className={danger ? 'text-red-400' : 'text-gray-400'}>
        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden mb-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
      <p className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  );
}

export function SettingsPage({ onBack, onNavigate }: SettingsPageProps) {
  const { userProfile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="font-bold text-base">Paramètres</h1>
      </div>

      {/* User summary */}
      <div className="bg-white mx-0 px-4 py-4 mb-3 flex items-center gap-3 border-b border-gray-50">
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-green-100">
          {userProfile?.photoURL ? (
            <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">{userProfile?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{userProfile?.name}</p>
          <p className="text-xs text-gray-400">{userProfile?.email}</p>
        </div>
        {userProfile?.isVerified && (
          <span className="ml-auto text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">
            ✓ VÉRIFIÉ
          </span>
        )}
      </div>

      <div className="px-3">
        <SettingSection title="Mon compte">
          <SettingItem
            icon="✏️" label="Modifier mon profil"
            sublabel="Nom, photo, téléphone, quartier"
            onClick={() => onNavigate('edit-profile')}
          />
          <SettingItem
            icon="🏅" label="Badge Vendeur Vérifié"
            sublabel={userProfile?.isVerified ? 'Badge actif sur ton profil' : '2 000 FCFA · activation sous 24h'}
            onClick={() => onNavigate('verification')}
            badge={userProfile?.isVerified ? '✓ ACTIF' : undefined}
          />
        </SettingSection>

        <SettingSection title="Informations">
          <SettingItem
            icon="🔒" label="Politique de confidentialité"
            sublabel="Comment nous protégeons tes données"
            onClick={() => onNavigate('privacy')}
          />
          <SettingItem
            icon="📜" label="Conditions d'utilisation"
            sublabel="Règles de la plateforme"
            onClick={() => onNavigate('terms')}
          />
          <SettingItem
            icon="ℹ️" label="À propos de Brumerie"
            sublabel="Version MVP 1.0 · Abidjan, Côte d'Ivoire"
            onClick={() => onNavigate('about')}
          />
        </SettingSection>

        <SettingSection title="Aide">
          <SettingItem
            icon="💬" label="Support & Aide"
            sublabel="FAQ, signaler un problème, suggestions"
            onClick={() => onNavigate('support')}
          />
        </SettingSection>

        <SettingSection title="Compte">
          <SettingItem
            icon="🚪" label="Se déconnecter"
            onClick={signOut}
            danger
          />
        </SettingSection>

        <p className="text-center text-xs text-gray-300 mt-4">
          Brumerie MVP v1.0 · Made with ❤️ in Abidjan
        </p>
      </div>
    </div>
  );
}
