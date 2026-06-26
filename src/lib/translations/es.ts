
import { TranslationType } from './types';

export const es: TranslationType = {
  nav: {
    venues: "El Evento",
    voting: "Nominados",
    edition2025: "Edición 2025",
    edition2024: "Edición 2024",
    edition2023: "Edición 2023",
    edition2022: "Edición 2022",
    pastEditions: "Ediciones Pasadas",
    tickets: "Entradas",
    vote: "Votar",
    nominate: "Nominar",
    partners: "Aliados",
  },
  hero: {
    title: "El mundo necesita Líderes Heart-Led.",
    subtitle: "Únete en Viena para la primera edición del Heart-Led Summit & Awards — reconociendo a líderes que integran la compasión, el propósito y la excelencia en todos los sectores y geografías.",
    ctaNominate: "Nominar un Líder",
    ctaVote: "Ver Nominados",
  },
  stats: {
    countries: "Países Participantes",
    leaders: "Líderes Nominados",
    impact: "Impacto Global",
  },
  venues_section: {
    title: "Viena, 3–5 de Diciembre de 2026",
    subtitle: "Una ceremonia de premios que cambia la conversación sobre el liderazgo.",
    vienna: {
      title: "Viena, Austria",
      date: "3, 4 y 5 de Diciembre de 2026",
      focus: [
        "Día 1 — Recepción de bienvenida y visita institucional (ONU Viena)",
        "Día 2 — Cumbre: ponencias, paneles, casos de estudio y Ceremonia de Premios",
        "Día 3 — Brunch de networking estratégico y conversaciones de colaboración",
      ],
    },
    madrid: {
      title: "Categorías de Premios",
      date: "Edición Inaugural · Viena 2026",
      focus: [
        "Global Heart-Led Leaders — iniciativas transfronterizas con impacto internacional",
        "Latin Heart-Led Award — impacto social medible en América Latina",
        "Local Heart-Led Leaders (Austria) — cambio significativo dentro de Austria",
      ],
    },
  },
  footer: {
    rights: "Todos los derechos reservados.",
    links: {
      alliances: "Ser Aliado",
      tickets: "Ver Entradas",
    },
  },
  event_invitation: {
    title: "Únete al Heart-Led Summit & Awards Inaugural",
    subtitle: "Viena, 3–5 de Diciembre de 2026 — donde el liderazgo compasivo es reconocido y celebrado.",
    date_label: "Fecha",
    date_value: "3–5 de Diciembre de 2026",
    location_label: "Ubicación",
    location_value: "Viena, Austria",
    cta: "Quiero Asistir",
  },
  about: {
    title: "¿Qué es el Heart-Led Summit & Awards?",
    description: "Una ceremonia de premios que cambia la conversación sobre el liderazgo. Reconocemos a líderes excepcionales que integran la compasión en sus decisiones en todos los sectores y geografías — porque las organizaciones que lideran con corazón no solo hacen el bien, superan a sus pares.",
  },
  who: {
    title: "¿Quiénes califican?",
    vienna_title: "Líderes Internacionales",
    vienna_desc: "Líderes cuyas iniciativas abarcan múltiples países o crean impacto medible en América Latina y más allá — desde la innovación social hasta los negocios responsables.",
    madrid_title: "Líderes en Austria",
    madrid_desc: "Líderes que impulsan un cambio significativo dentro de Austria en todos los sectores — empresas, instituciones públicas, sociedad civil y cultura.",
  },
  impact: {
    title: "El Caso de Negocio para el Corazón",
    subtitle: "Fuentes: Gallup · McKinsey & Company · Harvard Business Review",
    impressions: "de empleados desconectados globalmente",
    attendees: "mayor tasa de retención de empleados",
    countries: "mayor rentabilidad vs pares",
    awarded: "de empleados quieren líderes empáticos",
  },
  ctas: {
    alliances: {
      title: "Alianzas",
      desc: "Da forma al Heart-Led Summit & Awards inaugural como socio fundador.",
      label: "Ser Aliado",
    },
    tickets: {
      title: "Entradas",
      desc: "Asegura tu lugar en el evento de liderazgo del año en Viena.",
      label: "Ver Entradas",
    },
    winners: {
      title: "Nominados",
      desc: "Conoce a los líderes nominados de todo el mundo.",
      label: "Ver Nominados",
    },
  },
  tickets_page: {
    hero: {
      title: "Tu Viaje al Heart-Led Summit & Awards",
      subtitle: "Todo lo que necesitas para preparar tu experiencia en Viena, 3–5 de Diciembre de 2026.",
    },
    steps: {
      title: "Sigue estos 4 pasos para unirte",
      step1: {
        title: "Paso 1: Asegura tu Entrada",
        desc: "Elige la experiencia que mejor se adapte a tus objetivos.",
        options: {
          free: {
            name: "Gratis",
            price: "€0",
            features: [
              "Finalistas nominados, premiados, medios y aliados (HAZ CLIC AQUÍ)",
              "Representantes institucionales e invitados especiales (HAZ CLIC AQUÍ)"
            ],
          },
          general: {
            name: "Agenda General",
            price: "€390",
            stripePriceId: "price_1TMbsx2K14FofuJ5Fgsrqltf",
            features: ["Acceso a los días del evento", "Networking general", "Ceremonia de Premios"],
          },
          vip: {
            name: "Agenda VIP",
            price: "€590",
            stripePriceId: "price_1TMbtp2K14FofuJ5Zai3fxkF",
            features: ["Acceso los 3 días", "Networking exclusivo", "Asientos preferenciales", "Cena de gala"],
          },
          vip_travel: {
            name: "VIP con Viaje",
            price: "€3.500",
            stripePriceId: "price_placeholder_travel",
            features: ["Todo lo de VIP", "Vuelos incluidos", "Hotel incluido", "Recepción en aeropuerto"],
          },
          vip_ally: {
            name: "Aliado VIP",
            price: "€5.900",
            stripePriceId: "price_placeholder_ally",
            features: ["Todo lo de VIP con viaje", "Visibilidad de marca", "Espacio de exhibición", "Reuniones B2B"],
          },
        },
      },
      step2: {
        title: "Paso 2: Vuelos y Visa",
        desc: "Prepara tu llegada con anticipación.",
        tips: [
          "Reserva tus vuelos a Viena (VIE) con al menos 3 meses de antelación.",
          "Verifica si necesitas visa Schengen para ingresar a la Unión Europea.",
          "Contrata un seguro de viaje internacional (obligatorio para la visa Schengen)."
        ],
      },
      step3: {
        title: "Paso 3: Logística y Preparación",
        desc: "Una vez confirmada tu entrada, recibirás nuestra guía logística completa con recomendaciones de hoteles y transporte local.",
        hotels: [],
      },
      step4: {
        title: "Paso 4: ¡Bienvenido a la Experiencia!",
        desc: "Tres días de liderazgo, conexión y reconocimiento en Viena. Agenda completa por confirmar antes del evento.",
        agenda_highlights: [
          "Recepción de Bienvenida",
          "Keynote: El Futuro del Liderazgo Compasivo",
          "Ceremonia de Premios",
          "Brunch de Networking Estratégico"
        ],
        agenda_highlights_madrid: [
          "Recepción de Bienvenida",
          "Cumbre de Liderazgo",
          "Ceremonia de Premios",
          "Networking Estratégico"
        ],
        full_agenda_vienna: [
          {
            day: "Día 1 — Bienvenida (Vestimenta Casual)",
            events: [
              "17:00 – Recepción privada para nominados, ponentes y aliados",
              "18:00 – Experiencia de networking curado",
              "19:00 – Visita institucional (ONU Viena o Agencia de Negocios de Viena)",
              "20:30 – Diálogo informal sobre desafíos globales y liderazgo"
            ]
          },
          {
            day: "Día 2 — Cumbre & Premios (Vestimenta Formal)",
            events: [
              "10:00 – Keynote inaugural: El Futuro del Liderazgo Compasivo",
              "11:30 – Paneles de expertos y casos de estudio de líderes finalistas",
              "14:00 – Discusiones interactivas intersectoriales",
              "18:00 – Ceremonia de Premios: reconocimiento en las tres categorías",
              "19:30 – Recepción de networking de alto nivel"
            ]
          },
          {
            day: "Día 3 — Networking Estratégico (Smart Casual)",
            events: [
              "10:00 – Brunch íntimo de networking",
              "11:00 – Conversaciones facilitadas para colaboración y alianzas",
              "13:00 – Reflexión: traduciendo la inspiración en iniciativas concretas",
              "14:00 – Despedida y cierre"
            ]
          }
        ],
        full_agenda_madrid: [
          {
            day: "Día 1",
            events: []
          }
        ],
      },
    },
    contact: {
      title: "¿Necesitas ayuda personalizada?",
      whatsapp: "Contáctanos por WhatsApp",
    },
    vienna_label: "Edición Viena",
    madrid_label: "Edición Viena",
    buy_now: "Comprar Ahora",
  },
  media_section: {
    title: "Medios y Aliados",
    subtitle: "Organizaciones y medios que apoyan la edición inaugural del Heart-Led Summit & Awards en Viena.",
  },
};
