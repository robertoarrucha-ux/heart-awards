
import { Suspense } from 'react';
import Header from '@/components/header';
import NomineeList from '@/components/nominee-list';
import { categories2025 } from '@/lib/data';
import EventInvitation from '@/components/event-invitation';
import Footer from '@/components/footer';
import { Loader2, Medal } from 'lucide-react';
import { getNomineesAction } from '@/app/actions';

export const revalidate = 3600; // Cache for 1 hour as it's historical data

export default async function Edition2025Page() {
  const initialData = await getNomineesAction({ 
    limit: 15, 
    categories: [...categories2025],
    edition: '2025'
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section>
          <div className="flex flex-col items-center mb-12">
            <Medal className="w-16 h-16 text-primary mb-4" />
            <h2 className="text-5xl font-extrabold text-center mb-4 text-primary tracking-tight">Edición 2025</h2>
            <p className="text-center text-muted-foreground max-w-2xl text-lg">
                Revive el impacto de los líderes reconocidos en la edición anterior de los Latin American Leaders Awards.
            </p>
          </div>
          
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Cargando archivo histórico...</p>
            </div>
          }>
            <NomineeList 
              categories={[...categories2025]} 
              yearLabel="2025" 
              allowVoting={false} 
              initialNominees={initialData.nominees}
              edition="2025"
            />
          </Suspense>
        </section>
      </main>
      <EventInvitation />
      <Footer />
    </div>
  );
}
