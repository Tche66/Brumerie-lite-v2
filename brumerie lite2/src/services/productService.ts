// src/services/productService.ts
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';
import { Product } from '@/types';

/**
 * Publier un nouveau produit
 */
export async function createProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'whatsappClickCount' | 'status'>,
  imageFiles: File[]
): Promise<string> {
  try {
    // 1. Upload images
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      const imageRef = ref(storage, `products/${productData.sellerId}/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }

    // 2. Créer le produit
    const product = {
      ...productData,
      images: imageUrls,
      whatsappClickCount: 0,
      status: 'active' as const,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'products'), product);

    // 3. Incrémenter le compteur de publications de l'utilisateur
    await updateDoc(doc(db, 'users', productData.sellerId), {
      publicationCount: increment(1),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

/**
 * Récupérer tous les produits (avec filtres optionnels)
 */
export async function getProducts(filters?: {
  category?: string;
  neighborhood?: string;
  searchTerm?: string;
}): Promise<Product[]> {
  try {
    let q = query(
      collection(db, 'products'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    // Appliquer filtres
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
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
    })) as Product[];

    // Filtre recherche (côté client pour simplicité V1)
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
}

/**
 * Récupérer un produit par ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const productDoc = await getDoc(doc(db, 'products', productId));
    if (!productDoc.exists()) return null;

    return {
      id: productDoc.id,
      ...productDoc.data(),
      createdAt: (productDoc.data().createdAt as Timestamp).toDate(),
    } as Product;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

/**
 * Récupérer les produits d'un vendeur
 */
export async function getSellerProducts(sellerId: string): Promise<Product[]> {
  try {
    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', sellerId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
    })) as Product[];
  } catch (error) {
    console.error('Error getting seller products:', error);
    return [];
  }
}

/**
 * Marquer un produit comme vendu
 */
export async function markProductAsSold(productId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'products', productId), {
      status: 'sold',
    });
  } catch (error) {
    console.error('Error marking product as sold:', error);
    throw error;
  }
}

/**
 * Supprimer un produit
 */
export async function deleteProduct(productId: string, sellerId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'products', productId), {
      status: 'deleted',
    });

    // Décrémenter compteur publications
    await updateDoc(doc(db, 'users', sellerId), {
      publicationCount: increment(-1),
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * Incrémenter le compteur de clics WhatsApp
 */
export async function incrementWhatsAppClick(productId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'products', productId), {
      whatsappClickCount: increment(1),
    });
  } catch (error) {
    console.error('Error incrementing WhatsApp click:', error);
  }
}

/**
 * Vérifier si l'utilisateur peut publier
 */
export async function canUserPublish(userId: string): Promise<{
  canPublish: boolean;
  reason?: string;
  count: number;
  limit: number;
}> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return { canPublish: false, reason: 'Utilisateur non trouvé', count: 0, limit: 0 };
    }

    const userData = userDoc.data();
    const count = userData.publicationCount || 0;
    const limit = userData.publicationLimit || 50;
    const lastReset = userData.lastPublicationReset?.toDate() || new Date(0);
    const now = new Date();

    // Réinitialiser si nouveau mois
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      await updateDoc(doc(db, 'users', userId), {
        publicationCount: 0,
        lastPublicationReset: serverTimestamp(),
      });
      return { canPublish: true, count: 0, limit };
    }

    if (count >= limit) {
      return {
        canPublish: false,
        reason: `Limite atteinte (${limit} produits/mois)`,
        count,
        limit,
      };
    }

    return { canPublish: true, count, limit };
  } catch (error) {
    console.error('Error checking publication limit:', error);
    return { canPublish: false, reason: 'Erreur de vérification', count: 0, limit: 0 };
  }
}

// ============ VERIFICATION & FEEDBACK SERVICES ============

/**
 * Soumettre une demande de vérification → redirige vers WhatsApp
 */
export function requestVerificationViaWhatsApp(user: { name: string; email: string; phone: string }) {
  const msg = `🏅 *Demande de badge Vendeur Vérifié - Brumerie*\n\n👤 Nom : ${user.name}\n📧 Email : ${user.email}\n📱 Téléphone : ${user.phone}\n\nJ'ai effectué le paiement de 2 000 FCFA et je souhaite activer mon badge de confiance.`;
  const encoded = encodeURIComponent(msg);
  return `https://wa.me/22586867693?text=${encoded}`;
}

/**
 * Envoyer un feedback par email via mailto
 */
export function sendFeedbackViaEmail(feedback: { type: string; message: string; name: string; email: string }) {
  const subjects: Record<string, string> = {
    bug: 'Bug Report - Brumerie',
    suggestion: 'Suggestion - Brumerie',
    question: 'Question Support - Brumerie',
    complaint: 'Réclamation - Brumerie',
  };
  const subject = encodeURIComponent(subjects[feedback.type] || 'Message - Brumerie');
  const body = encodeURIComponent(`De: ${feedback.name} (${feedback.email})\n\n${feedback.message}`);
  return `mailto:brumerieciv.email@gmail.com?subject=${subject}&body=${body}`;
}
