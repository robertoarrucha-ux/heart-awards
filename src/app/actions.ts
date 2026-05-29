'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { hasVoted, recordVote } from '@/lib/vote-store';
import { addNominee, getNominees, getNomineeById, updateVoteCountForNominee, getNomineeByName, deleteNominee, getNomineeRank, getHighestVoteCount, updateNominee } from '@/lib/nominee-store';
import type { Nominee, NominationRequest, Vote } from '@/lib/data';
import { getTimestampMillis, parseFirestoreError } from '@/lib/utils';
import { addNominationRequest, getNominationRequestsByStatus, updateNominationRequestStatus, getNominationRequestById } from '@/lib/nomination-request-store';
import { sendRejectionEmail, sendApprovalEmail, sendTestEmail, sendConfirmationEmail, sendFreeRegistrationApprovalEmail, sendFreeRegistrationRejectionEmail } from '@/lib/email';
import { db } from '@/lib/firebase';
import { adminDb } from '@/lib/firebase-admin';
import { collection, query, where, getCountFromServer, getDocs, getDoc, orderBy, doc, deleteDoc, setDoc, updateDoc, writeBatch, addDoc } from 'firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { summarizeNominee } from '@/ai/flows/summarize-nominee';

const ADMIN_EMAIL = 'roberto@pro-latam.org';
const WHATSAPP_SUPPORT_URL = 'https://api.whatsapp.com/send/?phone=4367761735010&text&type=%20Quiero%20Nominarme%20a%20los%20LatamAwards';

function whatsappSuffix(): string {
  return `\n\nSi el problema persiste, contáctanos vía WhatsApp: ${WHATSAPP_SUPPORT_URL}`;
}

export async function castVoteAction(nomineeId: string): Promise<{ success: boolean, message: string }> {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
               headersList.get('x-real-ip') ||
               '127.0.0.1';
    console.log(`[ACTION] Tentativa de voto para ${nomineeId} desde IP: ${ip}`);
    const alreadyVoted = await hasVoted(ip);
    if (alreadyVoted) {
      return { success: false, message: 'Esta dirección IP ya ha emitido un voto anteriormente.' };
    }
    await recordVote(ip, nomineeId);
    revalidatePath('/vota');
    revalidatePath(`/nominados/${nomineeId}`);
    return { success: true, message: '¡Muchas gracias! Tu voto ha sido registrado correctamente.' };
  } catch (error: any) {
    const errorMessage = parseFirestoreError(error);
    console.error("Error casting vote:", error);
    return { success: false, message: errorMessage };
  }
}

export async function getNomineesAction(options: {
  limit?: number;
  startAfter?: string;
  categories?: string[];
  edition?: string;
}): Promise<{ nominees: Nominee[]; hasMore: boolean }> {
  const result = await getNominees(options);
  return result;
}

export async function addNominationRequestAction(
  requestData: Omit<NominationRequest, 'id' | 'status' | 'createdAt'>
): Promise<{ success: boolean; message: string; requestId?: string }> {
  try {
    const missingFields: string[] = [];
    if (!requestData.nomineeName || requestData.nomineeName.trim().length < 2)
      missingFields.push("Nombre del nominado (campo 2, mínimo 2 caracteres)");
    if (!requestData.nomineeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestData.nomineeEmail))
      missingFields.push("Correo electrónico válido del nominado (campo 4)");
    if (!requestData.category)
      missingFields.push("Categoría (campo 3)");
    if (!requestData.nomineeCountry)
      missingFields.push("País de residencia / operación (campo 5)");
    if (!requestData.positionAndProject || requestData.positionAndProject.trim().length < 2)
      missingFields.push("Cargo o área de impacto (campo 6, mínimo 2 caracteres)");
    if (!requestData.organizationName || requestData.organizationName.trim().length < 2)
      missingFields.push("Empresa u organización (campo 7, mínimo 2 caracteres)");
    if (!requestData.nomineeBio || requestData.nomineeBio.trim().length < 20)
      missingFields.push("Reseña del nominado (campo 8, mínimo 20 caracteres)");
    if (!requestData.leadershipLesson || requestData.leadershipLesson.trim().length < 20)
      missingFields.push("Lección de liderazgo (campo 9, mínimo 20 caracteres)");

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Por favor corrige los siguientes campos antes de enviar:\n• ${missingFields.join('\n• ')}` + whatsappSuffix(),
      };
    }

    const urlFields: { key: keyof typeof requestData; label: string }[] = [
      { key: 'websiteUrl', label: 'Sitio web (campo 11)' },
      { key: 'instagramUrl', label: 'Instagram (campo 12)' },
      { key: 'linkedinUrl', label: 'LinkedIn (campo 13)' },
      { key: 'facebookUrl', label: 'Facebook (campo 14)' },
      { key: 'youtubeVideoUrl', label: 'YouTube (campo 15)' },
    ];

    const invalidUrls: string[] = [];
    for (const { key, label } of urlFields) {
      const val = requestData[key] as string | undefined;
      if (val && val.trim() !== '') {
        try { new URL(val); } catch {
          invalidUrls.push(`${label}: "${val}" — debe empezar con https://`);
        }
      }
    }

    if (invalidUrls.length > 0) {
      return {
        success: false,
        message: `Hay URLs con formato incorrecto:\n• ${invalidUrls.join('\n• ')}` + whatsappSuffix(),
      };
    }

    const requestId = await addNominationRequest(requestData);
    try {
      await sendConfirmationEmail(requestData.nomineeEmail, requestData.nomineeName);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
    }
    return { success: true, message: "Solicitud de nominación enviada exitosamente.", requestId };

  } catch (error: any) {
    console.error("Error adding nomination request action:", error);
    const parsedMessage = parseFirestoreError(error);
    let friendlyMessage: string;
    if (parsedMessage.toLowerCase().includes('quota exceeded')) {
      friendlyMessage = "El servidor ha alcanzado su límite de capacidad diario. Inténtalo de nuevo mañana." + whatsappSuffix();
    } else if (parsedMessage.toLowerCase().includes('too large') || parsedMessage.toLowerCase().includes('limit')) {
      friendlyMessage = "La imagen es demasiado grande. Intenta con una foto más pequeña (máx 2MB) en formato .jpg, .png o .webp." + whatsappSuffix();
    } else if (parsedMessage.toLowerCase().includes('permission') || parsedMessage.toLowerCase().includes('credentials')) {
      friendlyMessage = "Error de permisos en el servidor. Inténtalo de nuevo en unos minutos." + whatsappSuffix();
    } else if (parsedMessage.toLowerCase().includes('network') || parsedMessage.toLowerCase().includes('unavailable')) {
      friendlyMessage = "Error de conexión. Verifica tu internet e inténtalo de nuevo." + whatsappSuffix();
    } else {
      friendlyMessage = `Error al procesar la nominación: ${parsedMessage}` + whatsappSuffix();
    }
    return { success: false, message: friendlyMessage };
  }
}

export async function getPendingNominationRequestsAction(edition: string = '2026'): Promise<NominationRequest[]> {
  try { return await getNominationRequestsByStatus('pending', edition); }
  catch (error) { console.error("Error getting pending requests:", error); return []; }
}

export async function getRejectedNominationRequestsAction(edition: string = '2026'): Promise<NominationRequest[]> {
  try { return await getNominationRequestsByStatus('rejected', edition); }
  catch (error) { console.error("Error getting rejected requests:", error); return []; }
}

export async function getApprovedNominationRequestsAction(edition: string = '2026'): Promise<NominationRequest[]> {
  try { return await getNominationRequestsByStatus('approved', edition); }
  catch (error) { console.error("Error getting approved requests:", error); return []; }
}

export async function getArchivedNominationRequestsAction(edition: string = '2025'): Promise<NominationRequest[]> {
  try { return await getNominationRequestsByStatus('archived', edition); }
  catch (error) { console.error("Error getting archived requests:", error); return []; }
}
export async function moveNomineeToPendingAction(requestId: string, nomineeId?: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`[ACTION] Moving request ${requestId} to pending. NomineeId: ${nomineeId}`);
    await adminDb.collection('nominationRequests').doc(requestId).update({ status: 'pending', nomineeId: "" });
    if (nomineeId && nomineeId !== "" && nomineeId !== "undefined") {
      await adminDb.collection('nominees').doc(nomineeId).delete();
      console.log(`[ACTION] Deleted nominee ${nomineeId}`);
      revalidatePath(`/nominados/${nomineeId}`);
    }
    revalidatePath('/vota');
    revalidatePath('/admin/requests');
    revalidatePath('/');
    return { success: true, message: "Nominado movido a espera de aprobación y retirado de la lista pública." };
  } catch (error) {
    console.error("Error moving nominee to pending:", error);
    return { success: false, message: "Ocurrió un error al mover el nominado a pendiente." };
  }
}

export async function approveNominationRequestAction(request: any): Promise<{ success: boolean; message: string; nomineeId?: string }> {
  try {
    const normalizedRequest = {
      id: request.id,
      nomineeName: request.nomineeName || request.name || request.fullName || "Nominado sin nombre",
      nomineeEmail: request.nomineeEmail || request.email || "",
      nomineeType: (request.nomineeType === 'entidad' || request.type === 'entidad') ? 'entidad' : 'persona',
      nomineeBio: request.nomineeBio || request.bio || request.description || "",
      leadershipLesson: request.leadershipLesson || request.lesson || "",
      category: request.category || "General",
      nomineeCountry: request.nomineeCountry || request.country || "",
      positionAndProject: request.positionAndProject || request.position || request.project || "",
      organizationName: request.organizationName || request.organization || request.company || "",
      websiteUrl: request.websiteUrl || "",
      instagramUrl: request.instagramUrl || "",
      facebookUrl: request.facebookUrl || "",
      linkedinUrl: request.linkedinUrl || "",
      youtubeVideoUrl: request.youtubeVideoUrl || "",
      profilePhotoUrl: request.profilePhotoUrl || request.imageUrl || "",
      edition: request.edition || '2026',
      nomineeId: request.nomineeId || "",
    };

    const nomineeData: any = {
      name: normalizedRequest.nomineeName,
      email: normalizedRequest.nomineeEmail,
      nomineeType: normalizedRequest.nomineeType,
      bio: normalizedRequest.nomineeBio,
      leadershipLesson: normalizedRequest.leadershipLesson,
      category: normalizedRequest.category,
      country: normalizedRequest.nomineeCountry,
      positionAndProject: normalizedRequest.positionAndProject,
      organizationName: normalizedRequest.organizationName,
      websiteUrl: normalizedRequest.websiteUrl || "",
      instagramUrl: normalizedRequest.instagramUrl || "",
      facebookUrl: normalizedRequest.facebookUrl || "",
      linkedinUrl: normalizedRequest.linkedinUrl || "",
      youtubeVideoUrl: normalizedRequest.youtubeVideoUrl || "",
      imageUrl: normalizedRequest.profilePhotoUrl && !normalizedRequest.profilePhotoUrl.includes('placeholder.png')
        ? normalizedRequest.profilePhotoUrl
        : `https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/public%2Flogo.png?alt=media`,
      edition: normalizedRequest.edition,
    };

    let nomineeId = normalizedRequest.nomineeId;
    if (nomineeId) {
      await adminDb.collection('nominees').doc(nomineeId).set(nomineeData, { merge: true });
    } else {
      nomineeData.votes = 0;
      const docRef = await adminDb.collection('nominees').add(nomineeData);
      nomineeId = docRef.id;
    }

    await adminDb.collection('nominationRequests').doc(normalizedRequest.id).update({
      status: 'approved',
      nomineeId,
      nomineeName: normalizedRequest.nomineeName,
      nomineeEmail: normalizedRequest.nomineeEmail,
      nomineeType: normalizedRequest.nomineeType,
      edition: normalizedRequest.edition,
    });

    if (normalizedRequest.nomineeEmail && nomineeId) {
      try {
        await sendApprovalEmail(normalizedRequest.nomineeEmail, normalizedRequest.nomineeName, nomineeId);
      } catch (emailErr) {
        console.error("Error sending approval email (non-blocking):", emailErr);
      }
    }

    revalidatePath('/vota');
    revalidatePath(`/nominados/${nomineeId}`);
    revalidatePath('/admin/requests');
    return { success: true, message: "Solicitud aprobada y nominado agregado correctamente.", nomineeId };
  } catch (error) {
    console.error("Error approving nomination request:", error);
    return { success: false, message: "Ocurrió un error al aprobar la solicitud. Verifica los campos requeridos." };
  }
}
export async function updateNominationRequestCategoryAction(requestId: string, newCategory: string): Promise<{ success: boolean; message: string }> {
  try {
    await adminDb.collection('nominationRequests').doc(requestId).update({ category: newCategory });
    revalidatePath('/admin/requests');
    return { success: true, message: "Categoría actualizada correctamente." };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, message: "No se pudo actualizar la categoría." };
  }
}
export async function rejectNominationRequestAction(requestId: string, rejectionReason?: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!requestId) return { success: false, message: "ID de solicitud no proporcionado." };
    const requestDoc = await adminDb.collection('nominationRequests').doc(requestId).get();
    if (!requestDoc.exists) {
      return { success: false, message: "No se encontró la solicitud de nominación." };
    }
    const request = requestDoc.data() as NominationRequest;
    await adminDb.collection('nominationRequests').doc(requestId).update({
      status: 'rejected',
      rejectionReason: rejectionReason || "",
    });
    if (request.nomineeEmail) {
      try {
        await sendRejectionEmail(request.nomineeEmail, request.nomineeName, rejectionReason);
      } catch (emailErr) {
        console.error("Error sending rejection email (non-blocking):", emailErr);
      }
    }
    revalidatePath('/admin/requests');
    return { success: true, message: "Solicitud de nominación rechazada y notificación enviada." };
  } catch (error) {
    console.error("Error rejecting nomination request:", error);
    return { success: false, message: `Error en el servidor: ${error instanceof Error ? error.message : "Error desconocido"}` };
  }
}

export async function getNomineeByIdAction(id: string): Promise<Nominee | null> {
  try {
    const nominee = await getNomineeById(id);
    return nominee;
  } catch (error) {
    console.error("Error getting nominee by ID action:", error);
    return null;
  }
}

export async function getNomineeRankAction(votes: number): Promise<number> {
  return await getNomineeRank(votes);
}

export async function getHighestVoteCountAction(): Promise<number> {
  return await getHighestVoteCount();
}

export async function getVoteCountsByIpAction(): Promise<{ ip: string, count: number }[]> {
  try {
    const snapshot = await getDocs(collection(db, 'votes'));
    const ipCounts: { [key: string]: number } = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.ip) {
        ipCounts[data.ip] = (ipCounts[data.ip] || 0) + 1;
      }
    });
    return Object.entries(ipCounts)
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error getting vote counts by IP:", error);
    return [];
  }
}

export async function deduplicateVotesAction(): Promise<{ success: boolean, message: string, removedCount: number }> {
  try {
    const snapshot = await adminDb.collection('votes').orderBy('createdAt', 'asc').get();
    const votesByIp: { [key: string]: any[] } = {};
    snapshot.forEach(doc => {
      const data = doc.data();
      const ip = data.ip;
      if (!votesByIp[ip]) votesByIp[ip] = [];
      votesByIp[ip].push({ id: doc.id, ...data });
    });
    let removedCount = 0;
    const batch = adminDb.batch();
    for (const ip in votesByIp) {
      const votes = votesByIp[ip];
      if (votes.length > 1) {
        for (let i = 1; i < votes.length; i++) {
          batch.delete(adminDb.collection('votes').doc(votes[i].id));
          removedCount++;
        }
      }
    }
    if (removedCount > 0) {
      await batch.commit();
      revalidatePath('/vota');
    }
    return { success: true, message: `Se eliminaron ${removedCount} votos duplicados.`, removedCount };
  } catch (error: any) {
    console.error("Error deduplicating votes:", error);
    return { success: false, message: error.message || 'Ocurrió un error al eliminar duplicados.', removedCount: 0 };
  }
}

export async function syncVotesAction(): Promise<{ success: boolean, message: string, updates: string[] }> {
  try {
    console.log("[ACTION] Inicia sincronización de votos desde logs...");
    const updates: string[] = [];
    const votesSnapshot = await adminDb.collection('votes').get();
    const logsCountByNominee: { [key: string]: number } = {};
    votesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.nomineeId) {
        logsCountByNominee[data.nomineeId] = (logsCountByNominee[data.nomineeId] || 0) + 1;
      }
    });
    const nomineesSnapshot = await adminDb.collection('nominees').get();
    let updateCount = 0;
    let batch = adminDb.batch();
    let operationCount = 0;
    for (const nomineeDoc of nomineesSnapshot.docs) {
      const nomineeId = nomineeDoc.id;
      const data = nomineeDoc.data();
      const currentVotes = data.votes || 0;
      const logCount = logsCountByNominee[nomineeId] || 0;
      if (logCount !== currentVotes) {
        batch.update(adminDb.collection('nominees').doc(nomineeId), { votes: logCount });
        updates.push(`Sincronizado: ${data.name} (${currentVotes} -> ${logCount})`);
        updateCount++;
        operationCount++;
        if (operationCount >= 450) {
          await batch.commit();
          batch = adminDb.batch();
          operationCount = 0;
        }
      }
    }
    if (operationCount > 0) {
      await batch.commit();
    }
    console.log(`[ACTION] Sincronización completada. ${updateCount} nominados actualizados.`);
    revalidatePath('/vota');
    revalidatePath('/admin');
    return { success: true, message: `Sincronización completada. Se actualizaron ${updateCount} nominados.`, updates };
  } catch (error: any) {
    console.error("Error syncing votes:", error);
    return { success: false, message: `Error en sincronización: ${error.message}`, updates: [] };
  }
}

export async function addFreeRegistrationAction(data: {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  websiteOrLinkedin: string;
  participationStatus: string;
  whatsapp: string;
  comments?: string;
  venues?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const registrationData = {
      ...data,
      status: 'pending',
      createdAt: new Date(),
      type: 'free',
    };
    await adminDb.collection('free_registrations').add(registrationData);
    return { success: true, message: "Registro enviado exitosamente. En breve recibirás noticias nuestras." };
  } catch (error: any) {
    console.error("Error in addFreeRegistrationAction:", error);
    return { success: false, message: `Error al procesar el registro: ${error.message}` };
  }
}

export async function getFreeRegistrationsAction(): Promise<any[]> {
  try {
    const snapshot = await adminDb.collection('free_registrations').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }));
  } catch (error) {
    console.error("Error getting free registrations:", error);
    return [];
  }
}

export async function updateFreeRegistrationStatusAction(id: string, status: 'approved' | 'rejected'): Promise<{ success: boolean; message: string }> {
  try {
    const docSnap = await adminDb.collection('free_registrations').doc(id).get();
    const data = docSnap.data();

    await adminDb.collection('free_registrations').doc(id).update({ status });
    revalidatePath('/admin/attendees');

    // Enviar email de notificación
    if (data?.email && data?.firstName) {
      if (status === 'approved') {
        await sendFreeRegistrationApprovalEmail(data.email, data.firstName, data.participationStatus, data.venues);
      } else {
        await sendFreeRegistrationRejectionEmail(data.email, data.firstName);
      }
    }

    return { success: true, message: `Registro ${status === 'approved' ? 'aprobado' : 'rechazado'} correctamente. Email enviado.` };
  } catch (error: any) {
    console.error("Error updating free registration status:", error);
    return { success: false, message: `Error: ${error.message}` };
  }
}

export async function adjustTop12VotesAction(): Promise<{ success: boolean, message: string, details: string[] }> {
  const adjustments: { name: string; votesToSubtract: number }[] = [
    { name: "Leonardo Penotti", votesToSubtract: 3789 },
    { name: "Karen Farías Cruzado", votesToSubtract: 2898 },
    { name: "Michael Franco", votesToSubtract: 2347 },
    { name: "Elizabeth Casillas Cruz", votesToSubtract: 1689 },
    { name: "Jonathan yesid Roa Jaimes", votesToSubtract: 1889 },
    { name: "Yudith Ortega", votesToSubtract: 1189 },
    { name: "JUANA NOEMÍ MIRANDA VALENCIA", votesToSubtract: 878 },
    { name: "Thomas Nett", votesToSubtract: 323 },
  ];
  const details: string[] = [];
  let success = true;
  try {
    for (const adj of adjustments) {
      const snapshot = await adminDb.collection('nominees').where('name', '==', adj.name).get();
      if (!snapshot.empty) {
        const nomineeDoc = snapshot.docs[0];
        const currentVotes = nomineeDoc.data().votes || 0;
        const newVotes = Math.max(0, currentVotes - adj.votesToSubtract);
        await adminDb.collection('nominees').doc(nomineeDoc.id).update({ votes: newVotes });
        details.push(`Éxito: ${adj.name} - ${adj.votesToSubtract} votos. Nuevo total: ${newVotes}`);
      } else {
        success = false;
        details.push(`Error: No se encontró al nominado '${adj.name}'.`);
      }
    }
    revalidatePath('/vota');
    return { success, message: "Proceso de ajuste de votos completado.", details };
  } catch (error: any) {
    console.error("Error general en adjustTop12VotesAction:", error);
    return { success: false, message: error.message || 'Ocurrió un error general.', details };
  }
}

export async function getAnalyticsSummaryAction(edition: string = '2026'): Promise<{
  totalVotes: number;
  totalNominees: number;
  totalRequests: number;
  pendingRequests: number;
}> {
  try {
    const [nomineesSnap, requestsSnap, pendingSnap, votesSnap] = await Promise.all([
      adminDb.collection('nominees').where('edition', '==', edition).count().get(),
      adminDb.collection('nominationRequests').where('edition', '==', edition).count().get(),
      adminDb.collection('nominationRequests').where('edition', '==', edition).where('status', '==', 'pending').count().get(),
      adminDb.collection('votes').count().get(),
    ]);
    return {
      totalNominees: nomineesSnap.data().count,
      totalRequests: requestsSnap.data().count,
      pendingRequests: pendingSnap.data().count,
      totalVotes: votesSnap.data().count,
    };
  } catch (error) {
    console.error("Error getting analytics summary:", error);
    return { totalVotes: 0, totalNominees: 0, totalRequests: 0, pendingRequests: 0 };
  }
}

export async function getVotesByCategoryAction(edition: string = '2026'): Promise<{ name: string; value: number }[]> {
  try {
    const nomineesSnap = await adminDb.collection('nominees').where('edition', '==', edition).get();
    const categoryMap: { [key: string]: number } = {};
    nomineesSnap.forEach(doc => {
      const data = doc.data();
      const cat = data.category || 'Sin categoría';
      categoryMap[cat] = (categoryMap[cat] || 0) + (data.votes || 0);
    });
    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error("Error getting votes by category:", error);
    return [];
  }
}

export async function getVotesByCountryAction(edition: string = '2026'): Promise<{ name: string; value: number }[]> {
  try {
    const nomineesSnap = await adminDb.collection('nominees').where('edition', '==', edition).get();
    const countryMap: { [key: string]: number } = {};
    nomineesSnap.forEach(doc => {
      const data = doc.data();
      const country = data.country || 'Sin país';
      countryMap[country] = (countryMap[country] || 0) + (data.votes || 0);
    });
    return Object.entries(countryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error("Error getting votes by country:", error);
    return [];
  }
}

export async function generateNomineeAIContentAction(nomineeId: string, language: 'es' | 'en' = 'es'): Promise<{ success: boolean, message: string }> {
  try {
    const nominee = await getNomineeById(nomineeId);
    if (!nominee) {
      return { success: false, message: "Nominado no encontrado." };
    }
    const { summary, headline } = await summarizeNominee({ bio: nominee.bio, language });
    await updateNominee(nomineeId, { aiSummary: summary, aiHeadline: headline });
    revalidatePath(`/nominados/${nomineeId}`);
    revalidatePath('/vota');
    return { success: true, message: "Contenido de IA generado y actualizado exitosamente." };
  } catch (error) {
    console.error("Error generating AI content:", error);
    return { success: false, message: "Error al generar contenido con IA." };
  }
}

export async function getVoteTrendsAction(): Promise<{ date: string; votes: number }[]> {
  try {
    const votesSnap = await getDocs(query(collection(db, 'votes'), orderBy('createdAt', 'asc')));
    const trendMap: { [key: string]: number } = {};
    votesSnap.forEach(doc => {
      const data = doc.data();
      if (data.createdAt) {
        const date = data.createdAt.toDate().toISOString().split('T')[0];
        trendMap[date] = (trendMap[date] || 0) + 1;
      }
    });
    return Object.entries(trendMap).map(([date, votes]) => ({ date, votes }));
  } catch (error) {
    console.error("Error getting vote trends:", error);
    return [];
  }
}

export async function sendTestEmailAction(to: string): Promise<{ success: boolean, message: string }> {
  try {
    await sendTestEmail(to);
    return { success: true, message: `Correo de prueba enviado exitosamente a ${to}` };
  } catch (error: any) {
    console.error("Error in sendTestEmailAction:", error);
    const errorMessage = error.message || "Error desconocido";
    const code = error.code || "";
    const command = error.command || "";
    const response = error.response || "";
    return {
      success: false,
      message: `Error SMTP: ${errorMessage} ${code ? `(Cod: ${code})` : ""} ${command ? `[Cmd: ${command}]` : ""} ${response ? `Resp: ${response}` : ""}`,
    };
  }
}

export async function trackReferralAction(referralCode: string) {
  try {
    const partnersRef = adminDb.collection('partners');
    const q = partnersRef.where('referralCode', '==', referralCode).limit(1);
    const snap = await q.get();
    if (!snap.empty) {
      const partnerDoc = snap.docs[0];
      await partnerDoc.ref.update({
        clickCount: FieldValue.increment(1),
      });
      return { success: true };
    }
    return { success: false, message: "Referral code not found" };
  } catch (error) {
    console.error("Error in trackReferralAction:", error);
    return { success: false };
  }
}
