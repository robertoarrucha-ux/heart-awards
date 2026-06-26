
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

export const heartLedCategories2026 = [
  "Global Heart-Led Leaders",
  "Latin Heart-Led Award",
  "Local Heart-Led Leaders (Austria)"
] as const;

export const categories = [...heartLedCategories2026] as const;
