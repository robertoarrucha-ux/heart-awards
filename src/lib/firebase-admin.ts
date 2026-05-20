// src/lib/firebase-admin.ts
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

let app;

if (!getApps().length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (serviceAccountJson) {
    // Producción: usa la service account completa desde variable de entorno
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (e) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT contiene JSON inválido. Verifica el formato en tus variables de entorno.');
    }
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  } else {
    // Local: intenta con credenciales por defecto (GOOGLE_APPLICATION_CREDENTIALS)
    app = initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
} else {
  app = getApp();
}

export const adminDb =
  (firebaseConfig as any).firestoreDatabaseId &&
  (firebaseConfig as any).firestoreDatabaseId !== '(default)'
    ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
    : getFirestore(app);

export const adminAuth = getAuth(app);
