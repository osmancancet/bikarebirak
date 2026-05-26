import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import type { Bucket } from "@google-cloud/storage";

/**
 * Firebase Admin SDK — yalnızca sunucuda kullanılır.
 * Güvenlik kurallarını bypass eder; yönetici işlemleri ve sunucu okumaları için.
 */
function getAdminApp(): App {
  const existing = getApps();
  if (existing.length) return existing[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // .env içinde \n kaçışlı saklanan özel anahtarı gerçek satır sonlarına çevir.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase admin ortam değişkenleri eksik (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}

/** Fotoğraf dosyalarını silmek için kullanılan Storage bucket'ı (sunucu). */
export function getAdminBucket(): Bucket {
  return getStorage(getAdminApp()).bucket();
}
