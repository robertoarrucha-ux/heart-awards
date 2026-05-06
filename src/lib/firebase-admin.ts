// src/lib/firebase-admin.ts
import { initializeApp, getApps, getApp, AppOptions } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// IMPORTANTE:
// Este módulo está pensado para uso en scripts locales o entornos
// donde tengas credenciales de servicio configuradas (GOOGLE_APPLICATION_CREDENTIALS).
// En Vercel, si no configuras credenciales explícitas, las operaciones Admin fallarán.

let app;
if (!getApps().length) {
  const options: AppOptions = {
    projectId: firebaseConfig.projectId,
    // Si quieres usar Admin SDK en producción, añade aquí:
    // credential: cert({
    //   projectId: process.env.FIREBASE_PROJECT_ID,
    //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    //   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    // }),
  };

  app = initializeApp(options);
} else {
  app = getApp();
}

export const adminDb =
  (firebaseConfig as any).firestoreDatabaseId &&
  (firebaseConfig as any).firestoreDatabaseId !== '(default)'
    ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
    : getFirestore(app);

export const adminAuth = getAuth(app);
