// src/services/productService.ts
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  serverTimestamp,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Product } from '@/types';

/**
 * Publier un produit (Version Ultra-Robuste)
 */
export async function createProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'whatsappClickCount' | 'status'>,
  imageFiles: File[]
): Promise<string> {
  try {
    const imageUrls: string[] = [];
    
    // 1. Upload vers Cloudinary
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('file', file);
      // On utilise la variable Netlify ou 'ml_default' par défaut
      const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
      formData.append('upload_preset', preset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dk8kfgmqx/image/upload`, // Cloud Name forcé ici
        { method: 'POST', body: formData }
      );

      if (!response.ok) {
        const errorDetail = await response.json();
        console.error('Erreur Cloudinary détaillée:', errorDetail);
        throw new Error('Échec de l\'envoi de l\'image');
      }

      const data = await response.json();
      imageUrls.push(data.secure_url);
    }

    // 2. Sauvegarde Firestore
    const product = {
      ...productData,
      images: imageUrls, // Ici, le tableau ne sera plus vide !
      whatsappClickCount: 0,
      status: 'active' as const,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'products'), product);

    // 3. Update Compteur
    await updateDoc(doc(db, 'users', productData.sellerId), {
      publicationCount: increment(1),
    });

    return docRef.id;
  } catch (error) {
    console.error('Erreur createProduct:', error);
    throw error;
  }
}

/**
 * Récupérer les produits (Accueil)
 */
export async function getProducts(filters?: {
  category?: string;
  neighborhood?: string;
  searchTerm?: string;
}): Promise<Product[]> {
  try {
    let q = query(collection(db, 'products'), where('status', '==', 'active'));

    if (filters?.category && filters.category !== 'all') {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.neighborhood && filters.neighborhood !== 'all') {
      q = query(q, where('neighborhood', '==', filters.neighborhood));
    }

    const snapshot = await getDocs(q);
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? (doc.data().createdAt as Timestamp).toDate() : new Date(),
    })) as Product[];

    // Tri manuel par date
    products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }
    return products;
  } catch (error) {
    console.error('Erreur getProducts:', error);
    return [];
  }
}

/**
 * Récupérer les produits d'un vendeur (Profil)
 */
export async function getSellerProducts(sellerId: string): Promise<Product[]> {
  try {
    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', sellerId),
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? (doc.data().createdAt as Timestamp).toDate() : new Date(),
    })) as Product[];
    
    return products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    return [];
  }
}

/**
 * Marquer comme vendu
 */
export async function markProductAsSold(productId: string): Promise<void> {
  await updateDoc(doc(db, 'products', productId), { status: 'sold' });
}

/**
 * Supprimer un produit
 */
export async function deleteProduct(productId: string, sellerId: string): Promise<void> {
  await updateDoc(doc(db, 'products', productId), { status: 'deleted' });
  await updateDoc(doc(db, 'users', sellerId), { publicationCount: increment(-1) });
}

/**
 * Compteur WhatsApp
 */
export async function incrementWhatsAppClick(productId: string): Promise<void> {
  await updateDoc(doc(db, 'products', productId), { whatsappClickCount: increment(1) });
}

/**
 * Limite de publication
 */
export async function canUserPublish(userId: string): Promise<{
  canPublish: boolean;
  reason?: string;
  count: number;
  limit: number;
}> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return { canPublish: false, reason: 'Utilisateur non trouvé', count: 0, limit: 0 };
    
    const userData = userDoc.data();
    const count = userData.publicationCount || 0;
    const limit = userData.publicationLimit || 50;
    
    if (count >= limit) return { canPublish: false, reason: `Limite mensuelle atteinte`, count, limit };
    return { canPublish: true, count, limit };
  } catch (error) {
    return { canPublish: false, reason: 'Erreur technique', count: 0, limit: 0 };
  }
}

export function requestVerificationViaWhatsApp(user: { name: string; phone: string }) {
  const msg = `🏅 Demande badge Vendeur Vérifié - ${user.name}`;
  return `https://wa.me/22586867693?text=${encodeURIComponent(msg)}`;
}

export function sendFeedbackViaEmail(feedback: { type: string; message: string; name: string; email: string }) {
  const subject = encodeURIComponent(`Feedback Brumerie - ${feedback.type}`);
  const body = encodeURIComponent(`De: ${feedback.name}\n\n${feedback.message}`);
  return `mailto:brumerieciv.email@gmail.com?subject=${subject}&body=${body}`;
}

