// src/pages/SellPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createProduct, canUserPublish } from '@/services/productService';
import { compressImage } from '@/utils/helpers';
import { CATEGORIES, NEIGHBORHOODS } from '@/types';

interface SellPageProps {
  onClose: () => void;
  onSuccess: () => void;
}

const STEPS = ['Photos', 'Infos', 'Détails'];

export function SellPage({ onClose, onSuccess }: SellPageProps) {
  const { userProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canPublish, setCanPublish] = useState(true);
  const [success, setSuccess] = useState(false);

  // Form state
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState(userProfile?.neighborhood || '');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      canUserPublish(userProfile.id).then((check) => {
        setCanPublish(check.canPublish);
        if (!check.canPublish) setError(check.reason || 'Limite atteinte');
      });
    }
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 3) {
      setError('Maximum 3 photos');
      return;
    }
    setError('');
    const newImages: File[] = [];
    const newPreviews: string[] = [];
    for (const file of files) {
      const compressed = await compressImage(file);
      newImages.push(compressed);
      newPreviews.push(URL.createObjectURL(compressed));
    }
    setImages([...images, ...newImages]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const canGoNext = () => {
    if (step === 0) return images.length > 0;
    if (step === 1) return title.trim().length > 2 && price && parseFloat(price) > 0;
    if (step === 2) return category && neighborhood;
    return false;
  };

  const handleSubmit = async () => {
    if (!userProfile || !canPublish) return;
    setLoading(true);
    setError('');
    try {
      await createProduct(
        {
          title: title.trim(),
          price: parseFloat(price),
          description: description.trim(),
          category,
          neighborhood,
          sellerId: userProfile.id,
          sellerName: userProfile.name,
          sellerPhone: userProfile.phone,
          sellerPhoto: userProfile.photoURL,
          sellerVerified: userProfile.isVerified,
          images: [],
        },
        images
      );
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la publication. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center px-8 text-center fade-in">
        <div className="text-7xl mb-5 animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          Article publié !
        </h2>
        <p className="text-gray-500 text-sm">Ton article est maintenant visible sur Brumerie</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 className="font-bold text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
          Publier un article
        </h2>
        <div className="w-9" />
      </div>

      {/* Steps progress */}
      <div className="px-4 py-3">
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-green-600' : 'bg-gray-100'}`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Étape {step + 1} sur {STEPS.length} · {STEPS[step]}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Step 0: Photos */}
        {step === 0 && (
          <div className="fade-up">
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
              Ajoute des photos
            </h3>
            <p className="text-sm text-gray-400 mb-5">1 à 3 photos. La première sera la photo principale.</p>

            <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" onChange={handleImageChange} className="hidden" />

            {/* Image grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {imagePreviews.map((preview, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      PRINCIPALE
                    </span>
                  )}
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-orange-400 transition-all"
                >
                  <span className="text-2xl">+</span>
                  <span className="text-xs mt-1">Photo</span>
                </button>
              )}
            </div>

            {/* Tips */}
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-green-800 font-medium mb-1">💡 Conseils pour vendre vite</p>
              <ul className="text-xs text-green-700 space-y-0.5">
                <li>· Bonne lumière naturelle</li>
                <li>· Montre tous les angles</li>
                <li>· Arrière-plan neutre</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 1: Title + Price */}
        {step === 1 && (
          <div className="fade-up space-y-5">
            <div>
              <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
                Décris ton article
              </h3>
              <p className="text-sm text-gray-400">Un bon titre et un bon prix attirent les acheteurs.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Titre de l'annonce *</label>
              <input
                type="text"
                placeholder="ex: iPhone 12 Pro 256Go bleu"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/80</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (FCFA) *</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-4 pr-16 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">FCFA</span>
              </div>
              {price && parseFloat(price) > 0 && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  ≈ {parseFloat(price).toLocaleString('fr-FR')} FCFA
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description (optionnel)</label>
              <textarea
                placeholder="État, marque, raison de la vente, défauts éventuels..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Category + Neighborhood */}
        {step === 2 && (
          <div className="fade-up space-y-5">
            <div>
              <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
                Derniers détails
              </h3>
              <p className="text-sm text-gray-400">Pour que les bons acheteurs te trouvent.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Catégorie *</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm text-left transition-all ${
                      category === cat.id
                        ? 'bg-green-50 border-green-500 text-green-800 font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-green-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quartier *</label>
              <div className="grid grid-cols-2 gap-2">
                {NEIGHBORHOODS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNeighborhood(n)}
                    className={`py-2.5 px-3 rounded-xl border text-sm text-left transition-all ${
                      neighborhood === n
                        ? 'bg-green-50 border-green-500 text-green-800 font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-green-200'
                    }`}
                  >
                    📍 {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-4 py-4 border-t border-gray-100 bg-white">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm"
            >
              ← Retour
            </button>
          )}
          {step < 2 ? (
            <button
              onClick={() => { if (canGoNext()) setStep(step + 1); }}
              disabled={!canGoNext()}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${
                canGoNext()
                  ? 'bg-green-600 text-white shadow-green'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continuer →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canGoNext() || loading || !canPublish}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${
                canGoNext() && !loading && canPublish
                  ? 'bg-green-600 text-white shadow-green'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Publication...
                </span>
              ) : '🚀 Publier l\'article'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
