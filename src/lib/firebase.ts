// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Aseguramos que la config básica existe
if (!firebaseConfig.apiKey) {
  console.warn(
    'Firebase config sin apiKey. Revisa firebase-applet-config.json o las credenciales de tu app web en Firebase.'
  );
}

const app = !getApps().length ? initializeApp(firebaseConfig as any) : getApp();

// Si usas múltiples databases, respeta firestoreDatabaseId; de lo contrario, usa la default
const db =
  (firebaseConfig as any).firestoreDatabaseId &&
  (firebaseConfig as any).firestoreDatabaseId !== '(default)'
    ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
    : getFirestore(app);

const auth = getAuth(app);

export { app, db, auth };
