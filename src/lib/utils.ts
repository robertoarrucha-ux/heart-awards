import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from "firebase/firestore"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTimestampMillis(ts: any): number {
    if (!ts) return 0;
    if (ts instanceof Timestamp) return ts.toMillis();
    if (ts.seconds && typeof ts.seconds === 'number') return ts.seconds * 1000;
    return 0;
}

/**
 * Sanitizes an IP address or any string to be used safely as a Firestore document ID.
 */
export function sanitizeId(id: string): string {
    return id.replace(/[/\s.]/g, '_').substring(0, 120);
}

/**
 * Attempts to parse a Firestore error JSON string back into a readable message.
 */
export function parseFirestoreError(error: any): string {
    if (typeof error === 'string' && error.startsWith('{')) {
        try {
            const parsed = JSON.parse(error);
            return parsed.error || "Error de base de datos.";
        } catch {
            return error;
        }
    }
    if (error instanceof Error) return error.message;
    return String(error);
}
