'use client';

import { useEffect, useState } from 'react';

const VIDEO_ID = 'hcFg1XqGXvE';
const EMBED_URL =
  `https://www.youtube-nocookie.com/embed/${VIDEO_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}` +
  `&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&disablekb=1&fs=0`;

export default function YouTubeBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Defer iframe injection so LCP/FCP happen first
    const t = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return null;

  return (
    <iframe
      src={EMBED_URL}
      allow="autoplay; encrypted-media"
      title="Background video"
      className="absolute border-0 pointer-events-none"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // Covers any container aspect ratio without black bars
        width: '177.78vh',
        height: '56.25vw',
        minWidth: '100%',
        minHeight: '100%',
      }}
    />
  );
}
