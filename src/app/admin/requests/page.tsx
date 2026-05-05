
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import AdminHeader from '@/components/admin-header';
import AdminGuard from '@/components/admin-guard';
import { approveNominationRequestAction, rejectNominationRequestAction, moveNomineeToPendingAction } from '@/app/actions';
import { type NominationRequest } from '@/lib/data';
import NominationRequestCard from '@/components/nomination-request-card';
import { useToast } from "@/hooks/use-toast";
import EventInvitation from '@/components/event-invitation';
import { Separator } from '@/components/ui/separator';
import { Mail, History } from 'lucide-react';
import { getTimestampMillis } from '@/lib/utils';
import Link from 'next/link';
import Footer from '@/components/footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function ReviewRequestsPage() {
  return (
    <AdminGuard>
      <ReviewRequestsContent />
    </AdminGuard>
  );
}

function ReviewRequestsContent() {
  const [pendingRequests, setPendingRequests] = useState<NominationRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<NominationRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<NominationRequest[]>([]);
  const [archivedRequests, setArchivedRequests] = useState<NominationRequest[]>([]);
  const [selectedEdition, setSelectedEdition] = useState<string>('2026');
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);
  const [isMovingToPending, setIsMovingToPending] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const requestsRef = collection(db, 'nominationRequests');
    
    const q = query(
      requestsRef, 
      where('edition', '==', selectedEdition)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NominationRequest[];

      // Sort by createdAt desc on client to avoid composite index requirement
      allRequests.sort((a, b) => getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt));

      setPendingRequests(allRequests.filter(r => r.status === 'pending'));
      setRejectedRequests(allRequests.filter(r => r.status === 'rejected'));
      setApprovedRequests(allRequests.filter(r => r.status === 'approved'));
      setArchivedRequests(allRequests.filter(r => r.status === 'archived'));
      setIsLoading(false);
    }, (error: any) => {
      console.error("Error listening to requests:", error);
      let description = "No se pudieron cargar las solicitudes en tiempo real.";
      if (error.message && error.message.includes('index')) {
        description = "Falta un índice en la base de datos. Revisa la consola para el enlace de creación.";
      } else if (error.code === 'permission-denied') {
        description = "Permiso denegado. Verifica que tu cuenta sea administradora.";
      }
      
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description,
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [selectedEdition, toast]);

  const handleApprove = async (request: NominationRequest) => {
    setIsApproving(request.id);
    try {
      const result = await approveNominationRequestAction(request);
      if (result.success) {
        toast({
          title: "¡Nominado Aprobado!",
          description: `${request.nomineeName} ha sido agregado a la lista oficial de nominados.`,
        });
        setPendingRequests(prevRequests => prevRequests.filter(r => r.id !== request.id));
        const newApprovedRequest = { ...request, status: 'approved', nomineeId: result.nomineeId } as NominationRequest;
        setApprovedRequests(prev => [newApprovedRequest, ...prev].sort((a,b) => {
            return getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt);
        }));
      } else {
        toast({
          variant: "destructive",
          title: "Error al Aprobar",
          description: result.message,
        });
      }
    } catch (error) {
       console.error("Error in handleApprove:", error);
       toast({
          variant: "destructive",
          title: "Error de Servidor",
          description: error instanceof Error ? error.message : "Ocurrió un error inesperado al aprobar la solicitud.",
        });
    } finally {
        setIsApproving(null);
    }
  };

  const handleReject = async (request: NominationRequest, reason?: string) => {
    setIsRejecting(request.id);
    try {
      const result = await rejectNominationRequestAction(request.id, reason);
      if (result.success) {
        toast({
          title: "Solicitud Rechazada",
          description: "La solicitud de nominación ha sido rechazada.",
        });
        setPendingRequests(prevRequests => prevRequests.filter(r => r.id !== request.id));
        const newRejectedRequest = { ...request, status: 'rejected', rejectionReason: reason } as NominationRequest;
        setRejectedRequests(prevRequests => 
          [newRejectedRequest, ...prevRequests].sort((a,b) => {
            return getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt);
          })
        );
      } else {
        toast({
          variant: "destructive",
          title: "Error al Rechazar",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error in handleReject:", error);
      toast({
        variant: "destructive",
        title: "Error de Servidor",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado al rechazar la solicitud.",
      });
    } finally {
      setIsRejecting(null);
    }
  };

  const handleMoveToPending = async (request: NominationRequest) => {
    setIsMovingToPending(request.id);
    try {
      const result = await moveNomineeToPendingAction(request.id, request.nomineeId);
      if (result.success) {
        toast({
          title: "Movido a Pendiente",
          description: "La solicitud ha vuelto a estado pendiente y el nominado ha sido retirado.",
        });
        
        // Remove from current list
        if (request.status === 'approved') {
            setApprovedRequests(prev => prev.filter(r => r.id !== request.id));
        } else {
            setRejectedRequests(prev => prev.filter(r => r.id !== request.id));
        }
        
        // Add to pending
        const newPendingRequest = { ...request, status: 'pending' } as NominationRequest;
        setPendingRequests(prev => [newPendingRequest, ...prev].sort((a,b) => {
            return getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt);
        }));
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error in handleMoveToPending:", error);
      toast({
        variant: "destructive",
        title: "Error de Servidor",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado al mover el nominado a pendiente.",
      });
    } finally {
      setIsMovingToPending(null);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <AdminHeader title="Revisión de Solicitudes" icon={Mail} />
          
          <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-primary/10 shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">Filtrar por Edición:</span>
            <Select value={selectedEdition} onValueChange={setSelectedEdition}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Edición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-primary/80 mb-6">Solicitudes Pendientes</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card p-6 rounded-lg shadow-lg animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : pendingRequests.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <h3 className="text-xl font-semibold text-muted-foreground">No hay solicitudes pendientes</h3>
                  <p className="text-muted-foreground mt-2">Cuando alguien envíe una solicitud de nominación, aparecerá aquí.</p>
              </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingRequests.map(request => (
                <NominationRequestCard
                  key={request.id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isApproving={isApproving === request.id}
                  isRejecting={isRejecting === request.id}
                />
              ))}
            </div>
          )}
        </section>

        <Separator className="my-12" />

        <section>
          <h2 className="text-2xl font-semibold text-green-500/80 mb-6">Solicitudes Aprobadas (Publicadas)</h2>
           {isLoading ? (
             <p className="text-muted-foreground">Cargando solicitudes aprobadas...</p>
           ) : approvedRequests.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <h3 className="text-xl font-semibold text-muted-foreground">No hay solicitudes aprobadas</h3>
                  <p className="text-muted-foreground mt-2">Las solicitudes que apruebes aparecerán aquí.</p>
              </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {approvedRequests.map(request => (
                <NominationRequestCard
                  key={request.id}
                  request={request}
                  onApprove={() => {}} 
                  onReject={() => {}}
                  onMoveToPending={handleMoveToPending}
                  isApproving={false}
                  isRejecting={false}
                  isMovingToPending={isMovingToPending === request.id}
                  isApproved={true}
                />
              ))}
            </div>
           )}
        </section>

        <Separator className="my-12" />

        <section>
          <h2 className="text-2xl font-semibold text-red-500/80 mb-6">Solicitudes Rechazadas</h2>
           {isLoading ? (
             <p className="text-muted-foreground">Cargando solicitudes rechazadas...</p>
           ) : rejectedRequests.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <h3 className="text-xl font-semibold text-muted-foreground">No hay solicitudes rechazadas</h3>
                  <p className="text-muted-foreground mt-2">Las solicitudes que rechaces aparecerán aquí.</p>
              </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rejectedRequests.map(request => (
                <NominationRequestCard
                  key={request.id}
                  request={request}
                  onApprove={() => {}} 
                  onReject={() => {}}
                  onMoveToPending={handleMoveToPending}
                  isApproving={false}
                  isRejecting={false}
                  isMovingToPending={isMovingToPending === request.id}
                  isRejected={true}
                />
              ))}
            </div>
           )}
        </section>
        <Separator className="my-12" />

        <section>
          <h2 className="text-2xl font-semibold text-muted-foreground mb-6 flex items-center gap-2">
            <History size={24} /> Solicitudes Archivadas
          </h2>
           {isLoading ? (
             <p className="text-muted-foreground">Cargando solicitudes archivadas...</p>
           ) : archivedRequests.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <h3 className="text-xl font-semibold text-muted-foreground">No hay solicitudes archivadas</h3>
                  <p className="text-muted-foreground mt-2">Las solicitudes de ediciones pasadas aparecerán aquí.</p>
              </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-75 grayscale-[0.5] hover:grayscale-0 hover:opacity-100 transition-all">
              {archivedRequests.map(request => (
                <NominationRequestCard
                  key={request.id}
                  request={request}
                  onApprove={() => {}} 
                  onReject={() => {}}
                  onMoveToPending={handleMoveToPending}
                  isApproving={false}
                  isRejecting={false}
                  isMovingToPending={isMovingToPending === request.id}
                  isApproved={true}
                />
              ))}
            </div>
           )}
        </section>
      </main>
      <EventInvitation />
      <Footer />
    </div>
  );
}
