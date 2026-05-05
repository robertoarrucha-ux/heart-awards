
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addNominee } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Loader2, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MigratePage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);
  const [results, setResults] = useState<{ success: string[]; error: string[] }>({ success: [], error: [] });
  const { toast } = useToast();

  const handleMigrate = async () => {
    try {
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) {
        throw new Error('El input debe ser un array de objetos.');
      }

      setIsMigrating(true);
      setResults({ success: [], error: [] });

      for (const item of data) {
        try {
          // Validate required fields
          if (!item.name || !item.category) {
             setResults(prev => ({ ...prev, error: [...prev.error, `Campo faltante para: ${item.name || 'Sin nombre'}`] }));
             continue;
          }

          const nomineeData = {
            name: item.name,
            nomineeType: item.nomineeType || 'persona',
            bio: item.bio || '',
            leadershipLesson: item.leadershipLesson || '',
            imageUrl: item.imageUrl || 'https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/public%2Flogo.png?alt=media',
            category: item.category,
            country: item.country || 'Desconocido',
            websiteUrl: item.websiteUrl || '',
            instagramUrl: item.instagramUrl || '',
            facebookUrl: item.facebookUrl || '',
            linkedinUrl: item.linkedinUrl || '',
            positionAndProject: item.positionAndProject || '',
            organizationName: item.organizationName || '',
            youtubeVideoUrl: item.youtubeVideoUrl || '',
            email: item.email || ''
          };

          await addNominee(nomineeData, '2026');
          setResults(prev => ({ ...prev, success: [...prev.success, `Añadido: ${item.name}`] }));
        } catch (err: any) {
          setResults(prev => ({ ...prev, error: [...prev.error, `Error con ${item.name}: ${err.message}`] }));
        }
      }

      toast({
        title: "Migración completada",
        description: `Se procesaron ${data.length} registros.`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error de formato",
        description: err.message,
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">Migrador de Nominados</h1>
            <p className="text-muted-foreground">Pega la lista de nominados en formato JSON para subirlos a Firestore (Edición 2026).</p>
          </div>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Input de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Ejemplo de formato: <code className="bg-white/5 p-1 rounded">{"[ { \"name\": \"Nombre\", \"category\": \"Categoría\", ... } ]"}</code>
                </p>
                <Textarea 
                  placeholder='[ { "name": "Ejemplo", "category": "Líderes..." } ]'
                  className="min-h-[300px] font-mono text-xs bg-black/40 border-white/10"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleMigrate} 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-bold"
                disabled={isMigrating || !jsonInput}
              >
                {isMigrating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Migrando datos...
                  </>
                ) : (
                  'Comenzar Migración a Firestore'
                )}
              </Button>
            </CardContent>
          </Card>

          {(results.success.length > 0 || results.error.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-green-500/5 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-sm text-green-500 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Exitosos ({results.success.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto text-xs space-y-1">
                  {results.success.map((msg, i) => <div key={i} className="text-green-200/60">{msg}</div>)}
                </CardContent>
              </Card>

              <Card className="bg-red-500/5 border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Errores ({results.error.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto text-xs space-y-1">
                  {results.error.map((msg, i) => <div key={i} className="text-red-200/60">{msg}</div>)}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
