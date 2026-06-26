import { Metadata } from 'next';
import Header from '@/components/header';
import EventInvitation from '@/components/event-invitation';
import Footer from '@/components/footer';
import { Vote as VoteIcon, Calendar } from 'lucide-react';
import { categories } from '@/lib/data';
import { getAssetUrl } from '@/lib/assets';
import VotePageClient from './VotePageClient';

export const metadata: Metadata = {
  title: 'Voting 2026 | Heart-Led Summit & Awards',
  description:
    'Support the leaders transforming the world. Your vote recognizes their impact, vision, and track record in the 2026 edition.',
  openGraph: {
    title: 'Voting 2026 | Heart-Led Summit & Awards',
    description:
      'Support the leaders transforming the world. Your vote recognizes their impact, vision, and track record in the 2026 edition.',
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
                You can nominate and receive votes until 1 day before the awards ceremony.
              </span>
            </div>
            <VoteIcon className="mb-4 h-16 w-16 animate-pulse text-primary" />
            <h2 className="mb-4 text-center text-5xl font-extrabold tracking-tight text-primary">
              Voting 2026
            </h2>
            <p className="max-w-2xl text-center text-lg text-muted-foreground">
              Support the heart-led leaders making a difference. Your vote recognizes their
              impact, vision, and track record.
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
