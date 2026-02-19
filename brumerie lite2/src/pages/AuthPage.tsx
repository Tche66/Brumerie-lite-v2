// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NEIGHBORHOODS } from '@/types';

export function AuthPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
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
      const msg =
        err?.code === 'auth/invalid-credential'
          ? 'Email ou mot de passe incorrect'
          : err?.code === 'auth/email-already-in-use'
          ? 'Cet email est déjà utilisé'
          : err?.code === 'auth/weak-password'
          ? 'Mot de passe trop court (6 caractères minimum)'
          : 'Erreur. Réessaie.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccessMsg('');
    if (!email) {
      setError('Saisis d\'abord ton adresse email.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg('Lien de réinitialisation envoyé ! Vérifie ta boîte mail.');
    } catch (err: any) {
      setError('Aucun compte trouvé avec cet email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Hero top ── */}
      <div
        className="relative overflow-hidden flex flex-col items-center justify-center pt-14 pb-10 px-6 text-center"
        style={{ background: 'linear-gradient(160deg, #16A34A 0%, #16A34A 60%, #15803D 100%)' }}
      >
        {/* Cercles décoratifs */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Vrai logo vertical */}
          <div className="mb-4">
            <img
              src="/assets/logos/logo-vertical.png"
              alt="Brumerie"
              className="h-32 w-auto object-contain drop-shadow-lg"
              onError={(e) => {
                // Fallback texte si l'image est absente
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('h1');
                  fallback.style.cssText =
                    'font-size:2rem;font-weight:900;color:white;font-family:Syne,sans-serif;';
                  fallback.innerText = 'Brumerie';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>

          {/* Slogan officiel */}
          <p className="text-white/90 text-sm font-medium max-w-xs mt-2">
            Le commerce local, en toute confiance.
          </p>
        </div>
      </div>

      {/* ── Formulaire ── */}
      <div className="flex-1 px-5 pt-6 pb-8">

        {/* Toggle Connexion / Inscription */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
            }`}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Champs inscription uniquement */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Ton prénom et nom
                </label>
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
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Numéro WhatsApp
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    🇨🇮 +225
                  </span>
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
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Ton quartier à Abidjan
                </label>
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

          {/* Email */}
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

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Mot de passe
            </label>
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

          {/* Mot de passe oublié — visible uniquement en mode connexion */}
          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-green-600 font-semibold hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Message de succès (ex: email réinitialisation envoyé) */}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <p className="text-green-700 text-sm font-medium">✅ {successMsg}</p>
            </div>
          )}

          {/* Bouton principal */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-base transition-all mt-2"
            style={{
              background: loading
                ? '#e5e7eb'
                : 'linear-gradient(135deg, #15803D, #16A34A)',
              color: loading ? '#9ca3af' : 'white',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(22, 163, 74, 0.35)',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                {isLogin ? 'Connexion...' : 'Création du compte...'}
              </span>
            ) : isLogin ? '✨ Me connecter' : '🚀 Créer mon compte'}
          </button>
        </form>

        {/* Preuves sociales */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            En continuant, tu acceptes nos{' '}
            <span className="underline cursor-pointer">CGU</span>
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-sm font-bold text-gray-700">Gratuit</p>
              <p className="text-xs text-gray-400">toujours</p>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-sm font-bold text-gray-700">WhatsApp</p>
              <p className="text-xs text-gray-400">contact direct</p>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-sm font-bold text-gray-700">Local</p>
              <p className="text-xs text-gray-400">par quartier</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
