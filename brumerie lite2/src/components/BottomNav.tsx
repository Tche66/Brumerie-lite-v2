// src/components/BottomNav.tsx
import React from 'react';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
  notificationCount?: number;
}

const navItems = [
  {
    id: 'home',
    label: 'Accueil',
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
          stroke={active ? '#16A34A' : '#999'}
          strokeWidth="2"
          fill={active ? 'rgba(22,163,74,0.12)' : 'none'}
          strokeLinejoin="round"
        />
        <path d="M9 21V12h6v9" stroke={active ? '#16A34A' : '#999'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'sell',
    label: 'Vendre',
    icon: (_active: boolean) => (
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center shadow-green -mt-5 border-4 border-white">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    ),
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" stroke={active ? '#16A34A' : '#999'} strokeWidth="2" fill={active ? 'rgba(22,163,74,0.12)' : 'none'} />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={active ? '#16A34A' : '#999'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function BottomNav({ activePage, onNavigate, notificationCount }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bottom-nav z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const isSell = item.id === 'sell';

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 ${
                isSell ? 'relative' : isActive ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {item.icon(isActive)}
              {!isSell && (
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
