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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <section>
          <div className="flex flex-col items-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold mb-6 shadow-sm animate-pulse text-center">
              <Calendar className="w-4 h-4" />
              <span>
                Puedes Nominarte y Recibir votos hasta 1 día antes del evento de premiación
              </span>
            </div>
            <VoteIcon className="w-16 h-16 text-primary mb-4 animate-pulse" />
            <h2 className="text-5xl font-extrabold text-center mb-4 text-primary tracking-tight">
              Votaciones 2026
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl text-lg">
              Apoya a los líderes que están transformando América Latina. Tu voto reconoce su
              impacto, visión y trayectoria.
            </p>
          </div>

          <VotePageClient categories={categories} edition="2026" />
        </section>
      </main>

      <EventInvitation />
      <Footer />
    </div>
  );
}
