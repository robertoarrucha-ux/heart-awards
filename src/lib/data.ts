
export type Nominee = {
  id: string;
  name: string;
  nomineeType: 'persona' | 'entidad';
  bio: string;
  leadershipLesson: string;
  votes: number;
  imageUrl: string;
  category: string;
  country: string;
  websiteUrl: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  positionAndProject: string;
  organizationName: string;
  youtubeVideoUrl?: string;
  edition: string; // e.g., '2025', '2026'
  email?: string;
};

export type NominationRequest = {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  // Form data
  nomineeType: 'persona' | 'entidad';
  nomineeName: string;
  category: string;
  nomineeEmail: string;
  nomineeCountry: string;
  positionAndProject: string;
  organizationName: string;
  nomineeBio: string;
  leadershipLesson: string;
  profilePhotoUrl: string; // Stored as data URI
  websiteUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  youtubeVideoUrl?: string;
  relevantLinks?: string;
  nominatorName?: string;
  nominatorCountry?: string;
  nominatorEmail?: string;
  agreedToTerms: boolean;
  createdAt?: any;
  nomineeId?: string;
  edition: string; // e.g., '2025', '2026'
};

export type Vote = {
  id: string;
  ip: string;
  nomineeId: string;
  createdAt: any; // Firestore Timestamp
};

export const categories2025 = [
  "Líderes en América Latina",
  "Diáspora Latinoamericana",
  "Empresas Extranjeras invirtiendo en América Latina",
  "Jóvenes Promesas (Menores a 29 años)"
] as const;

export const viennaCategories2026 = [
  "Mujeres Auténticas de América Latina",
  "Causas Sociales con Impacto",
  "Políticas Públicas para la Innovación Social",
  "Jóvenes Promesas del Sector Social"
] as const;

export const madridCategories2026 = [
  "Empresarios que Transforman América Latina",
  "Emprendedores con Visión de Futuro",
  "Inversionistas y Promotores de Inversión Pro América Latina",
  "Políticas Públicas para el Desarrollo Económico",
  "Jóvenes Promesas de los Negocios",
  "Diáspora Latinoamericana que Impulsa Oportunidades"
] as const;

export const categories = [...viennaCategories2026, ...madridCategories2026] as const;
