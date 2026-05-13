'use client';

// No heavy animations to save build memory
import React, { useState } from 'react';
import { FreeRegistrationForm } from '@/components/free-registration-form';
import { 
  CheckCircle2, 
  Calendar, 
  Users, 
  Trophy, 
  ArrowRight, 
  MessageCircle, 
  FileText, 
  Share2, 
  Ticket,
  Info,
  Globe,
  Award,
  ChevronDown,
  ChevronUp,
  Video,
  Star,
  ShieldCheck,
  Lightbulb,
  Zap,
  Heart,
  MapPin,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/assets';
import { 
  timelineSteps, 
  stats, 
  achievements, 
  faqs, 
  agendaViena,
  agendaMadrid
} from '@/lib/constants/bienvenidos';

function FAQItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-yellow-500 transition-colors"
      >
        <span className="text-lg font-medium">{q}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
          <div className="overflow-hidden">
            <p className="pb-6 text-gray-400 leading-relaxed">{a}</p>
          </div>
      )}
    </div>
  );
}

function AgendaTabs() {
  const [activeCity, setActiveCity] = useState<'madrid' | 'viena'>('madrid');
  const agenda = activeCity === 'madrid' ? agendaMadrid : agendaViena;
  const cityInfo = {
    madrid: { label: '🇪🇸 Madrid', date: '19, 20 y 21 de Noviembre 2026', category: 'Proyectos Empresariales', color: 'from-orange-500/20 to-transparent', border: 'border-orange-500/30', accent: 'text-orange-400' },
    viena:  { label: '🇦🇹 Viena',  date: '3, 4 y 5 de Diciembre 2026',    category: 'Proyectos Sociales',      color: 'from-primary/20 to-transparent',  border: 'border-primary/30',  accent: 'text-primary' },
  };
  const info = cityInfo[activeCity];

  return (
    <div className="space-y-8">
      <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 max-w-md mx-auto">
        <button
          onClick={() => setActiveCity('madrid')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeCity === 'madrid' ? 'bg-orange-500 text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          🇪🇸 Madrid
        </button>
        <button
          onClick={() => setActiveCity('viena')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeCity === 'viena' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          🇦🇹 Viena
        </button>
      </div>

      <div className={`inline-flex items-center gap-3 w-full justify-center p-4 rounded-2xl bg-gradient-to-r ${info.color} border ${info.border}`}>
        <MapPin className={`w-4 h-4 ${info.accent}`} />
        <div className="text-sm">
          <span className="font-bold text-white">{info.label}</span>
          <span className="text-gray-400 mx-2">&middot;</span>
          <span className="text-gray-300">{info.date}</span>
          <span className="text-gray-400 mx-2">&middot;</span>
          <span className={`font-medium ${info.accent}`}>{info.category}</span>
        </div>
      </div>

      <div className="space-y-6">
        {agenda.map((day, i) => (
          <div key={i} className="glass p-6 md:p-8 rounded-3xl border border-white/10">
            <h4 className="font-bold text-lg mb-4 text-yellow-500">{day.day}</h4>
            <ul className="space-y-3">
              {day.events.map((event, j) => (
                <li key={j} className="flex items-start gap-3 text-gray-300 text-sm">
                  <span className="text-primary mt-0.5">›</span>
                  <span>{event}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-500">
        Los nominados pueden asistir a ambas sedes. La sede principal donde podrás presentar tu proyecto y ser premiado depende de tu categoría.
      </p>
    </div>
  );
}

function ParticipationTabs() {
  const [activeTab, setActiveTab] = useState<'free' | 'full'>('full');

  return (
    <div className="space-y-8">
      <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('free')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'free' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          Acceso Gratuito (Día 3)
        </button>
        <button
          onClick={() => setActiveTab('full')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'full' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          Acceso Completo (1-3)
        </button>
      </div>

      <div>
        {activeTab === 'free' ? (
          <div className="space-y-8">
            <div className="bg-primary/10 border border-primary/20 p-8 rounded-3xl text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-4">
                <Info className="w-3 h-3" /> IMPORTANTE
              </div>
              <h3 className="text-2xl font-bold mb-2">Ceremonia de Premiación (Día 3)</h3>
              <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
                Este acceso es <span className="text-white font-bold underline">exclusivamente para el día de la premiación</span> en cada sede. Incluye la participación en el anuncio de ganadores y el networking de cierre. Aplica para <strong className="text-white">Madrid</strong> (Proyectos Empresariales) y <strong className="text-white">Viena</strong> (Proyectos Sociales).
              </p>
            </div>
            
            <div className="glass p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10">
                 <h4 className="text-xl font-bold mb-2 text-center">Solicitar Registro de Acceso Libre</h4>
                 <p className="text-center text-sm text-gray-400 mb-8">Indica la sede a la que deseas asistir. Puedes seleccionar una o ambas.</p>
                 <FreeRegistrationForm />
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-primary text-black font-black px-4 py-1 rounded-full text-xs animate-bounce">
                  50% DESC
                </div>
                <h3 className="text-2xl font-bold mb-2">Agenda VIP & Networking</h3>
                <p className="text-xs text-gray-400 mb-4 font-medium">Aplica para Madrid y Viena</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Vive la experiencia completa de 3 días. Acceso a instituciones internacionales, cenas exclusivas, reuniones con inversionistas, charlas estilo TED y la gala de premiación con trato preferencial.
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-8">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-bold">Cupón Exclusivo para Nominados:</p>
                  <div className="text-2xl font-black text-primary tracking-widest">FINALISTAS</div>
                  <p className="text-xs text-gray-500 mt-1">Válido para ambas sedes</p>
                </div>
                <Link 
                  href="/tickets" 
                  className="inline-flex items-center justify-center w-full py-4 bg-primary text-black font-black rounded-xl hover:scale-[1.02] transition-transform"
                >
                  ADQUIRIR ACCESO COMPLETO <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 h-full">
                  <div className="flex gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">Networking de Alto Nivel</h4>
                      <p className="text-xs text-gray-400 mt-1">Conecta con el ecosistema de inversión europeo y líderes de 4 continentes.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">Visitas Institucionales</h4>
                      <p className="text-xs text-gray-400 mt-1">Acceso a sedes de organismos internacionales y agencias de negocios en Madrid y Viena.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">Visibilidad Premium</h4>
                      <p className="text-xs text-gray-400 mt-1">Tu perfil destacado en los materiales oficiales del evento y prensa internacional.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BienvenidosNominadosPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-yellow-500/30">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm" style={{ backgroundImage: `url(${getAssetUrl('Latin-American-Leaders-Awards-1.webp')})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium mb-6">
              ¡Felicidades! Eres nominado finalista
            </span>
            <h1 className="text-5xl md:text-8xl font-outfit font-bold mb-6 tracking-tight leading-tight">
              Bienvenidos <span className="text-yellow-500 italic">Nominados</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-6">
              El evento de alianzas, negocios y reconocimiento más importante en Europa para líderes trabajando en el desarrollo sostenible de América Latina.
            </p>

            {/* Dual city badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <MapPin className="w-4 h-4" />
                <div className="text-left">
                  <p className="font-bold text-sm">🇪🇸 Madrid · 19-21 Nov 2026</p>
                  <p className="text-xs opacity-70">Proyectos Empresariales</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <MapPin className="w-4 h-4" />
                <div className="text-left">
                  <p className="font-bold text-sm">🇦🇹 Viena · 3-5 Dic 2026</p>
                  <p className="text-xs opacity-70">Proyectos Sociales</p>
                </div>
              </div>
            </div>
            
            <div 
              className="inline-block px-8 py-4 rounded-2xl bg-red-600/10 border border-red-600/20 text-red-500 font-black text-xl md:text-2xl uppercase tracking-tighter"
            >
              LOS PREMIOS NO SE VENDEN
              <span className="block text-sm font-medium normal-case tracking-normal mt-1 opacity-80">
                Nominarse y participar es 100% GRATIS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto mb-24">
            <div>
              <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-8">¿Quiénes somos?</h2>
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>Desde 2010, diseñamos programas ejecutivos y educativos para Líderes de Gobierno y Empresa. Nuestras oficinas están en Viena, Austria, con representaciones y aliados en más de 10 países de 4 continentes.</p>
                <p>Reconocida como la ONG <strong>"Más admirable"</strong> por la ONU en Viena, trabajamos bajo los objetivos de desarrollo sostenible de las Naciones Unidas.</p>
                <div className="flex flex-wrap gap-8 mt-8 grayscale opacity-70">
                  <div className="h-12 w-32 relative">
                    <Image src={getAssetUrl("public/Logos/Global School Logo Black.webp")} alt="The Global School" fill className="object-contain" />
                  </div>
                  <div className="h-12 w-32 relative">
                    <Image src={getAssetUrl("public/Logos/Vienna School logo black.webp")} alt="Vienna School" fill className="object-contain" />
                  </div>
                  <div className="h-12 w-32 relative">
                    <Image src={getAssetUrl("public/Logos/pro-latam logo full.webp")} alt="Pro-Latam" fill className="object-contain" />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <Image 
                src={getAssetUrl("Latin-American-Leaders-Awards-Viena.webp")} 
                alt="Latin American Leaders Awards Viena" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-2xl font-outfit font-bold mb-4">Organizadores</h3>
            <div className="flex flex-wrap justify-center gap-12 items-center mb-16">
              <div className="h-16 w-40 relative grayscale hover:grayscale-0 transition-all"><Image src={getAssetUrl("public/Logos/Global School Logo Black.webp")} alt="The Global School" fill className="object-contain" /></div>
              <div className="h-16 w-40 relative grayscale hover:grayscale-0 transition-all"><Image src={getAssetUrl("public/Logos/Vienna School logo black.webp")} alt="Vienna School" fill className="object-contain" /></div>
              <div className="h-16 w-40 relative grayscale hover:grayscale-0 transition-all"><Image src={getAssetUrl("public/Logos/pro-latam logo full.webp")} alt="Pro-Latam" fill className="object-contain" /></div>
              <div className="h-16 w-40 relative grayscale hover:grayscale-0 transition-all"><Image src={getAssetUrl("public/Logos/Global Institute Logo Black.webp")} alt="The Global Institute" fill className="object-contain" /></div>
            </div>

            <h3 className="text-2xl font-outfit font-bold mb-4">Aliados que forman y han formado parte</h3>
            <p className="text-gray-400 mb-8">Más de 14 organizaciones respaldan esta iniciativa.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center grayscale opacity-50 hover:grayscale-0 transition-all duration-500 max-w-5xl mx-auto">
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Tigres.webp")} alt="Ban Ki Moon" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Civic-Tech-Center-Logo.webp")} alt="Civi Center" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/RAUN logo.webp")} alt="RAUN" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Punto Latino logo.webp")} alt="Punto Latino" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Eurolat Logo.webp")} alt="EuroLat" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/ISCAN-logo.webp")} alt="ISCAN" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Viena City.webp")} alt="LAI" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Gobierno-de-Yucatan.webp")} alt="SDGs" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/LOGO-BOOSTERIIT-OFICIAL.webp")} alt="Boosterit" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Logo-CAGG.webp")} alt="CAAG" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/logo-emprende-austria-e1666889487679.webp")} alt="Emprende Austria" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Logo-Red-Global-MXSolo-1024x273.webp")} alt="Red Global MX" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Tequila-Inteligente.webp")} alt="Tequila Inteligente" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/logo the new global school.webp")} alt="The New Global School" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Diario-Sustentable.webp")} alt="Diario Sustentable" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/gente-motivando-gente.webp")} alt="Gente Motivando Gente" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Marketing-Insider-Review.webp")} alt="Marketing Insider Review" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Vienna School Logo Dark.webp")} alt="Vienna School Dark" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Amigos-Del-Viento.webp")} alt="Amigos Del Viento" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Sambito.webp")} alt="Sambito" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Anahuac-Mexico.webp")} alt="Anahuac Mexico" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Excelsior.webp")} alt="Excelsior" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Radio-Formula.webp")} alt="Radio Formula" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/Opera-Latinoamericana.webp")} alt="Opera Latinoamericana" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/pro-latam logo transparent.webp")} alt="Pro Latam" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("public/Logos/La-Razon.webp")} alt="La Razon" fill className="object-contain" /></div>
          </div>
        </div>
      </section>

      {/* What are the awards Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-outfit font-bold mb-6">¿Qué son los <span className="text-yellow-500">Latin American Leaders Awards</span>?</h2>
              <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Desde 2017, reconocemos a los líderes más destacados de América Latina en Europa. En 2026 celebramos <strong className="text-white">dos ediciones</strong>: Madrid para proyectos Empresariales y Viena para proyectos Sociales.
              </p>
            </div>

            {/* Two city cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
                <div className="text-3xl mb-3">🇪🇸</div>
                <h3 className="text-xl font-bold mb-2">Edición Madrid</h3>
                <p className="text-orange-400 font-medium text-sm mb-3">19, 20 y 21 de Noviembre 2026</p>
                <p className="text-gray-400 text-sm leading-relaxed">Sede principal para categorías de <strong className="text-white">proyectos Empresariales</strong>. Presenta tu proyecto en Impact Hub Madrid ante inversionistas y aliados europeos.</p>
              </div>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <div className="text-3xl mb-3">🇦🇹</div>
                <h3 className="text-xl font-bold mb-2">Edición Viena</h3>
                <p className="text-primary font-medium text-sm mb-3">3, 4 y 5 de Diciembre 2026</p>
                <p className="text-gray-400 text-sm leading-relaxed">Sede principal para categorías de <strong className="text-white">proyectos Sociales</strong>. Presenta en Impact Hub Vienna con acceso a la ONU y el ecosistema DACH.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center mb-16">
              <p className="text-sm text-gray-400">
                <ShieldCheck className="w-4 h-4 inline-block mr-2 text-primary" />
                Los nominados pueden asistir a <strong className="text-white">ambas sedes</strong>. Sin embargo, solo podrán presentar su proyecto y ser premiados en la sede que corresponda a su categoría.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
              {stats.map((s, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-2xl font-black text-yellow-500">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-16 text-center">Tu camino como nominado</h2>
            <div className="space-y-8">
              {timelineSteps.map((step, i) => (
                <div key={i} className={`flex gap-6 p-6 rounded-2xl border transition-all ${
                  step.status === 'completed' ? 'bg-green-500/5 border-green-500/20' :
                  step.status === 'current' ? 'bg-primary/10 border-primary/30' :
                  'bg-white/5 border-white/10'
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    step.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                    step.status === 'current' ? 'bg-primary/20 text-primary' :
                    'bg-white/10 text-gray-400'
                  }`}>{step.icon}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h4 className="font-bold">{step.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        step.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                        step.status === 'current' ? 'bg-primary/10 text-primary' :
                        'bg-white/5 text-gray-500'
                      }`}>{step.date}</span>
                    </div>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4 text-center">¿Qué vas a lograr?</h2>
            <p className="text-center text-gray-400 mb-16">Al ser parte de esta comunidad de líderes en Europa</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((a, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">{a.icon}</div>
                  <h4 className="font-black text-sm tracking-widest mb-2">{a.title}</h4>
                  <p className="text-sm text-gray-400">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Agenda Section */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4 text-center">Agenda del Evento</h2>
            <p className="text-center text-gray-400 mb-12">Selecciona la sede para ver su programa completo</p>
            <AgendaTabs />
          </div>
        </div>
      </section>

      {/* Video / Presentation Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-bold mb-6">
                <Video className="w-4 h-4" /> OPCIONAL
              </div>
              <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-6">Promoción de tu Nominación</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Para aumentar tu visibilidad y votos, te recomendamos grabar un video corto presentando tu proyecto. Aplica para ambas sedes.
              </p>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/10">
              <Link 
                href="/bienvenidos-nominados/guia-video"
                className="inline-flex items-center gap-2 text-primary hover:underline font-bold"
              >
                Ver guía completa para tu video de nominación <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation Section */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-6">¿Puedo Presentar en el Evento?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Sí. Todos los nominados tienen la oportunidad de presentar su proyecto en su sede principal en un formato de charla de <strong className="text-white">10 minutos al estilo TEDx</strong>. La estructura y dinámica es la misma en Madrid y en Viena.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-3xl font-black text-primary mb-2">1-2 min</p>
                <p className="text-sm text-gray-400">Presentación personal y del proyecto</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-3xl font-black text-primary mb-2">5-7 min</p>
                <p className="text-sm text-gray-400">Problema, solución e impacto</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-3xl font-black text-primary mb-2">1-2 min</p>
                <p className="text-sm text-gray-400">Call to action y cierre</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Participation Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-6">¿Cómo participar?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Elige el nivel de participación que mejor se adapte a tus posibilidades.
              </p>
            </div>
            <ParticipationTabs />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-16 text-center">Preguntas frecuentes</h2>
            <div className="space-y-0">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-outfit font-bold mb-6">
            ¿Listo para <span className="text-yellow-500">brillar</span> en Europa?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Tu nominación ya está activa. Comparte tu historia, conecta con otros líderes y prepárate para el evento más importante del año.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/nominados"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-black font-black rounded-xl hover:scale-[1.02] transition-transform"
            >
              Ver todos los nominados <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/tickets"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors"
            >
              <Ticket className="w-4 h-4" /> Adquirir acceso completo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
