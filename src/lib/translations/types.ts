
export type TranslationType = {
  nav: {
    venues: string;
    voting: string;
    edition2025: string;
    edition2024: string;
    edition2023: string;
    edition2022: string;
    pastEditions: string;
    tickets: string;
    vote: string;
    nominate: string;
    partners: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaNominate: string;
    ctaVote: string;
  };
  stats: {
    countries: string;
    leaders: string;
    impact: string;
  };
  venues_section: {
    title: string;
    subtitle: string;
    vienna: {
      title: string;
      date: string;
      focus: string[];
    };
    madrid: {
      title: string;
      date: string;
      focus: string[];
    };
  };
  footer: {
    rights: string;
    links: {
      alliances: string;
      tickets: string;
    };
  };
  event_invitation: {
    title: string;
    subtitle: string;
    date_label: string;
    date_value: string;
    location_label: string;
    location_value: string;
    cta: string;
  };
  about: {
    title: string;
    description: string;
  };
  who: {
    title: string;
    vienna_title: string;
    vienna_desc: string;
    madrid_title: string;
    madrid_desc: string;
  };
  impact: {
    title: string;
    subtitle: string;
    impressions: string;
    attendees: string;
    countries: string;
    awarded: string;
  };
  ctas: {
    alliances: { title: string, desc: string, label: string };
    tickets: { title: string, desc: string, label: string };
    winners: { title: string, desc: string, label: string };
  };
  tickets_page: {
    hero: {
      title: string;
      subtitle: string;
    };
    steps: {
      title: string;
      step1: {
        title: string;
        desc: string;
        options: {
          general: { name: string, price: string, stripePriceId?: string, features: string[] };
          vip: { name: string, price: string, stripePriceId?: string, features: string[] };
          vip_travel: { name: string, price: string, stripePriceId?: string, features: string[] };
          vip_ally: { name: string, price: string, stripePriceId?: string, features: string[] };
          free: { name: string, price: string, stripePriceId?: string, features: string[] };
        };
      };
      step2: {
        title: string;
        desc: string;
        tips: string[];
      };
      step3: {
        title: string;
        desc: string;
        hotels: { name: string, desc: string }[];
      };
      step4: {
        title: string;
        desc: string;
        agenda_highlights: string[];
        agenda_highlights_madrid: string[];
        full_agenda_vienna: { day: string, events: string[] }[];
        full_agenda_madrid: { day: string, events: string[] }[];
      };
    };
    contact: {
      title: string;
      whatsapp: string;
    };
    vienna_label: string;
    madrid_label: string;
    buy_now: string;
  };
  media_section: {
    title: string;
    subtitle: string;
  };
};
