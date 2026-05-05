
const LOCAL_ASSETS = [
  'amigos-del-bellas-artes.svg',
  'el-heraldo.svg',
  'el-universal.svg'
];

export const getAssetUrl = (filename: string) => {
  if (!filename) return '';
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  
  if (LOCAL_ASSETS.includes(cleanFilename)) {
    return `/${cleanFilename}`;
  }

  // Handle Diario Sustentable specifically as it's currently 404ing in Firebase Storage
  if (cleanFilename === 'Diario-Sustentable.jpg') {
    return 'https://www.diariosustentable.com/wp-content/uploads/2026/04/LOGO-DIARIO-12-ANOS.png';
  }

  // Fallbacks for Latin American Leaders Awards missing images
  const normalizedFilename = cleanFilename.toLowerCase().replace(/[\s-]/g, '');
  
  if (normalizedFilename.includes('latinamericanleadersawards') || normalizedFilename.includes('gonzalomunoz')) {
    if (normalizedFilename.includes('viena') || normalizedFilename.includes('vienna')) {
      return 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=2072&auto=format&fit=crop'; // Vienna
    }
    if (normalizedFilename.includes('mauriciovila')) {
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop'; // Profile/Award
    }
    if (normalizedFilename.includes('1') || normalizedFilename.includes('meeting')) {
      return 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop'; // Business Meeting
    }
    if (normalizedFilename.includes('3') || normalizedFilename.includes('networking')) {
      return 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop'; // Networking
    }
    // Only return generic fallback if it's NOT the specifically uploaded '2' or '29' files
    if (normalizedFilename.includes('29')) {
      return 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2070&auto=format&fit=crop';
    }
    if (!normalizedFilename.includes('2')) {
      return 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2048&auto=format&fit=crop'; // Team/Leadership
    }
  }

  const encodedFilename = encodeURIComponent(cleanFilename);
  return `https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/public%2F${encodedFilename}?alt=media`;
};
