
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { Query } from 'firebase-admin/firestore';
import type { Nominee } from '@/lib/data';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

const NOMINEES_COLLECTION = 'nominees';

export async function addNominee(nomineeData: Omit<Nominee, 'id' | 'votes' | 'edition'>, edition: string = '2026'): Promise<string> {
    try {
        if (nomineeData.email) {
            const qSnapshot = await adminDb.collection(NOMINEES_COLLECTION)
                .where("email", "==", nomineeData.email)
                .where("edition", "==", edition)
                .limit(1)
                .get();
            
            if (!qSnapshot.empty) {
                const existingId = qSnapshot.docs[0].id;
                await updateNominee(existingId, { ...nomineeData, edition });
                return existingId;
            }
        }

        const docRef = await adminDb.collection(NOMINEES_COLLECTION).add({
            ...nomineeData,
            votes: 0,
            edition: edition,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, NOMINEES_COLLECTION);
        throw error;
    }
}

export async function getNomineeRank(votes: number): Promise<number> {
    try {
        const snapshot = await adminDb.collection(NOMINEES_COLLECTION)
            .where("votes", ">", votes)
            .count()
            .get();
        return snapshot.data().count + 1;
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${NOMINEES_COLLECTION}/rank`);
        return 1;
    }
}

export async function getHighestVoteCount(): Promise<number> {
    try {
        const querySnapshot = await adminDb.collection(NOMINEES_COLLECTION)
            .orderBy("votes", "desc")
            .limit(1)
            .get();
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data().votes || 0;
        }
        return 0;
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${NOMINEES_COLLECTION}/highest-votes`);
        return 0;
    }
}

export async function getNominees(options: { 
  limit?: number; 
  startAfter?: string; 
  categories?: string[];
  edition?: string;
}): Promise<{ nominees: Nominee[]; hasMore: boolean }> {
  try {
    let query: Query = adminDb.collection(NOMINEES_COLLECTION);
    
    if (options.edition) {
        const editionValue = options.edition;
        const editionNumber = parseInt(editionValue);
        const editionFilters = [editionValue];
        if (!isNaN(editionNumber)) {
            editionFilters.push(editionNumber as any);
        }
        query = query.where("edition", "in", editionFilters);
    }

    if (options.categories && options.categories.length > 0) {
        query = query.where("category", "in", options.categories);
        // Manual sort in memory if categories are filtered, consistent with previous behavior 
        // to avoid requiring multi-field client indexes for every combination
    } else {
        query = query.orderBy("votes", "desc");
    }
    
    if (options.limit) {
        query = query.limit(options.limit + 1);
    }

    if (options.startAfter) {
      const startAfterDoc = await adminDb.collection(NOMINEES_COLLECTION).doc(options.startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }

    const querySnapshot = await query.get();
    let nominees: Nominee[] = [];
    querySnapshot.forEach((doc) => {
        nominees.push({ id: doc.id, ...doc.data() } as Nominee);
    });

    if (options.categories && options.categories.length > 0) {
      nominees.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    }

    let hasMore = false;
    if (options.limit && nominees.length > options.limit) {
        hasMore = true;
        nominees.pop();
    }
    
    return { nominees, hasMore };
  } catch (error: any) {
    handleFirestoreError(error, OperationType.LIST, NOMINEES_COLLECTION);
    throw error;
  }
}

export async function getNomineeById(id: string): Promise<Nominee | null> {
    try {
        const docSnap = await adminDb.collection(NOMINEES_COLLECTION).doc(id).get();
        if (docSnap.exists) {
            return { id: docSnap.id, ...docSnap.data() } as Nominee;
        }
        return null;
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${NOMINEES_COLLECTION}/${id}`);
        throw error;
    }
}

export async function getNomineeByName(name: string): Promise<Nominee | null> {
    try {
        const querySnapshot = await adminDb.collection(NOMINEES_COLLECTION)
            .where("name", "==", name)
            .limit(1)
            .get();
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Nominee;
        }
        return null;
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${NOMINEES_COLLECTION}/name/${name}`);
        throw error;
    }
}

export async function updateVoteCountForNominee(nomineeId: string, votesToSubtract: number): Promise<{success: boolean, message: string, newVoteCount?: number}> {
    try {
        const nomineeDocRef = adminDb.collection(NOMINEES_COLLECTION).doc(nomineeId);
        let finalVoteCount: number | undefined;

        await adminDb.runTransaction(async (transaction) => {
            const nomineeDoc = await transaction.get(nomineeDocRef);
            if (!nomineeDoc.exists) {
                throw new Error("Document does not exist!");
            }
            
            const currentVotes = nomineeDoc.data()?.votes || 0;
            const newVoteCount = Math.max(0, currentVotes - votesToSubtract);
            
            transaction.update(nomineeDocRef, { votes: newVoteCount });
            finalVoteCount = newVoteCount;
        });

        return { success: true, message: `Votos ajustados.`, newVoteCount: finalVoteCount };
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `${NOMINEES_COLLECTION}/${nomineeId}`);
        throw error;
    }
}

export async function updateNominee(id: string, nomineeData: Partial<Nominee>): Promise<void> {
    try {
        await adminDb.collection(NOMINEES_COLLECTION).doc(id).update(nomineeData);
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `${NOMINEES_COLLECTION}/${id}`);
        throw error;
    }
}

export async function deleteNominee(id: string): Promise<void> {
    try {
        await adminDb.collection(NOMINEES_COLLECTION).doc(id).delete();
    } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `${NOMINEES_COLLECTION}/${id}`);
        throw error;
    }
}
