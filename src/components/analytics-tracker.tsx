
'use client';

import { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';

export default function AnalyticsTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      // Simple session-based tracking to avoid over-counting refreshes
      const sessionKey = 'lala_session_tracked';
      const isTracked = sessionStorage.getItem(sessionKey);
      
      if (!isTracked) {
        const statsRef = doc(db, 'admin_stats', 'page_views');
        try {
          await updateDoc(statsRef, {
            total: increment(1)
          });
          sessionStorage.setItem(sessionKey, 'true');
        } catch (error: any) {
          // If document doesn't exist, create it
          if (error.code === 'not-found') {
            await setDoc(statsRef, { total: 1 });
            sessionStorage.setItem(sessionKey, 'true');
          }
        }
      }
    };

    trackVisit();
  }, []);

  return null;
}
