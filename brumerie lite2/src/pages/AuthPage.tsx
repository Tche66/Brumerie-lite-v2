// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NEIGHBORHOODS } from '@/types';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name || !phone || !neighborhood) {
          setError('Veuillez remplir tous les champs');
          setLoading(false);
          return;
        }
        await signUp(email, password, { name, phone, neighborhood, role: 'buyer' });
      }
    } catch (err: any) {
      const msg = err?.code === 'auth/invalid-credential'
        ? 'Email ou mot de passe incorrect'
        : err?.code === 'auth/email-already-in-use'
        ? 'Cet email est déjà utilisé'
        : 'Erreur. Réessaie.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero top */}
      <div
        className="relative overflow-hidden flex flex-col items-center justify-center pt-14 pb-10 px-6 text-center"
        style={{ background: 'linear-gradient(160deg, #16A34A 0%, #16A34A 60%, #15803D 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative z-10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-black gradient-text" style={{ fontFamily: 'Syne, sans-serif' }}>B</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Brumerie
          </h1>
          <p className="text-white/80 text-sm max-w-xs">
            Le marché de ton quartier, en ligne. Achète, vends, échange à Abidjan.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-5 pt-6 pb-8">
        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${!isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ton prénom et nom</label>
                <input
                  type="text"
                  placeholder="Aminata Diallo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Numéro WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🇨🇮 +225</span>
                  <input
                    type="tel"
                    placeholder="07 XX XX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-20 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ton quartier à Abidjan</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {NEIGHBORHOODS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNeighborhood(n)}
                      className={`py-2 px-3 rounded-xl border text-xs text-left transition-all ${
                        neighborhood === n
                          ? 'bg-green-50 border-green-500 text-green-800 font-medium'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      📍 {n}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mot de passe</label>
            <input
              type="password"
              placeholder={isLogin ? '••••••••' : 'Min. 6 caractères'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white text-base transition-all mt-2"
            style={{
              background: loading ? '#f0f0f0' : 'linear-gradient(135deg, #16A34A, #15803D)',
              color: loading ? '#999' : 'white',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(22, 163, 74, 0.35)',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                {isLogin ? 'Connexion...' : 'Création...'}
              </span>
            ) : isLogin ? '✨ Me connecter' : '🚀 Créer mon compte'}
          </button>
        </form>

        {/* Social proof */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            En continuant, tu acceptes nos <span className="underline">CGU</span>
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Syne, sans-serif' }}>Gratuit</p>
              <p className="text-xs text-gray-400">toujours</p>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Syne, sans-serif' }}>WhatsApp</p>
              <p className="text-xs text-gray-400">contact direct</p>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Syne, sans-serif' }}>Local</p>
              <p className="text-xs text-gray-400">par quartier</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
