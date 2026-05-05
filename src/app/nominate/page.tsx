
import { Metadata } from 'next';
import NominationForm from '@/components/nomination-form';
import Link from 'next/link';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventInvitation from '@/components/event-invitation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { viennaCategories2026, madridCategories2026 } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import Footer from '@/components/footer';

import { getAssetUrl } from '@/lib/assets';

export const metadata: Metadata = {
  title: 'Nominaciones 2026 | Latin American Leaders Awards',
  description: 'Postula a un líder o postúlate tú mismo para los Latin American Leaders Awards 2026 en Viena y Madrid. Reconocemos el impacto que transforma América Latina.',
  openGraph: {
    title: 'Nominaciones 2026 | Latin American Leaders Awards',
    description: 'Postula a un líder o postúlate tú mismo para los Latin American Leaders Awards 2026 en Viena y Madrid. Reconocemos el impacto que transforma América Latina.',
    type: 'website',
    images: [getAssetUrl('Latin-American-Leaders-Awards-Viena 2.webp')],
  }
};

export default function NominatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold mb-4 shadow-sm animate-pulse">
               <Calendar className="w-4 h-4" />
               Fecha Límite para Nominarse y Recibir Votos: 1 día antes del evento
             </div>
             <h1 className="text-4xl font-bold text-center text-primary mb-2">Nominaciones Abiertas 2026</h1>
             <p className="text-lg text-muted-foreground">Viena y Madrid: dos sedes para celebrar el liderazgo global de impacto.</p>
          </div>
          
          <Card className="bg-card/50 border-primary/10">
            <CardHeader>
                <CardTitle className="text-2xl text-primary">Preguntas Frecuentes (FAQ)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <Accordion type="single" collapsible className="w-full">
                  
                  {/* Grupo 1: Sobre el evento */}
                  <AccordionItem value="faq-1-1">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Qué son los Latin American Leaders Awards?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p>Año con año desde el 2017, reconocemos a líderes del sector público y privado, que por su trayectoria, innovación, integridad e impacto, están contribuyendo al Desarrollo Económico y Sostenible de América Latina, así como a la diáspora Latinoamericana en el exterior.</p>
                        <p>La celebración se lleva a cabo de forma presencial desde Europa: Madrid, España y Viena, Austria, los días 19, 20 y 21 de Noviembre, y 4, 5 y 6 de Diciembre, respectivamente. Una experiencia de primer nivel llena de charlas, reuniones bilaterales, sinergias, alianzas y conexión , donde se dan cita más de 300 líderes, de Europa, de América Latina, y la comunidad Latinoamericana en Europa, entre ellos gobiernos, representantes de organizaciones internacionales, empresas y emprendedores.</p>
                        <p>Los premios son convocados y organizados por decenas de empresas y organizaciones cuya misión compartida es fortalecer, conectar y reconocer a líderes emergentes:</p>
                        <p className="font-medium text-foreground">Pro-Latam, The New Global School, la Academia Regional de Naciones Unidas en Viena, Impact Hub, la Ciudad de Viena, Cámaras Empresariales de Europa y más de 10 empresas y organizaciones aliadas.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-1-2">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Por qué ahora existen dos sedes?</AccordionTrigger>
                    <AccordionContent>
                      <p>En 2026, el evento se expande a Viena y Madrid para especializar el reconocimiento. Viena se centrará en el liderazgo social y la innovación pública, mientras que Madrid se enfocará en negocios, inversión y desarrollo económico, ofreciendo experiencias más relevantes para cada perfil.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-1-3">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Cuál es la diferencia entre Viena y Madrid?</AccordionTrigger>
                    <AccordionContent>
                      <p><span className="font-bold text-foreground">Viena</span> está dedicada al liderazgo con impacto social, causas, innovación pública y nuevas generaciones del sector social. <span className="font-bold text-foreground">Madrid</span> se enfoca en el liderazgo empresarial, emprendimiento, inversión, desarrollo económico y la diáspora latinoamericana.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-1-4">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Puedo participar en ambas sedes?</AccordionTrigger>
                    <AccordionContent>
                      <p>Sí. Aunque cada sede tiene un enfoque distinto, puedes ser nominado, asistir y proponer alianzas en ambas si tu perfil o tus objetivos se alinean con los dos ecosistemas. Ofreceremos paquetes y accesos para quienes deseen una experiencia completa.</p>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Grupo 2: Nominaciones y categorías */}
                  <AccordionItem value="faq-2-0">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Tiene algún costo el proceso de nominación?</AccordionTrigger>
                    <AccordionContent>
                      <p>No, el proceso de nominación es completamente gratuito. Además, todos los nominados oficiales reciben una invitación de cortesía para asistir a la gran ceremonia de premiación. Para aquellos interesados en vivir la experiencia completa de 3 días —que incluye sesiones de networking de alto nivel, paneles de expertos y eventos culturales exclusivos— será necesario adquirir una entrada al evento.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2-1">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Quiénes pueden ser nominados?</AccordionTrigger>
                    <AccordionContent>
                      <p>Buscamos líderes innovadores: personas, organizaciones, empresas y políticas públicas que contribuyan a la mejora de la calidad de vida y al desarrollo económico sostenible. Esto incluye latinoamericanos en el extranjero o extranjeros con impacto en la región.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2-2">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Cómo sé en qué sede encaja mi nominación?</AccordionTrigger>
                    <AccordionContent>
                      <p>Revisa las categorías. Si tu liderazgo está centrado en el impacto social, políticas públicas o causas, Viena es tu sede. Si está enfocado en negocios, inversión, emprendimiento o la diáspora, Madrid es la indicada. El formulario de nominación te ayudará a elegir.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2-3">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Cuáles son las categorías de Viena?</AccordionTrigger>
                    <AccordionContent>
                       <ul className="space-y-2 list-none">
                         {viennaCategories2026.map(cat => <li key={cat}><Badge variant="secondary">{cat}</Badge></li>)}
                       </ul>
                    </AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="faq-2-4">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Cuáles son las categorías de Madrid?</AccordionTrigger>
                    <AccordionContent>
                       <ul className="space-y-2 list-none">
                         {madridCategories2026.map(cat => <li key={cat}><Badge variant="secondary">{cat}</Badge></li>)}
                       </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2-5">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Cuál es el criterio de selección?</AccordionTrigger>
                    <AccordionContent>
                       <p className="mb-4">Buscamos líderes con:</p>
                      <ul className="space-y-2 list-inside">
                          <li><span className="font-bold text-foreground">1. Liderazgo:</span> Capacidad para inspirar y movilizar.</li>
                          <li><span className="font-bold text-foreground">2. Trayectoria:</span> Registro comprobable de su trabajo e impacto.</li>
                          <li><span className="font-bold text-foreground">3. Innovación:</span> Soluciones eficaces y creativas.</li>
                          <li><span className="font-bold text-foreground">4. Integridad:</span> Reputación y credenciales alineadas a los valores del evento.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2-6">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Cómo se lleva a cabo la selección?</AccordionTrigger>
                    <AccordionContent>
                       <p>La selección se realiza a través de tres comités de votación: uno de votación abierta al público, y dos de votación cerrada compuestos por líderes empresariales, institucionales, aliados y patrocinadores.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2-7">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Qué reciben los premiados?</AccordionTrigger>
                    <AccordionContent>
                       <p>Los premiados reciben un certificado que acredita su título, un trofeo, posible premio monetario o en especie (sujeto a fondos), y una membresía vitalicia a la Red Pro-Latam. Los nominados también obtienen beneficios como acceso gratuito a la ceremonia de premiación.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                   {/* Grupo 3: Entradas, agenda y experiencia */}
                  <AccordionItem value="faq-3-1">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Cuáles son las fechas?</AccordionTrigger>
                    <AccordionContent>
                      <p>Las fechas para Viena y Madrid en diciembre de 2026 serán anunciadas próximamente. Suscríbete a nuestro boletín para recibir las novedades.</p>
                    </AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="faq-3-2">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Cómo será la agenda en cada sede?</AccordionTrigger>
                    <AccordionContent>
                      <p>Cada sede tendrá su propia agenda de 2 a 3 días, con ceremonias de premiación, sesiones de networking, conversaciones estratégicas y experiencias culturales. Los detalles se publicarán más cerca de la fecha.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3-3">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Cómo obtengo entradas?</AccordionTrigger>
                    <AccordionContent>
                      <p>Las entradas estarán disponibles en nuestra página web. Habrá diferentes tipos de acceso (general, VIP, paquetes por sede). Los nominados reciben acceso gratuito a la ceremonia de premiación.</p>
                    </AccordionContent>
                  </AccordionItem>

                   {/* Grupo 4: Participación y alianzas */}
                   <AccordionItem value="faq-4-1">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">¿Cómo puedo ser aliado del evento?</AccordionTrigger>
                    <AccordionContent>
                      <p>Invitamos a empresas, instituciones y organizaciones a unirse como aliados. Ofrecemos diferentes niveles de colaboración y visibilidad en una o ambas sedes. Contacta a nuestro equipo a través del formulario de alianzas en la página principal.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardContent>
          </Card>
          
          <NominationForm />

        </div>
      </main>
      <EventInvitation />
      <Footer />
    </div>
  );
}
