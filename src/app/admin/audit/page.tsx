
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import AdminHeader from '@/components/admin-header';
import AdminGuard from '@/components/admin-guard';
import { getVoteCountsByIpAction, deduplicateVotesAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Shield, Trash2, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Footer from '@/components/footer';

type IpVoteCount = {
  ip: string;
  count: number;
};

export default function AuditPage() {
  return (
    <AdminGuard>
      <AuditContent />
    </AdminGuard>
  );
}

function AuditContent() {
  const [voteCounts, setVoteCounts] = useState<IpVoteCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCleaning, setIsCleaning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchVoteCounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const counts = await getVoteCountsByIpAction();
      setVoteCounts(counts);
    } catch (err) {
      setError('Failed to load vote audit data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVoteCounts();
  }, []);

  const handleDeduplicate = async () => {
    setIsCleaning(true);
    try {
      const result = await deduplicateVotesAction();
      if (result.success) {
        toast({
          title: "¡Limpieza Exitosa!",
          description: result.message,
        });
        // Refresh the counts after cleaning
        await fetchVoteCounts();
      } else {
         toast({
          variant: "destructive",
          title: "Error en la Limpieza",
          description: result.message,
        });
      }
    } catch (err) {
       console.error("Error in handleDeduplicate:", err);
       toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error inesperado al limpiar los votos.",
        });
    } finally {
      setIsCleaning(false);
    }
  };

  const hasDoubleVotes = voteCounts.some(vc => vc.count > 1);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AdminHeader title="Audit Trail de Votos" icon={Shield} />

        <div className="bg-card p-6 rounded-lg shadow-lg border border-primary/20">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-primary/80 mb-2">Registro de Votos por IP</h2>
                    <p className="text-muted-foreground">Esta tabla muestra todas las direcciones IP que han emitido votos, ordenadas por el número total de votos. Cualquier IP con un conteo mayor a 1 se resalta en rojo e indica un intento de manipulación.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="destructive" disabled={isCleaning || !hasDoubleVotes}>
                        {isCleaning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        {isCleaning ? 'Limpiando...' : 'Limpiar Votos Duplicados'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará todos los registros de votos duplicados, conservando solo el primer voto de cada IP. Esto no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeduplicate}>Sí, limpiar votos</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

            </div>
          
          {isLoading ? (
             <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : error ? (
            <div className="text-center py-16 text-destructive-foreground bg-destructive/80 rounded-lg">
              <h3 className="text-xl font-semibold">{error}</h3>
            </div>
          ) : voteCounts.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-muted-foreground/20 rounded-lg">
              <h3 className="text-xl font-semibold text-muted-foreground">No se han registrado votos</h3>
              <p className="text-muted-foreground mt-2">Cuando los usuarios comiencen a votar, los registros aparecerán aquí.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dirección IP</TableHead>
                  <TableHead className="text-right">Número de Votos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voteCounts.map(({ ip, count }) => (
                  <TableRow key={ip} className={count > 1 ? 'bg-destructive/10' : ''}>
                    <TableCell className="font-mono">{ip}</TableCell>
                    <TableCell className={`text-right font-bold text-lg ${count > 1 ? 'text-destructive' : ''}`}>{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
