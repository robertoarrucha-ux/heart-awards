
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, query, where, getDoc } from 'firebase/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { NominationRequest } from '@/lib/data';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

const REQUESTS_COLLECTION = 'nominationRequests';

export async function addNominationRequest(requestData: Omit<NominationRequest, 'id' | 'status' | 'createdAt'>): Promise<string> {
    try {
        // Check for existing request with the same nominee email
        const qSnapshot = await adminDb.collection(REQUESTS_COLLECTION)
            .where("nomineeEmail", "==", requestData.nomineeEmail)
            .get();

        if (!qSnapshot.empty) {
            // Update existing request
            const existingId = qSnapshot.docs[0].id;
            await adminDb.collection(REQUESTS_COLLECTION).doc(existingId).update({
                ...requestData,
                status: 'pending', // Reset to pending for re-review
                updatedAt: Timestamp.now(),
                edition: requestData.edition || '2026',
            });
            
            return existingId;
        }

        // Create new request if no duplicate found
        const docRef = await adminDb.collection(REQUESTS_COLLECTION).add({
            ...requestData,
            status: 'pending',
            createdAt: Timestamp.now(),
            edition: requestData.edition || '2026',
        });
        return docRef.id;
    } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, REQUESTS_COLLECTION);
        throw error;
    }
}

export async function getNominationRequestsByStatus(status: 'pending' | 'rejected' | 'approved' | 'archived', edition?: string): Promise<NominationRequest[]> {
    try {
        let q = query(
            collection(db, REQUESTS_COLLECTION), 
            where("status", "==", status)
        );
        
        if (edition) {
            q = query(q, where("edition", "==", edition));
        }

        const querySnapshot = await getDocs(q);
        const requests: NominationRequest[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            requests.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt,
            } as NominationRequest);
        });

        return requests;
    } catch (error) {
        handleFirestoreError(error, OperationType.LIST, REQUESTS_COLLECTION);
        throw error;
    }
}

export async function getNominationRequestById(requestId: string): Promise<NominationRequest | null> {
    try {
        const docRef = doc(db, REQUESTS_COLLECTION, requestId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt,
            } as NominationRequest;
        }
        return null;
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, `${REQUESTS_COLLECTION}/${requestId}`);
        throw error;
    }
}

export async function updateNominationRequestStatus(requestId: string, status: 'approved' | 'rejected' | 'pending' | 'archived', nomineeId?: string): Promise<void> {
    try {
        const updateData: any = { status };
        if (nomineeId !== undefined) {
            updateData.nomineeId = nomineeId;
        }
        await adminDb.collection(REQUESTS_COLLECTION).doc(requestId).update(updateData);
    } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `${REQUESTS_COLLECTION}/${requestId}`);
        throw error;
    }
}
