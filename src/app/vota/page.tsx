
import { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/header';
import NomineeList from '@/components/nominee-list';
import { categories } from '@/lib/data';
import EventInvitation from '@/components/event-invitation';
import Footer from '@/components/footer';
import { Vote as VoteIcon, Loader2, Calendar } from 'lucide-react';
import { getNomineesAction } from '@/app/actions';

import { getAssetUrl } from '@/lib/assets';

export const metadata: Metadata = {
  title: 'Votaciones 2026 | Latin American Leaders Awards',
  description: 'Apoya a los líderes que están transformando América Latina. Tu voto reconoce su impacto, visión y trayectoria en la edición 2026.',
  openGraph: {
    title: 'Votaciones 2026 | Latin American Leaders Awards',
    description: 'Apoya a los líderes que están transformando América Latina. Tu voto reconoce su impacto, visión y trayectoria en la edición 2026.',
    type: 'website',
    images: [getAssetUrl('Latin-American-Leaders-Awards-Viena 2.webp')],
  }
};

export const revalidate = 60;

export default async function VotaPage() {
  const initialData = await getNomineesAction({ 
    limit: 20, 
    categories: [...categories],
    edition: '2026'
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section>
          <div className="flex flex-col items-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold mb-6 shadow-sm animate-pulse">
               <Calendar className="w-4 h-4" />
               Puedes Nominarte y Recibir votos hasta 1 día antes del evento de premiación
            </div>
            <VoteIcon className="w-16 h-16 text-primary mb-4 animate-pulse" />
            <h2 className="text-5xl font-extrabold text-center mb-4 text-primary tracking-tight">Votaciones 2026</h2>
            <p className="text-center text-muted-foreground max-w-2xl text-lg">
                Apoya a los líderes que están transformando América Latina. Tu voto reconoce su impacto, visión y trayectoria.
            </p>
          </div>
          
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Cargando sistema de votación...</p>
            </div>
          }>
            <NomineeList 
              categories={[...categories]} 
              yearLabel="2026" 
              allowVoting={true} 
              initialNominees={initialData.nominees}
              edition="2026"
            />
          </Suspense>
        </section>
      </main>

      <EventInvitation />
      <Footer />
    </div>
  );
}
