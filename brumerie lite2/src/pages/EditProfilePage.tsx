// src/pages/EditProfilePage.tsx
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { NEIGHBORHOODS } from '@/types';
import { compressImage } from '@/utils/helpers';

interface EditProfilePageProps {
  onBack: () => void;
  onSaved: () => void;
}

export function EditProfilePage({ onBack, onSaved }: EditProfilePageProps) {
  const { userProfile, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [neighborhood, setNeighborhood] = useState(userProfile?.neighborhood || '');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file, 400);
    setPhotoFile(compressed);
    setPhotoPreview(URL.createObjectURL(compressed));
  };

  const handleSave = async () => {
    if (!currentUser || !userProfile) return;
    if (!name.trim() || !phone.trim() || !neighborhood) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let photoURL = userProfile.photoURL;
      if (photoFile) {
        const storageRef = ref(storage, `avatars/${currentUser.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: name.trim(),
        phone: phone.trim(),
        neighborhood,
        ...(photoURL ? { photoURL } : {}),
      });
      setSuccess(true);
      setTimeout(() => onSaved(), 1500);
    } catch (err) {
      setError('Erreur lors de la sauvegarde. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const currentAvatar = photoPreview || userProfile?.photoURL;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="font-bold text-base">Modifier mon profil</h1>
        <div className="w-9"/>
      </div>

      {success && (
        <div className="mx-4 mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-center fade-in">
          <p className="text-green-700 font-medium text-sm">✅ Profil mis à jour !</p>
        </div>
      )}

      <div className="px-4 py-6 space-y-5">
        {/* Photo */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-green-100">
              {currentAvatar ? (
                <img src={currentAvatar} alt="Photo profil" className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-green-600 text-3xl font-bold">{name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white shadow-md"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400">Appuie sur + pour changer ta photo</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden"/>
        </div>

        {/* Fields */}
        <div className="bg-white rounded-2xl p-4 space-y-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prénom et nom</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ton nom complet"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Numéro WhatsApp</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🇨🇮 +225</span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="07 XX XX XX XX"
                className="w-full pl-20 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Quartier</label>
            <div className="grid grid-cols-2 gap-1.5">
              {NEIGHBORHOODS.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNeighborhood(n)}
                  className={`py-2 px-3 rounded-xl border text-xs text-left transition-all ${
                    neighborhood === n
                      ? 'bg-green-50 border-green-500 text-green-800 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-green-300'
                  }`}
                >
                  📍 {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Email read-only */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Email (non modifiable)</p>
          <p className="text-sm text-gray-600">{userProfile?.email}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-sm btn-primary"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
              Sauvegarde...
            </span>
          ) : '✅ Sauvegarder les modifications'}
        </button>
      </div>
    </div>
  );
}
