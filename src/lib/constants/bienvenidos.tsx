import React from 'react';
import { 
  CheckCircle2, 
  FileText, 
  Users, 
  Trophy, 
  Lightbulb, 
  Zap, 
  Globe, 
  Info, 
  Star, 
  Heart 
} from 'lucide-react';

export const timelineSteps = [
  {
    title: "1. Envía tu nominación",
    date: "Fase Inicial",
    description: "Envío del formulario con evidencia de impacto y logros.",
    icon: <FileText className="w-6 h-6" />,
    status: "completed"
  },
  {
    title: "2. Publicación como nominado finalista",
    date: "75 Horas después",
    description: "Tras la revisión técnica, tu perfil se publica oficialmente en la web.",
    icon: <CheckCircle2 className="w-6 h-6" />,
    status: "current"
  },
  {
    title: "3. Votaciones y Nominación Extra",
    date: "Cierre: 1 día antes del evento",
    description: "Periodo de votación pública. Fecha límite para recibir votos y nominaciones: 1 día antes del evento.",
    icon: <Users className="w-6 h-6" />,
    status: "upcoming"
  },
  {
    title: "4. Ceremonia Anuncio y Premiación",
    date: "Madrid (Nov) · Viena (Dic) 2026",
    description: "Gala oficial de entrega de galardones y networking internacional. Cada sede celebra sus categorías específicas.",
    icon: <Trophy className="w-6 h-6" />,
    status: "upcoming"
  }
];

export const stats = [
  { label: "Charlas", value: "30" },
  { label: "Reuniones de Alianzas", value: "2" },
  { label: "Países Representados", value: "12" },
  { label: "Líderes de Gobierno y Empresa", value: "200-300" },
  { label: "Asistentes en Línea", value: "10,000" },
  { label: "Alcance en Redes y Prensa", value: "18M" }
];

export const achievements = [
  { title: "INSPIRACIÓN", desc: "Ideas poderosas e innovadoras de todo América Latina.", icon: <Lightbulb className="w-6 h-6" /> },
  { title: "ALIANZAS", desc: "Oportunidades de colaboración y negocios Europa-América Latina.", icon: <Zap className="w-6 h-6" /> },
  { title: "ACCESO", desc: "A las economías más poderosas de Europa: DACH y el ecosistema ibérico.", icon: <Globe className="w-6 h-6" /> },
  { title: "CONOCIMIENTO", desc: "De primera mano sobre negocios y políticas exitosas.", icon: <Info className="w-6 h-6" /> },
  { title: "IMPULSO", desc: "Posicionamiento positivo de tu marca personal.", icon: <Star className="w-6 h-6" /> },
  { title: "AMISTADES", desc: "De tu nivel y para toda la vida.", icon: <Heart className="w-6 h-6" /> }
];

export const faqs = [
  {
    q: "¿Cuáles son las fechas y sedes del evento?",
    a: "Hay dos ediciones en 2026: Madrid (19, 20 y 21 de Noviembre) para proyectos Empresariales, y Viena (3, 4 y 5 de Diciembre) para proyectos Sociales. Puedes asistir a ambas, pero tu sede principal depende de tu categoría."
  },
  {
    q: "¿Cuál es mi sede principal según mi categoría?",
    a: "Si tu nominación es en una categoría de proyectos Empresariales, tu sede principal es Madrid. Si es en una categoría de proyectos Sociales, tu sede es Viena. En tu sede principal podrás presentar tu proyecto y ser premiado. Los nominados pueden asistir a ambos eventos si lo desean."
  },
  {
    q: "¿Cómo eligen a los nominados?",
    a: "Invitamos a nuestra comunidad (seguidores, alumnos, ex alumnos, aliados) a nominar. De aproximadamente 600 nominaciones, nuestro comité elige a los finalistas. También se permite la auto-nominación."
  },
  {
    q: "¿Cuáles son los criterios de selección?",
    a: "1. Liderazgo (inspirar y movilizar). 2. Trayectoria (registro comprobable). 3. Innovación (soluciones creativas). 4. Integridad (reputación alineada a valores)."
  },
  {
    q: "¿Cómo se financian los premios?",
    a: "The Global School es una organización independiente, autofinanciada y no gubernamental. No alineada a ninguna agenda política. Los ingresos provienen de miembros, eventos, patrocinadores y estudiantes."
  },
  {
    q: "¿Qué reciben los premiados?",
    a: "1. Certificado físico y digital como 'Latin American Leaders Awardee'. 2. Premio monetario y/o en especie (monto final confirmado posterior al evento según fondos)."
  },
  {
    q: "¿Los nominados pagan sus viajes y entradas?",
    a: "Sí, cada nominado cubre sus viajes y estancia. Ofrecemos ayudas de hasta 50% en costo de hoteles (solicitar vía WhatsApp). La ceremonia de premiación es GRATIS para nominados en ambas sedes, pero la agenda VIP de 3 días tiene costo con 50% de descuento. El cupón FINALISTAS aplica para Madrid y Viena."
  },
  {
    q: "¿Qué pasa si no puedo viajar?",
    a: "Puedes participar como nominado finalista y, si eres premiado, recibirás tu reconocimiento y premio monetario de forma remota."
  },
  {
    q: "¿Cómo se confirma la veracidad de los votos?",
    a: "Cada voto se analiza cuidadosamente. Se pide confirmación vía correo oficial o mensaje directo para autenticar la identidad. Votos no autenticados son desechados."
  },
  {
    q: "¿Tienes que pagar algo para ser nominado o premiado?",
    a: "Absolutamente NO. Los premios NO se venden."
  }
];

export const agendaViena = [
  {
    day: "Día 1 - Vestimenta Casual",
    events: [
      "17:00 – Punto de encuentro",
      "17:10 – Brindis especial de Bienvenida",
      "17:30 – Recepción y networking con la Agencia de Negocios de Viena",
      "20:00 – Recorrido por mercados navideños y sesión de fotos"
    ]
  },
  {
    day: "Día 2 - Vestimenta Formal",
    events: [
      "12:00 – Recepción en sede central de Naciones Unidas Viena (ONU)",
      "13:00 – Recorrido y charlas en inglés",
      "16:00 – Traslado a Impact Hub Vienna",
      "17:00 – Charlas de 10 minutos (Estilo TEDx)",
      "19:00 – Networking con 1MillionStartups e inversionistas",
      "22:00 – Noche de Fiesta"
    ]
  },
  {
    day: "Día 3 - Vestimenta Formal",
    events: [
      "15:30 – Registro y Bienvenida en Impact Hub Vienna",
      "16:10 – Más de 10 Charlas de 10 minutos (Estilo TEDx)",
      "18:30 – Ceremonia de Premiación (Acceso gratuito para nominados)",
      "19:00 – Cocktail & Fiesta de Cierre"
    ]
  }
];

export const agendaMadrid = [
  {
    day: "Día 1 - Vestimenta Casual",
    events: [
      "17:00 – Punto de encuentro",
      "17:10 – Brindis especial de Bienvenida",
      "17:30 – Recepción y networking con Cámaras Empresariales",
      "20:00 – Recorrido por la ciudad y sesión de fotos"
    ]
  },
  {
    day: "Día 2 - Vestimenta Formal",
    events: [
      "12:00 – Recepción en Institución Aliada Madrid",
      "13:00 – Recorrido y charlas",
      "16:00 – Traslado a Impact Hub Madrid",
      "17:00 – Charlas de 10 minutos (Estilo TEDx)",
      "19:00 – Networking con inversionistas y aliados",
      "22:00 – Noche de Fiesta"
    ]
  },
  {
    day: "Día 3 - Vestimenta Formal",
    events: [
      "15:30 – Registro y Bienvenida en Impact Hub Madrid",
      "16:10 – Más de 10 Charlas de 10 minutos (Estilo TEDx)",
      "18:30 – Ceremonia de Premiación (Acceso gratuito para nominados)",
      "19:00 – Cocktail & Fiesta de Cierre"
    ]
  }
];

// Keep legacy export for backwards compatibility
export const agenda = agendaViena;
