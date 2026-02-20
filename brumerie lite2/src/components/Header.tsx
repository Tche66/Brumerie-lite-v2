// src/components/Header.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onProfileClick?: () => void;
  onSearchChange?: (term: string) => void;
  searchTerm?: string;
}

export function Header({ onProfileClick, onSearchChange, searchTerm = '' }: HeaderProps) {
  const { userProfile } = useAuth();
  const [focused, setFocused] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="px-4 pt-4 pb-3">

        {/* Top row */}
        <div className="flex items-center justify-between mb-3">

          {/* Logo VERTICAL compact dans le header */}
          <div className="flex items-center">
            <img
              src="/assets/logos/logo-vertical.png"
              alt="Brumerie"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div style="display:flex;align-items:center;gap:8px">
                      <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#15803D,#22C55E);display:flex;align-items:center;justify-content:center">
                        <span style="color:white;font-weight:800;font-size:14px;font-family:Syne,sans-serif">B</span>
                      </div>
                      <span style="font-size:18px;font-weight:800;font-family:Syne,sans-serif;background:linear-gradient(135deg,#15803D,#16A34A);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Brumerie</span>
                    </div>
                  `;
                }
              }}
            />
          </div>

          {/* Avatar utilisateur */}
          <div className="flex items-center gap-2">
            {userProfile && (
              <button
                onClick={onProfileClick}
                className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-green-100 hover:border-green-500 transition-all duration-200"
              >
                {userProfile.photoURL ? (
                  <img src={userProfile.photoURL} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-green-50 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">
                      {userProfile.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                {userProfile.isVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Barre de recherche */}
        <div className={`relative transition-all duration-200 ${focused ? 'scale-[1.01]' : ''}`}>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
          <input
            type="text"
            placeholder="Chercher un article, une marque..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange?.('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

      </div>
    </header>
  );
}