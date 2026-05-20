
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { Vote } from '@/lib/data';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { sanitizeId } from '@/lib/utils';

const VOTES_COLLECTION = 'votes';
const NOMINEES_COLLECTION = 'nominees';
const IP_TRACKING_COLLECTION = 'voted_ips';

// In-memory store for voted IP addresses.
const votedIPs = new Set<string>();

export async function hasVoted(ip: string): Promise<boolean> {
  const safeIp = sanitizeId(ip);
  // Check in-memory first for performance
  if (votedIPs.has(safeIp)) {
    return true;
  }

  // Then check Firestore for persistence
  try {
    const docRef = adminDb.collection(IP_TRACKING_COLLECTION).doc(safeIp);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      votedIPs.add(safeIp); // Add to in-memory cache for subsequent checks
      return true;
    }
    return false;
  } catch (error) {
    // Si Firestore falla, lanzamos el error para no dejar pasar votos sin verificar
    console.error(`Error checking vote status for IP ${safeIp}:`, error);
    throw error;
  }
}

export async function recordVote(ip: string, nomineeId: string): Promise<void> {
    const safeIp = sanitizeId(ip);
    try {
        await adminDb.runTransaction(async (transaction) => {
            // 1. Check if IP already voted using doc ID
            const ipRef = adminDb.collection(IP_TRACKING_COLLECTION).doc(safeIp);
            const ipDoc = await transaction.get(ipRef);
            
            if (ipDoc.exists) {
                const data = ipDoc.data();
                throw new Error(`Esta dirección IP ya emitió un voto el ${data?.votedAt?.toDate().toLocaleDateString() || 'recientemente'}.`);
            }

            // 2. Mark IP as voted
            transaction.set(ipRef, {
                votedAt: FieldValue.serverTimestamp(),
                nomineeId: nomineeId,
                rawIp: ip // Keep the original for audit
            });

            // 3. Add vote document for historical record
            const voteRef = adminDb.collection(VOTES_COLLECTION).doc();
            transaction.set(voteRef, {
                ip: ip,
                nomineeId: nomineeId,
                createdAt: FieldValue.serverTimestamp(),
            });

            // 4. Increment nominee vote count
            const nomineeRef = adminDb.collection(NOMINEES_COLLECTION).doc(nomineeId);
            transaction.update(nomineeRef, {
                votes: FieldValue.increment(1)
            });
        });
        
        votedIPs.add(safeIp); // Update cache after successful transaction
    } catch (error: any) {
        if (error.message && error.message.includes('ya emitió un voto')) {
            votedIPs.add(safeIp);
            throw error;
        }
        handleFirestoreError(error, OperationType.WRITE, VOTES_COLLECTION);
        throw error;
    }
}

export async function getVotes(): Promise<Vote[]> {
  try {
    const querySnapshot = await adminDb.collection(VOTES_COLLECTION).get();
    const votes: Vote[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      votes.push({
        id: doc.id,
        ip: data.ip,
        nomineeId: data.nomineeId,
        createdAt: data.createdAt,
      });
    });
    return votes;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, VOTES_COLLECTION);
    throw error;
  }
}

export async function deleteVotes(voteIds: string[]): Promise<void> {
  if (voteIds.length === 0) {
    return;
  }

  try {
    const batch = adminDb.batch();
    voteIds.forEach(id => {
      const docRef = adminDb.collection(VOTES_COLLECTION).doc(id);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, VOTES_COLLECTION);
    throw error;
  }
}
