
import { TranslationType } from './types';

export const en: TranslationType = {
  nav: {
    venues: "Venues",
    voting: "Voting",
    edition2025: "2025 Edition",
    edition2024: "2024 Edition",
    edition2023: "2023 Edition",
    edition2022: "2022 Edition",
    pastEditions: "Past Editions",
    tickets: "Tickets",
    vote: "Vote",
    nominate: "Nominate",
    partners: "Partners",
  },
  hero: {
    title: "The Most Important European Recognition for Latin American Leaders",
    subtitle: "The Latin American Leaders Awards celebrate the excellence, innovation, economic and social development of the most influential leaders in our region.",
    ctaNominate: "Nominate Now",
    ctaVote: "View Nominees",
  },
  stats: {
    countries: "Participating Countries",
    leaders: "Nominated Leaders",
    impact: "Regional Impact",
  },
  venues_section: {
    title: "Official Venues 2026",
    subtitle: "Two global cities, one purpose: celebrating Latin American leadership.",
    vienna: {
      title: "Vienna, Austria",
      date: "December 3, 4 & 5",
      focus: [
        "Social leaders and activists",
        "Foundations and NGOs",
        "Public institutions",
        "Social innovation and sustainability"
      ],
    },
    madrid: {
      title: "Madrid, Spain",
      date: "November 19, 20 & 21",
      focus: [
        "Business owners and entrepreneurs",
        "Investors and VCs",
        "Global corporations",
        "Business alliances and trade"
      ],
    },
  },
  footer: {
    rights: "All rights reserved.",
    links: {
      alliances: "Request Alliances",
      tickets: "Check Tickets",
    },
  },
  event_invitation: {
    title: "Join the Event of the Year",
    subtitle: "Since 2017, the Most Important European Recognition for Latin American Leaders.",
    date_label: "Date",
    date_value: "November & December 2026",
    location_label: "Location",
    location_value: "Vienna & Madrid",
    cta: "I Want to Attend",
  },
  about: {
    title: "What are the Latin American Leaders Awards?",
    description: "Since 2017, the Latin American Leaders Awards have been the most important international platform in Europe for alliances, business, and recognition for Latin American Leaders.",
  },
  who: {
    title: "Who participates?",
    vienna_title: "Vienna",
    vienna_desc: "Social leaders, public institutions, and social innovators.",
    madrid_title: "Madrid",
    madrid_desc: "Business owners, entrepreneurs, and global investors.",
  },
  impact: {
    title: "Global Impact",
    subtitle: "The Largest Hispanic-American Celebration in Central Europe",
    impressions: "Millions of Impressions",
    attendees: "Attendees",
    countries: "Countries",
    awarded: "Awarded",
  },
  ctas: {
    alliances: {
      title: "Alliances",
      desc: "Amplify your brand and connect with key leaders.",
      label: "Request Alliance",
    },
    tickets: {
      title: "Tickets",
      desc: "Secure your spot in Vienna, Madrid, or both.",
      label: "Check Tickets",
    },
    winners: {
      title: "Winners",
      desc: "Explore the profiles of the 2025 leaders.",
      label: "See Winners",
    },
  },
  tickets_page: {
    hero: {
      title: "Your Journey to the Latin American Leaders Awards",
      subtitle: "Everything you need to prepare for your experience in Vienna and Madrid.",
    },
    steps: {
      title: "Follow these 4 steps for your welcome",
      step1: {
        title: "Step 1: Secure Your Ticket",
        desc: "Choose the experience that best fits your goals.",
        options: {
          free: {
            name: "Free",
            price: "€0",
            features: [
              "European Companies and Investors (REGISTER, CLICK HERE)",
              "Awardees, Finalists, Media, Allies and Professional Network (CLICK HERE)"
            ],
          },
          general: {
            name: "General Agenda",
            price: "€390",
            stripePriceId: "price_1TMbsx2K14FofuJ5Fgsrqltf",
            features: ["Access Event Days", "General Networking", "Awards Ceremony"],
          },
          vip: {
            name: "VIP Agenda",
            price: "€590",
            stripePriceId: "price_1TMbtp2K14FofuJ5Zai3fxkF",
            features: ["Access All Days", "Exclusive Networking", "Preferential Seating", "Gala Dinner"],
          },
          vip_travel: {
            name: "VIP Agenda with Travel",
            price: "€3,500",
            stripePriceId: "price_placeholder_travel",
            features: ["Everything in VIP Agenda", "Flights Included", "Hotel Included", "Airport Reception"],
          },
          vip_ally: {
            name: "VIP Ally",
            price: "€5,900",
            stripePriceId: "price_placeholder_ally",
            features: ["Everything in VIP Agenda with travel", "Brand Mention", "Exhibition Space", "B2B Meetings"],
          },
        },
      },
      step2: {
        title: "Step 2: Flights and Visas",
        desc: "Prepare your arrival in advance.",
        tips: [
            "Book your flights to Vienna (VIE) or Madrid (MAD) at least 3 months in advance.",
            "Check if you need a Schengen visa to enter the European Union.",
            "Get international travel insurance (mandatory for the visa)."
        ],
      },
      step3: {
        title: "Step 3: Logistics and Preparation",
        desc: "Once your ticket is secured, you will receive our complete logistics guide.",
        hotels: [],
      },
      step4: {
        title: "Step 4: Welcome to the Experience!",
        desc: "Agendas in Development (to be confirmed before the event). Get ready to connect with the most influential leaders.",
        agenda_highlights: [
            "Welcome Cocktail",
            "Innovation and Business Panels",
            "Gala Night and Awards",
            "Cultural Networking Tours"
        ],
        agenda_highlights_madrid: [
            "Welcome Cocktail",
            "Activities at Impact Hub Madrid",
            "Visits to Business Chambers",
            "Gala Night and Awards"
        ],
        full_agenda_vienna: [
          {
            day: "Day 1 - Casual Attire",
            events: [
              "17:00 – Meeting point",
              "17:10 – Special Welcome Toast",
              "17:30 – Reception and networking with the Vienna Business Agency",
              "20:00 – Tour of Christmas markets and photo session"
            ]
          },
          {
            day: "Day 2 - Formal Attire",
            events: [
              "12:00 – Reception at UN Vienna Headquarters (UN)",
              "13:00 – Tour and talks in English",
              "16:00 – Transfer to Impact Hub Vienna",
              "17:00 – 10-minute talks (TEDx Style)",
              "19:00 – Networking with 1MillionStartups and investors",
              "22:00 – Party Night"
            ]
          },
          {
            day: "Day 3 - Formal Attire",
            events: [
              "15:30 – Registration and Welcome at Impact Hub Vienna",
              "16:10 – More than 10 10-minute talks (TEDx Style)",
              "18:30 – Awards Ceremony (Free access for nominees)",
              "19:00 – Cocktail & Closing Party"
            ]
          }
        ],
        full_agenda_madrid: [
          {
            day: "Day 1 - Casual Attire",
            events: [
              "17:00 – Meeting point",
              "17:10 – Special Welcome Toast",
              "17:30 – Reception and networking with Business Chambers",
              "20:00 – City tour and photo session"
            ]
          },
          {
            day: "Day 2 - Formal Attire",
            events: [
              "12:00 – Reception at Madrid Allied Institution",
              "13:00 – Tour and talks",
              "16:00 – Transfer to Impact Hub Madrid",
              "17:00 – 10-minute talks (TEDx Style)",
              "19:00 – Networking with investors and allies",
              "22:00 – Party Night"
            ]
          },
          {
            day: "Day 3 - Formal Attire",
            events: [
              "15:30 – Registration and Welcome at Impact Hub Madrid",
              "16:10 – More than 10 10-minute talks (TEDx Style)",
              "18:30 – Awards Ceremony (Free access for nominees)",
              "19:00 – Cocktail & Closing Party"
            ]
          }
        ],
      },
    },
    contact: {
      title: "Need personalized help?",
      whatsapp: "Contact us on WhatsApp",
    },
    vienna_label: "Vienna Edition",
    madrid_label: "Madrid Edition",
    buy_now: "Buy Now",
  },
  media_section: {
    title: "Media Presence & Partnerships",
    subtitle: "Organizations and media outlets that have highlighted the impact of the Latin American Leaders Awards in Vienna.",
  },
};
