'use client';

import { CheckCircle2, Users, Vote, Sparkles } from 'lucide-react';

type VotingStepsProps = {
  currentStep: 1 | 2 | 3;
};

const steps = [
  {
    id: 1,
    label: 'Conéctate con la comunidad',
    description: 'Únete a nuestros canales oficiales antes de votar.',
    icon: Users,
  },
  {
    id: 2,
    label: 'Elige tu líder',
    description: 'Explora nominados y selecciona a tu favorito.',
    icon: Vote,
  },
  {
    id: 3,
    label: 'Confirma tu voto',
    description: 'Registra tu voto único para esta edición.',
    icon: Sparkles,
  },
];

export function VotingSteps({ currentStep }: VotingStepsProps) {
  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:px-6 md:py-4 backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div
              key={step.id}
              className="flex flex-1 items-center gap-3"
            >
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
                    'text-xs md:text-sm font-semibold',
                    isActive ? 'text-white' : 'text-white/70',
                  ].join(' ')}
                >
                  {step.id}. {step.label}
                </p>
                <p className="text-[11px] md:text-xs text-muted-foreground">
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
