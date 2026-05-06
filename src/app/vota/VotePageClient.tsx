'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  Vote,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Instagram,
  Youtube,
  Twitter,
  Medal,
  BarChart3,
  MapPin,
} from 'lucide-react';
import NomineeList from '@/components/nominee-list';
import type { Nominee } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

// Props de la página de votación
type VotePageClientProps = {
  categories: string[];
  edition: string;
  initialNominees?: Nominee[];
};

// Stepper de 3 pasos
type VotingStepsProps = {
  currentStep: 1 | 2 | 3;
};

const steps = [
  {
    id: 1,
    label: 'Conéctate con la comunidad',
    description: 'Únete a nuestros canales oficiales antes de emitir tu voto.',
    icon: Users,
  },
  {
    id: 2,
    label: 'Elige tu líder',
    description: 'Explora las nominaciones y selecciona a tu favorito.',
    icon: Vote,
  },
  {
    id: 3,
    label: 'Confirma tu voto',
    description: 'Tu voto único queda registrado para esta edición.',
    icon: Sparkles,
  },
];

function VotingSteps({ currentStep }: VotingStepsProps) {
  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur md:px-6 md:py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-1 items-center gap-3">
              <div
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold',
                  isCompleted
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                    : isActive
                    ? 'border-primary bg-primary/20 text-primary-foreground'
                    : 'border-white/20 bg-black/30 text-white/60',
                ].join(' ')}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <div className="space-y-0.5">
                <p
                  className={[
                    'text-xs font-semibold md:text-sm',
                    isActive ? 'text-white' : 'text-white/70',
                  ].join(' ')}
                >
                  {step.id}. {step.label}
                </p>
                <p className="text-[11px] text-muted-foreground md:text-xs">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

  // Estado del gate de redes
  const [clickedWhatsApp, setClickedWhatsApp] = useState(false);
  const [clickedX, setClickedX] = useState(false);
  const [clickedInstagram, setClickedInstagram] = useState(false);
  const [clickedYouTube, setClickedYouTube] = useState(false);

  // Estado de voto (sincronizado con NomineeList vía localStorage)
  const [hasVotedThisSession, setHasVotedThisSession] = useState(false);

  // Top 10 en tiempo real
  const [topTen, setTopTen] = useState<Nominee[]>([]);

  // On mount, leer si ya votó (para paso 3)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const alreadyVoted = window.localStorage.getItem('latamAwards_voted_2026') === 'true';
    if (alreadyVoted) {
      setHasVotedThisSession(true);
    }
  }, []);

  // Suscripción a top 10 desde Firestore (ordenado por votos desc + limit 10) [web:125][web:128]
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

  const allSocialClicked =
    clickedWhatsApp && clickedX && clickedInstagram && clickedYouTube;

  const currentStep: 1 | 2 | 3 = useMemo(() => {
    if (hasVotedThisSession) return 3;
    if (allSocialClicked) return 2;
    return 1;
  }, [hasVotedThisSession, allSocialClicked]);

  // Guardar progreso del gate de redes en localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      'latamAwards_social_gate_2026',
      JSON.stringify({
        wa: clickedWhatsApp,
        x: clickedX,
        ig: clickedInstagram,
        yt: clickedYouTube,
      }),
    );
  }, [clickedWhatsApp, clickedX, clickedInstagram, clickedYouTube]);

  // Recuperar progreso del gate de redes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('latamAwards_social_gate_2026');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          wa?: boolean;
          x?: boolean;
          ig?: boolean;
          yt?: boolean;
        };
        setClickedWhatsApp(!!parsed.wa);
        setClickedX(!!parsed.x);
        setClickedInstagram(!!parsed.ig);
        setClickedYouTube(!!parsed.yt);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const handleSocialClick = (type: 'wa' | 'x' | 'ig' | 'yt', url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    if (type === 'wa') setClickedWhatsApp(true);
    if (type === 'x') setClickedX(true);
    if (type === 'ig') setClickedInstagram(true);
    if (type === 'yt') setClickedYouTube(true);

    toast({
      title: 'Gracias por unirte',
      description: 'Tu apoyo a la comunidad Latin American Leaders suma al impacto regional.',
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stepper de progreso */}
      <VotingSteps currentStep={currentStep} />

      {/* Mensaje contextual según el paso */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs md:text-sm">
        {currentStep === 1 && (
          <p className="text-muted-foreground">
            Da clic en los canales oficiales para conectarte con la comunidad de líderes
            latinoamericanos. Una vez que hayas visitado los cuatro, podrás emitir tu voto único
            para esta edición.
          </p>
        )}
        {currentStep === 2 && (
          <p className="text-muted-foreground">
            Elige al líder que mejor representa el talento y la visión de América Latina. Tu voto se
            reflejará en el ranking en tiempo real.
          </p>
        )}
        {currentStep === 3 && (
          <p className="text-muted-foreground">
            Tu voto ya fue registrado para la edición 2026. Puedes seguir explorando nominados y
            compartir el enlace de esta página para invitar a más personas a votar.
          </p>
        )}
      </div>

      {/* Bloque de Top 5 + mención 6–10 (solo en /vota) */}
      {topTen.length > 0 && <TopRanking topTen={topTen} />}

      {/* Gate de redes sociales */}
      <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              Paso 1 · Conéctate con la comunidad
            </p>
            <p className="text-xs text-primary/80 md:text-sm">
              Da clic en cada uno de nuestros canales oficiales. Esto nos ayuda a amplificar el
              reconocimiento a los líderes latinoamericanos.
            </p>
          </div>
          <div className="hidden text-xs text-primary/70 md:block">
            {allSocialClicked ? 'Requisito completado' : 'Requisito pendiente'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
          <button
            type="button"
            onClick={() =>
              handleSocialClick(
                'wa',
                'https://chat.whatsapp.com/tu-grupo', // TODO: reemplaza por tu URL real
              )
            }
            className={[
              'flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 sm:px-3 sm:py-3 text-center text-[11px] sm:text-xs font-semibold transition',
              clickedWhatsApp
                ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100'
                : 'border-white/15 bg-black/20 text-white/80 hover:border-primary/50 hover:bg-primary/10',
            ].join(' ')}
          >
            <MessageCircle className="h-5 w-5 text-emerald-300" />
            <span>WhatsApp</span>
            {clickedWhatsApp && (
              <span className="text-[10px] text-emerald-200">Visita registrada</span>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              handleSocialClick(
                'x',
                'https://x.com/tu-cuenta', // TODO: reemplaza por tu URL real
              )
            }
            className={[
              'flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 sm:px-3 sm:py-3 text-center text-[11px] sm:text-xs font-semibold transition',
              clickedX
                ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100'
                : 'border-white/15 bg-black/20 text-white/80 hover:border-primary/50 hover:bg-primary/10',
            ].join(' ')}
          >
            <Twitter className="h-5 w-5 text-sky-300" />
            <span>X (Twitter)</span>
            {clickedX && (
              <span className="text-[10px] text-emerald-200">Visita registrada</span>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              handleSocialClick(
                'ig',
                'https://instagram.com/tu-cuenta', // TODO: reemplaza por tu URL real
              )
            }
            className={[
              'flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 sm:px-3 sm:py-3 text-center text-[11px] sm:text-xs font-semibold transition',
              clickedInstagram
                ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100'
                : 'border-white/15 bg-black/20 text-white/80 hover:border-primary/50 hover:bg-primary/10',
            ].join(' ')}
          >
            <Instagram className="h-5 w-5 text-pink-300" />
            <span>Instagram</span>
            {clickedInstagram && (
              <span className="text-[10px] text-emerald-200">Visita registrada</span>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              handleSocialClick(
                'yt',
                'https://youtube.com/@tu-canal', // TODO: reemplaza por tu URL real
              )
            }
            className={[
              'flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 sm:px-3 sm:py-3 text-center text-[11px] sm:text-xs font-semibold transition',
              clickedYouTube
                ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100'
                : 'border-white/15 bg-black/20 text-white/80 hover:border-primary/50 hover:bg-primary/10',
            ].join(' ')}
          >
            <Youtube className="h-5 w-5 text-red-400" />
            <span>YouTube</span>
            {clickedYouTube && (
              <span className="text-[10px] text-emerald-200">Visita registrada</span>
            )}
          </button>
        </div>

        <p className="text-[11px] text-primary/70 md:text-xs">
          No verificamos si sigues las cuentas, solo registramos que visitaste los canales
          oficiales. Tu voto se limita a 1 por IP para preservar la integridad del proceso.
        </p>
      </div>

      {/* Listado de nominados con votación habilitada cuando el gate se cumple */}
      <NomineeList
        categories={categories}
        yearLabel={edition}
        edition={edition}
        initialNominees={initialNominees}
        allowVoting={allSocialClicked && !hasVotedThisSession}
      />
    </div>
  );
}
