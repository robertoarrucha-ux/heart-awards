import type { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import EventInvitation from '@/components/event-invitation';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Star, ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';
import { getAssetUrl } from '@/lib/assets';

export const metadata: Metadata = {
  title: 'Edición 2025 | Latin American Leaders Awards',
  description:
    'Edición 2025 en Viena, Austria. Reconociendo a la diáspora latinoamericana, líderes en América Latina, jóvenes promesas y empresas extranjeras invirtiendo en la región.',
  openGraph: {
    title: 'Edición 2025 | Latin American Leaders Awards',
    description:
      'Vive la edición 2025 en Viena, Austria. Una celebración de la diáspora latinoamericana, los líderes en América Latina y las empresas que apuestan por la región.',
    type: 'website',
    images: [getAssetUrl('Latin-American-Leaders-Awards-Viena 2.webp')],
  },
};

// Ganadores estáticos 2025
const winners2025 = [
  // LÍDERES EN AMÉRICA LATINA
  {
    category: 'Líderes en América Latina',
    name: 'Michael Franco',
    role: 'CEO de Without Borders Corp',
    country: 'Colombia',
  },
  {
    category: 'Líderes en América Latina',
    name: 'Karen Farías Cruzado',
    role: 'Sustainability & ESG Director de Grupo Aeroméxico',
    country: 'México',
  },
  {
    category: 'Líderes en América Latina',
    name: 'Leonardo Penotti',
    role: 'Director de Nexo UCA',
    country: 'Argentina',
  },
  {
    category: 'Líderes en América Latina',
    name: 'Elizabeth Casillas Cruz',
    role: 'Fundadora de Marka la Diferencia',
    country: 'México',
  },
  {
    category: 'Líderes en América Latina',
    name: 'Jonathan Yesid Roa Jaimes',
    role: 'Líder de Investigación y desarrollo I+D en ETO INGENIERIA SAS',
    country: 'Colombia',
  },
  {
    category: 'Líderes en América Latina',
    name: 'Yudith Ortega',
    role: 'CEO de IDINAT LAB INTERNATIONAL GROUP',
    country: 'México',
  },
  {
    category: 'Líderes en América Latina',
    name: 'Eliana Figueroa',
    role: 'Directora de Marketing y publicidad en EF Productora',
    country: 'Argentina',
  },
  {
    category: 'Líderes en América Latina',
    name: 'Thomas Nett',
    role: 'Fundador & Socio Gerente de Biopharma Consulting AG',
    country: 'Suiza / Europa',
  },
  {
    category: 'Líderes en América Latina',
    name: 'Juana Noemí Miranda Valencia',
    role: 'Directora de Recilita',
    country: 'Perú',
  },
  {
    category: 'Líderes en América Latina',
    name: 'Javier Martínez',
    role: 'Director de ConsciencIA',
    country: 'Estados Unidos',
  },
  {
    category: 'Líderes en América Latina',
    name: 'Diego Angulo Jiménez',
    role: 'Director General de Héroes SdeH',
    country: 'México',
  },
  // JÓVENES PROMESAS
  {
    category: 'Jóvenes Promesas (menores de 29 años)',
    name: 'Lucas Marsden-Smedley Rodríguez',
    role:
      "Leader of FTI Consulting's Risk Management, Sustainability and Low-Bono Services in Latin America",
    country: 'Colombia',
  },
  // MENCIONES ESPECIALES
  {
    category: 'Mención especial',
    name: 'Alberto Mercado',
    role:
      'Presidente del Sindicato Independiente del Poder Legislativo del Estado de Jalisco',
    country: 'México',
  },
  {
    category: 'Mención especial',
    name: 'Diana Carolina Kecan Cervantes',
    role:
      'Ministro Consejero de la Embajada y Misión Permanente de Colombia en Viena / Austria',
    country: 'Colombia',
  },
  {
    category: 'Mención especial',
    name: 'Sebastian Palacio Echeverri',
    role:
      'Global Finance Business Partner – Sales, Product and Innovation en AGRANA FRUIT',
    country: 'Colombia',
  },
];

export default function Edition2025Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* Hero 2025 */}
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-black via-background to-background">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)]" />
          <div className="container relative mx-auto flex flex-col gap-10 px-4 pb-20 pt-16 md:flex-row md:items-center md:pt-24">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Star className="h-3 w-3" />
                Edición 2025 · Viena, Austria
              </div>

              <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
                Latin American Leaders Awards 2025
              </h1>

              <p className="text-balance text-base text-muted-foreground md:text-lg">
                Una edición histórica en Viena, Austria, que conecta a la diáspora latinoamericana, a
                los líderes que transforman América Latina desde dentro y a las empresas que apuestan
                por el futuro de la región.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  Diciembre 2025
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  Viena, Austria
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/nominate">
                  <Button size="lg" className="gap-2">
                    Nomina para la edición 2026
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tickets">
                  <Button size="lg" variant="outline" className="border-primary/40 bg-white/5">
                    Adquiere tus tickets 2026
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Foco de la edición 2025
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Star className="mt-0.5 h-4 w-4 text-primary" />
                    <span>
                      <span className="font-semibold text-white">Diáspora Latinoamericana:</span>{' '}
                      líderes que representan a América Latina en Europa y el mundo.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="mt-0.5 h-4 w-4 text-primary" />
                    <span>
                      <span className="font-semibold text-white">Líderes en América Latina:</span>{' '}
                      quienes impulsan transformación desde gobiernos, empresas y sociedad civil.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="mt-0.5 h-4 w-4 text-primary" />
                    <span>
                      <span className="font-semibold text-white">
                        Jóvenes Promesas (menores de 29 años):
                      </span>{' '}
                      nuevas generaciones que marcan el futuro desde hoy.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="mt-0.5 h-4 w-4 text-primary" />
                    <span>
                      <span className="font-semibold text-white">
                        Empresas extranjeras invirtiendo en América Latina:
                      </span>{' '}
                      proyectos que generan empleo, innovación y alianzas de largo plazo.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Resumen de la edición */}
        <section className="border-b border-white/10 bg-background">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="grid gap-10 md:grid-cols-[1.6fr,1fr] md:items-start">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Una edición puente entre Europa y América Latina
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  La edición 2025 en Viena reunió a líderes, emprendedores, diplomáticos, empresas,
                  academia y organizaciones que están redefiniendo el rol de América Latina en el
                  mundo. Fue un espacio para reconocer trayectorias, pero también para activar nuevas
                  alianzas de inversión, impacto social y cooperación internacional.
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  Desde la diáspora latinoamericana en Europa hasta iniciativas transformadoras en
                  territorio latinoamericano, los premios resaltaron historias de liderazgo que
                  combinan innovación, resiliencia y visión global.
                </p>
              </div>

              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  <Users className="h-4 w-4" />
                  Datos clave de la edición 2025
                </div>
                <ul className="space-y-2">
                  <li>
                    • Sede: <span className="font-semibold text-white">Viena, Austria</span>
                  </li>
                  <li>
                    • Fecha: <span className="font-semibold text-white">Diciembre 2025</span>
                  </li>
                  <li>• Enfoque en liderazgo con impacto regional y diálogo global.</li>
                  <li>• Participación de líderes de negocio, sociedad civil y sector público.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Ganadores 2025 */}
        <section className="border-b border-white/10 bg-gradient-to-b from-background to-black">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Ganadores de la edición 2025
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  Reconocimientos otorgados en Viena a líderes, organizaciones y empresas que
                  representan lo mejor de América Latina y su diáspora.
                </p>
              </div>
              <Link href="/archive" className="text-sm text-primary hover:underline">
                Ver archivo completo de ediciones
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {winners2025.map((winner) => (
                <div
                  key={`${winner.category}-${winner.name}`}
                  className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    <Star className="h-3 w-3" />
                    {winner.category}
                  </div>
                  <div className="mb-1 text-sm font-semibold text-white">{winner.name}</div>
                  {winner.country && (
                    <div className="mb-2 text-xs text-primary/80">{winner.country}</div>
                  )}
                  {winner.role && (
                    <p className="text-xs text-muted-foreground">{winner.role}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA hacia la siguiente edición */}
        <section className="bg-background">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="grid gap-8 rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-background to-background px-6 py-10 md:grid-cols-[2fr,1fr] md:px-10">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Sé parte de la próxima edición
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  Si tu organización, proyecto o trayectoria se alinea con la visión de Latin American
                  Leaders Awards, puedes nominarte o nominar a otros líderes para la edición 2026.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/nominate">
                    <Button className="gap-2">
                      Nominar para 2026
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/tickets">
                    <Button variant="outline" className="border-primary/50 bg-black/40">
                      Ver opciones de tickets
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="self-center text-sm text-muted-foreground">
                <p>
                  Las nominaciones y la participación en el evento no solo reconocen historias
                  individuales, sino que activan una comunidad de líderes comprometidos con el futuro
                  de América Latina.
                </p>
              </div>
            </div>
          </div>
        </section>

        <EventInvitation />
      </main>

      <Footer />
    </div>
  );
}
