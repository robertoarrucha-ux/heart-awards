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

  const encodedFilename = encodeURIComponent(cleanFilename);
  return `https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/${encodedFilename}?alt=media`;
};

export const getSliderImageUrl = (filename: string) => {
  const encodedFilename = encodeURIComponent(`public/Photo Slider/${filename}`);
  return `https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/${encodedFilename}?alt=media`;
};
