
'use client';

import { useState } from 'react';
import Header from '@/components/header';
import AdminHeader from '@/components/admin-header';
import AdminGuard from '@/components/admin-guard';
import { adjustTop12VotesAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, ListChecks, CheckCircle } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/footer';

export default function AdjustVotesPage() {
  return (
    <AdminGuard>
      <AdjustVotesContent />
    </AdminGuard>
  );
}

function AdjustVotesContent() {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [resultDetails, setResultDetails] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAdjustVotes = async () => {
    setIsAdjusting(true);
    setResultDetails([]);
    try {
      const result = await adjustTop12VotesAction();
      if (result.success) {
        toast({
          title: "¡Ajuste Exitoso!",
          description: "El recuento de votos ha sido actualizado.",
        });
      } else {
         toast({
          variant: "destructive",
          title: "Error en el Ajuste",
          description: result.message,
        });
      }
      setResultDetails(result.details);
    } catch (err) {
       console.error("Error in handleAdjustVotes:", err);
       toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error inesperado al ajustar los votos.",
        });
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AdminHeader title="Ajuste Manual de Votos" icon={AlertTriangle} />

        <Card className="max-w-2xl mx-auto bg-card border-destructive/50">
            <CardHeader>
                <CardTitle className="text-2xl text-destructive">Acción Crítica: Ajustar Votos</CardTitle>
                <CardDescription>
                    Esta herramienta ejecutará una resta de votos pre-programada. Esta acción es irreversible y puede ejecutarse según sea necesario para aplicar correcciones.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-6 text-muted-foreground">
                    Al hacer clic en el botón, se aplicarán las reducciones de votos a los nominados correspondientes. Por favor, revisa cuidadosamente antes de proceder.
                </p>
                
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full text-lg py-6" disabled={isAdjusting}>
                            {isAdjusting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <AlertTriangle className="mr-2 h-6 w-6" />}
                            {isAdjusting ? 'Ajustando Votos...' : 'Ajustar Votos'}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de alterar permanentemente el recuento de votos de varios nominados. Esta acción no se puede deshacer. Los cambios se aplicarán inmediatamente.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAdjustVotes} disabled={isAdjusting}>Sí, ajustar votos ahora</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {resultDetails.length > 0 && (
                    <div className='space-y-4 mt-6'>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-green-900/50 text-green-300 border border-green-700">
                           <CheckCircle className="h-8 w-8" />
                           <div>
                            <h3 className='text-lg font-bold'>Proceso de Ajuste Finalizado</h3>
                            <p>Revisa los resultados a continuación.</p>
                           </div>
                        </div>
                         <Card className="bg-muted">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><ListChecks />Resultados del Ajuste</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm font-mono list-disc pl-5">
                                    {resultDetails.map((detail, index) => (
                                        <li key={index} className={detail.startsWith('Error') ? 'text-red-400' : 'text-muted-foreground'}>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
