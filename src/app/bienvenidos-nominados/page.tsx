
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
  Heart
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/assets';
import { 
  timelineSteps, 
  stats, 
  achievements, 
  faqs, 
  agenda 
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
                Este acceso es <span className="text-white font-bold underline">exclusivamente para el día de la premiación</span>. Incluye la participación en el anuncio de ganadores y el networking de cierre.
              </p>
            </div>
            
            <div className="glass p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10">
                 <h4 className="text-xl font-bold mb-8 text-center">Solicitar Registro de Acceso Libro</h4>
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
                <h3 className="text-2xl font-bold mb-4">Agenda VIP & Networking</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Vive la experiencia completa de 3 días en Viena o Madrid. Acceso a ONU Viena, cenas exclusivas, reuniones con inversionistas, charlas estilo TED y la gala de premiación con trato preferencial.
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-8">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-bold">Cupón Exclusivo para Nominados:</p>
                  <div className="text-2xl font-black text-primary tracking-widest">FINALISTAS</div>
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
                      <p className="text-xs text-gray-400 mt-1">Acceso a sedes de organismos internacionales y agencias de negocios locales.</p>
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
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
              El evento de alianzas, negocios y reconocimiento más importante en Europa para líderes trabajando en el desarrollo sostenible de América Latina.
            </p>
            
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
                    <Image src={getAssetUrl("logo the new global school.webp")} alt="The New Global School" fill className="object-contain" />
                  </div>
                  <div className="h-12 w-32 relative">
                    <Image src={getAssetUrl("Vienna School Logo Dark.webp")} alt="Vienna School" fill className="object-contain" />
                  </div>
                  <div className="h-12 w-32 relative">
                    <Image src={getAssetUrl("pro-latam logo transparent.png")} alt="Pro-Latam" fill className="object-contain" />
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
              <div className="h-16 w-40 relative grayscale hover:grayscale-0 transition-all"><Image src={getAssetUrl("logo the new global school.webp")} alt="The New Global School" fill className="object-contain" /></div>
              <div className="h-16 w-40 relative grayscale hover:grayscale-0 transition-all"><Image src={getAssetUrl("Vienna School Logo Dark.webp")} alt="Vienna School" fill className="object-contain" /></div>
              <div className="h-16 w-40 relative grayscale hover:grayscale-0 transition-all"><Image src={getAssetUrl("pro-latam logo transparent.png")} alt="Pro-Latam" fill className="object-contain" /></div>
              <div className="h-16 w-40 relative grayscale hover:grayscale-0 transition-all"><Image src={getAssetUrl("Logos Global School Institute copy.png")} alt="The New Global Institute" fill className="object-contain" /></div>
            </div>

            <h3 className="text-2xl font-outfit font-bold mb-4">Aliados que forman y han formado parte</h3>
            <p className="text-gray-400 mb-8">Más de 14 organizaciones respaldan esta iniciativa.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center grayscale opacity-50 hover:grayscale-0 transition-all duration-500 max-w-5xl mx-auto">
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("Bank-Ki-Moon-Logo_525_1 Logo.png")} alt="Ban Ki Moon" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("Civic-Tech-Center-Logo.jpg")} alt="Civi Center" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("RAUN logo.png")} alt="RAUN" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("Punto Latino logo.png")} alt="Punto Latino" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("Eurolat Logo.jpg")} alt="EuroLat" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("ISCAN logo.jpg")} alt="ISCAN" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("LAI Logo.webp")} alt="LAI" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("Logo SDGs.png")} alt="SDGs" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("LOGO-BOOSTERIIT-OFICIAL.webp")} alt="Boosterit" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("Logo-CAGG.webp")} alt="CAAG" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("logo-emprende-austria-e1666889487679.png")} alt="Emprende Austria" fill className="object-contain" /></div>
            <div className="h-12 w-28 relative"><Image src={getAssetUrl("Logo-Red-Global-MXSolo-1024x273.webp")} alt="Red Global MX" fill className="object-contain" /></div>
          </div>
        </div>
      </section>

      {/* What are the awards Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-8">¿Qué son los Latin American Leaders Awards?</h2>
              <div className="space-y-6 text-gray-400 leading-relaxed">
                <p>Año con año desde el 2017, reconocemos a líderes del sector público y privado, que por su trayectoria, innovación, integridad e impacto, están contribuyendo al Desarrollo Económico y Sostenible de América Latina, así como a la diáspora Latinoamericana en el exterior.</p>
                <p>La celebración se lleva a cabo de forma presencial desde Europa: Madrid, España y Viena, Austria, los días 19, 20 y 21 de Noviembre, y 4, 5 y 6 de Diciembre, respectivamente. Una experiencia de primer nivel llena de charlas, reuniones bilaterales, sinergias, alianzas y conexión , donde se dan cita más de 300 líderes, de Europa, de América Latina, y la comunidad Latinoamericana en Europa, entre ellos gobiernos, representantes de organizaciones internacionales, empresas y emprendedores.</p>
                <p>Los premios son convocados y organizados por decenas de empresas y organizaciones cuya misión compartida es fortalecer, conectar y reconocer a líderes emergentes:</p>
                <p className="font-medium text-white">Pro-Latam, The New Global School, la Academia Regional de Naciones Unidas en Viena, Impact Hub, la Ciudad de Viena, Cámaras Empresariales de Europa y más de 10 empresas y organizaciones aliadas.</p>
                <p>Desde 2017, reconocemos a los líderes bajo los siguientes criterios:</p>
                <ul className="space-y-4">
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0" /> <strong>Liderazgo:</strong> Capacidad para inspirar y movilizar.</li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0" /> <strong>Trayectoria:</strong> Registro comprobable de su trabajo e impacto.</li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0" /> <strong>Innovación:</strong> Soluciones eficaces y creativas.</li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0" /> <strong>Integridad:</strong> Reputación y credenciales alineadas a los valores.</li>
                </ul>
              </div>
            </div>
            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
                  <div className="text-3xl font-bold text-yellow-500">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4">Línea del Tiempo</h2>
            <p className="text-gray-400">Tu camino hacia el reconocimiento internacional.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timelineSteps.map((step, index) => (
              <div 
                key={index}
                className="flex gap-6 mb-12 relative"
              >
                {index !== timelineSteps.length - 1 && (
                  <div className="absolute left-8 top-16 bottom-[-48px] w-px bg-gradient-to-b from-yellow-500/50 to-transparent hidden md:block"></div>
                )}
                
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center z-10 ${
                  step.status === 'completed' ? 'bg-yellow-500 text-black' : 
                  step.status === 'current' ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-500' :
                  'bg-gray-800 text-gray-500'
                }`}>
                  {step.icon}
                </div>
                
                <div className="flex-grow pt-2">
                  <span className="text-yellow-500 text-sm font-mono font-bold uppercase tracking-widest">{step.date}</span>
                  <h3 className="text-2xl font-outfit font-bold mt-1 mb-2">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4">¿Qué vas a lograr?</h2>
            <p className="text-gray-400">Más que un premio, una plataforma de crecimiento.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {achievements.map((item, i) => (
              <div 
                key={i}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-colors"
                id={`achievement-${i}`}
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4">Agenda del Evento</h2>
            <p className="text-gray-400">Tres días de alto impacto en Viena (Agenda en Desarrollo - Se confirmará antes del evento).</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {agenda.map((day, i) => (
              <div key={i} className="p-8 rounded-3xl bg-gradient-to-b from-gray-900 to-black border border-white/5">
                <h3 className="text-xl font-bold mb-6 text-yellow-500">{day.day}</h3>
                <ul className="space-y-4">
                  {day.events.map((event, j) => (
                    <li key={j} className="flex gap-3 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                      {event}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center mt-12 text-yellow-500 font-medium">
            * Nominados finalistas y acompañantes tienen acceso GRATUITO al Día 3.
          </p>
        </div>
      </section>

      {/* Video Presentation Section */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto p-12 rounded-[3rem] bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/20">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-shrink-0 w-24 h-24 rounded-3xl bg-yellow-500 flex items-center justify-center text-black">
                <Video className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl font-outfit font-bold mb-4">Promoción de tu nominación</h2>
                <p className="text-gray-400 mb-6">
                  Aunque NO es un requisito, te invitamos a grabar un video (2 a 6 minutos) abordando tu trayectoria y lecciones de liderazgo. Nosotros lo editaremos para promocionarte como finalista.
                </p>
                <ul className="space-y-3 mb-8 text-sm text-gray-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-500" /> Formato Horizontal 16:9 (1080p)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-500" /> Envío vía WeTransfer a hello@theglobal.school</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-yellow-500" /> Fecha límite: 30 de Noviembre</li>
                </ul>
                <Link href="/bienvenidos-nominados/guia-video" className="inline-flex items-center gap-2 font-bold text-yellow-500">
                  Ver guía de estructura <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Votaciones Section */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-12 text-center">Sistema de Votaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="text-yellow-500 font-bold mb-4">7.1 Comité Comunidad</div>
                <p className="text-sm text-gray-400">Votación abierta en la plataforma oficial para elegir a los favoritos del público.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="text-yellow-500 font-bold mb-4">7.2 Comité Asistentes al evento</div>
                <p className="text-sm text-gray-400">Comité <strong>Cerrado</strong>. Voto de los asistentes presenciales a la Agenda General y VIP.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="text-yellow-500 font-bold mb-4">7.3 Comité Organizadores y Patrocinadores</div>
                <p className="text-sm text-gray-400">Comité <strong>Cerrado</strong>. Voto preferencial de Empresas Aliadas, Patrocinadores y Organizadores.</p>
              </div>
            </div>
            <p className="text-center mt-8 text-gray-500 text-sm italic">
              * El comité de selección que elige a los Nominados Finalistas está conformado por el equipo Organizador y Aliados.
            </p>
          </div>
        </div>
      </section>

      {/* Important Info Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-12 text-center">Información Importante</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4 p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                  <Ticket className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-2">Entrada Gratis</h4>
                    <p className="text-sm text-gray-400">Todos los nominados tienen una entrada <strong>GRATIS</strong> a la ceremonia de anuncio y premiación (último día del evento).</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/10">
                  <Zap className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-2">Descuento VIP</h4>
                    <p className="text-sm text-gray-400">Si quieres participar en todas las actividades (3 días), usa el cupón <strong>FINALISTAS</strong> para un 50% de descuento.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <Award className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-2">Reconocimiento</h4>
                    <p className="text-sm text-gray-400">Los premiados recibirán un Certificado físico y digital que acredita su título como: <strong>Latin American Leaders Awardee</strong>.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <Globe className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-2">Premio Monetario</h4>
                    <p className="text-sm text-gray-400">Sujeto a la disponibilidad de fondos, se notificará posterior al evento sobre premios monetarios o en especie.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation in Vienna Section */}
      <section className="py-24 bg-[#0f0f0f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-8 text-center">¿Puedo Presentar en Viena?</h2>
            <p className="text-center text-gray-400 mb-12">Todos los nominados tienen un espacio para presentar durante la tarde del día 2 o el día 3.</p>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-yellow-500" /> Estructura de tu charla (Máx. 10 mins)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ul className="space-y-4 text-gray-400">
                  <li className="flex gap-3"><span className="text-yellow-500 font-bold">2 min:</span> Quién eres tú y sobre tu empresa/org.</li>
                  <li className="flex gap-3"><span className="text-yellow-500 font-bold">2 min:</span> ¿Cuáles han sido los retos más difíciles?</li>
                </ul>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex gap-3"><span className="text-yellow-500 font-bold">3 min:</span> Principales lecciones de liderazgo y estrategia.</li>
                  <li className="flex gap-3"><span className="text-yellow-500 font-bold">2 min:</span> Mensaje final y Cierre.</li>
                </ul>
              </div>
              
              <div className="mt-12 p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-yellow-500" /> Recomendaciones para diapositivas
                </h4>
                <p className="text-sm text-gray-400">
                  <strong>EVITA texto</strong>. Si lo usas, limítate a máximo 15 palabras por diapositiva. Envía tu material antes del 01 de Diciembre a <a href="mailto:awards@pro-latam.org" className="text-yellow-500 underline">awards@pro-latam.org</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confirm Participation Section */}
      <section id="confirmar-participacion" className="py-24 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-outfit font-black mb-4 uppercase tracking-tighter">Confirma tu <span className="text-primary italic">Participación</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Elige la modalidad que mejor se adapte a tu experiencia en Viena o Madrid.
              </p>
            </div>

            <ParticipationTabs />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-12 text-center">Preguntas Frecuentes</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-24 bg-yellow-500 text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-outfit font-black mb-8">¿Aún tienes dudas?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-80">
            Únete a nuestro grupo de WhatsApp para recibir instrucciones en tiempo real y conectar con otros nominados.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="https://chat.whatsapp.com/JY1ulDE92qGI0aNbUiyqFn"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-black text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-3"
            >
              <MessageCircle className="w-6 h-6" /> Unirse al Grupo de WhatsApp
            </a>
            <a 
              href="https://wa.me/4367761735010"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-105 transition-transform border-2 border-black/10"
            >
              Consultar Soporte Individual
            </a>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-outfit font-bold mb-8">¡Mucho éxito y estamos felices de conocerte!</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/vota" className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Ir a Votaciones
            </Link>
            <Link href="/tickets" className="px-8 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all">
              Ver Entradas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

