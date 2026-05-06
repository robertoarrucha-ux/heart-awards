'use client';

import { useEffect, useState } from 'react';
import { BarChart3, MapPin, Medal } from 'lucide-react';
import NomineeList from '@/components/nominee-list';
import type { Nominee } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

type VotePageClientProps = {
  categories: string[];
  edition: string;
  initialNominees?: Nominee[];
};

// Bloque de Top 10 (Top 5 destacado + 6–10 ganadores)
type TopRankingProps = {
  topTen: Nominee[];
};

function TopRanking({ topTen }: TopRankingProps) {
  if (!topTen || topTen.length === 0) return null;

  const topFive = topTen.slice(0, 5);
  const sixToTen = topTen.slice(5, 10);

  return (
    <div className="space-y-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-200">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-yellow-100">
              Top 5 líderes en tiempo real
            </p>
            <p className="text-xs text-yellow-100/80 md:text-sm">
              Ranking dinámico según los votos del público para la edición 2026.
            </p>
          </div>
        </div>
        <span className="hidden text-[11px] uppercase tracking-wide text-yellow-100/70 md:block">
          Actualizado en tiempo real
        </span>
      </div>

      {/* Top 5 destacados – mobile first */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {topFive.map((nominee, index) => {
          const rank = index + 1;
          const isPodium = rank <= 3;

          return (
            <div
              key={nominee.id}
              className={[
                'flex flex-col justify-between rounded-xl border px-3 py-3 text-xs md:text-sm',
                isPodium
                  ? 'border-yellow-400/80 bg-yellow-500/15 shadow-[0_0_18px_rgba(234,179,8,0.45)]'
                  : 'border-yellow-500/30 bg-black/10',
              ].join(' ')}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={[
                      'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold',
                      rank === 1
                        ? 'bg-yellow-400 text-black'
                        : rank === 2
                        ? 'bg-slate-300 text-black'
                        : rank === 3
                        ? 'bg-amber-700 text-amber-50'
                        : 'bg-yellow-500/30 text-yellow-100',
                    ].join(' ')}
                  >
                    {rank}
                  </div>
                  <span className="line-clamp-1 text-[11px] font-semibold text-yellow-50 md:text-xs">
                    {nominee.name}
                  </span>
                </div>
                <Medal className="h-4 w-4 text-yellow-300" />
              </div>

              {nominee.country && (
                <div className="mb-1 flex items-center gap-1.5 text-[10px] text-yellow-100/80 md:text-[11px]">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">{nominee.country}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-yellow-100/80 md:text-[11px]">
                <span className="line-clamp-1">{nominee.category}</span>
                <span className="font-semibold">
                  {nominee.votes?.toLocaleString?.() ?? 0} votos
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mención de ganadores 6–10 */}
      {sixToTen.length > 0 && (
        <div className="rounded-lg border border-yellow-500/20 bg-black/30 px-3 py-2 text-[11px] text-yellow-100/80 md:text-xs">
          <span className="font-semibold">También forman parte de los 10 líderes premiados:</span>{' '}
          {sixToTen
            .map((n, idx) => `${idx + 6}º ${n.name}`)
            .join(' · ')}
          .
        </div>
      )}
    </div>
  );
}

export default function VotePageClient({
  categories,
  edition,
  initialNominees = [],
}: VotePageClientProps) {
  const { toast } = useToast();
  const [topTen, setTopTen] = useState<Nominee[]>([]);

  // Suscripción a top 10 desde Firestore (ordenado por votos desc + limit 10)
  useEffect(() => {
    const nomineesRef = collection(db, 'nominees');
    const q = query(
      nomineesRef,
      where('edition', '==', edition),
      orderBy('votes', 'desc'),
      limit(10),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Nominee[] = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            votes: typeof data.votes === 'number' ? data.votes : 0,
            name: data.name || '',
            organizationName: data.organizationName || '',
            country: data.country || '',
            category: data.category || '',
            ...data,
          } as Nominee;
        });
        setTopTen(list);
      },
      (error) => {
        console.error('Error fetching top 10 nominees:', error);
        toast({
          variant: 'destructive',
          title: 'Error al cargar el ranking',
          description: 'No se pudo actualizar el top 10 en tiempo real.',
        });
      },
    );

    return () => unsubscribe();
  }, [edition, toast]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Mensaje corto de contexto */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs md:text-sm">
        <p className="text-muted-foreground">
          Elige al líder que mejor representa el talento y la visión de América Latina. Tu voto se
          registra en tiempo real y contribuye al reconocimiento internacional de los Latin American
          Leaders Awards.
        </p>
      </div>

      {/* Bloque de Top 5 + mención 6–10 (solo en /vota) */}
      {topTen.length > 0 && <TopRanking topTen={topTen} />}

      {/* Listado de nominados */}
      {/* La lógica de "solo un voto por IP" y "Tu voto" se maneja dentro de NomineeList + backend */}
      <NomineeList
        categories={categories}
        yearLabel={edition}
        edition={edition}
        initialNominees={initialNominees}
        allowVoting={true}
      />
    </div>
  );
}
