'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, Vote, Sparkles, CheckCircle2, MessageCircle, Instagram, Youtube, Twitter } from 'lucide-react';
import NomineeList from '@/components/nominee-list';
import type { Nominee } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

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

  // On mount, leer si ya votó (para mostrar paso 3 desde el inicio si aplica)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const alreadyVoted = window.localStorage.getItem('latamAwards_voted_2026') === 'true';
    if (alreadyVoted) {
      setHasVotedThisSession(true);
    }
  }, []);

  const allSocialClicked =
    clickedWhatsApp && clickedX && clickedInstagram && clickedYouTube;

  const currentStep: 1 | 2 | 3 = useMemo(() => {
    if (hasVotedThisSession) return 3;
    if (allSocialClicked) return 2;
    return 1;
  }, [hasVotedThisSession, allSocialClicked]);

  // Guardar progreso del gate de redes en localStorage para persistencia suave
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
    <div className="space-y-8">
      {/* Stepper de progreso */}
      <VotingSteps currentStep={currentStep} />

      {/* Mensaje contextual según el paso */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs md:text-sm">
        {currentStep === 1 && (
          <p className="text-muted-foreground">
            Da clic en los canales oficiales para conectarte con la comunidad de líderes latinoamericanos.
            Una vez que hayas visitado los cuatro, podrás emitir tu voto único para esta edición.
          </p>
        )}
        {currentStep === 2 && (
          <p className="text-muted-foreground">
            Elige al líder que mejor representa el talento y la visión de América Latina.
            Tu voto se reflejará en el ranking en tiempo real.
          </p>
        )}
        {currentStep === 3 && (
          <p className="text-muted-foreground">
            Tu voto ya fue registrado para la edición 2026. Puedes seguir explorando nominados y compartir
            el enlace de esta página para invitar a más personas a votar.
          </p>
        )}
      </div>

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

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <button
            type="button"
            onClick={() =>
              handleSocialClick(
                'wa',
                'https://chat.whatsapp.com/tu-grupo', // reemplaza por tu URL real
              )
            }
            className={[
              'flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-center text-xs font-semibold transition',
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
                'https://x.com/tu-cuenta', // reemplaza por tu URL real
              )
            }
            className={[
              'flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-center text-xs font-semibold transition',
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
                'https://instagram.com/tu-cuenta', // reemplaza por tu URL real
              )
            }
            className={[
              'flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-center text-xs font-semibold transition',
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
                'https://youtube.com/@tu-canal', // reemplaza por tu URL real
              )
            }
            className={[
              'flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-center text-xs font-semibold transition',
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
          No verificamos si sigues las cuentas, solo registramos que visitaste los canales oficiales.
          Tu voto se limita a 1 por IP para preservar la integridad del proceso.
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
