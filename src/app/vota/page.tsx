import { Metadata } from 'next';
import Header from '@/components/header';
import EventInvitation from '@/components/event-invitation';
import Footer from '@/components/footer';
import { Vote as VoteIcon, Calendar } from 'lucide-react';
import { categories } from '@/lib/data';
import { getAssetUrl } from '@/lib/assets';
import VotePageClient from './VotePageClient';

export const metadata: Metadata = {
  title: 'Votaciones 2026 | Latin American Leaders Awards',
  description:
    'Apoya a los líderes que están transformando América Latina. Tu voto reconoce su impacto, visión y trayectoria en la edición 2026.',
  openGraph: {
    title: 'Votaciones 2026 | Latin American Leaders Awards',
    description:
      'Apoya a los líderes que están transformando América Latina. Tu voto reconoce su impacto, visión y trayectoria en la edición 2026.',
    type: 'website',
    images: [getAssetUrl('Latin-American-Leaders-Awards-Viena 2.webp')],
  },
};

export const dynamic = 'force-dynamic';

export default function VotaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="container mx-auto flex-grow px-4 py-8">
        <section>
          <div className="mb-12 flex flex-col items-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-xs font-bold text-red-500 shadow-sm animate-pulse">
              <Calendar className="h-4 w-4" />
              <span>
                Puedes nominarte y recibir votos hasta 1 día antes del evento de premiación.
              </span>
            </div>
            <VoteIcon className="mb-4 h-16 w-16 animate-pulse text-primary" />
            <h2 className="mb-4 text-center text-5xl font-extrabold tracking-tight text-primary">
              Votaciones 2026
            </h2>
            <p className="max-w-2xl text-center text-lg text-muted-foreground">
              Apoya a los líderes que están transformando América Latina. Tu voto reconoce su
              impacto, visión y trayectoria.
            </p>
          </div>

          {/* Aquí dentro vamos a integrar el stepper + gate de redes + NomineeList */}
          <VotePageClient categories={categories} edition="2026" />
        </section>
      </main>

      <EventInvitation />
      <Footer />
    </div>
  );
}
