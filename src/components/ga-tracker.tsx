'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Maps pathnames to readable page titles for GA reporting
const PAGE_TITLES: Record<string, string> = {
  '/': 'Home — Heart-Led Summit & Awards',
  '/tickets': 'Tickets — Heart-Led Summit & Awards',
  '/nominate': 'Nominate — Heart-Led Summit & Awards',
  '/vota': 'Vote — Heart-Led Summit & Awards',
  '/registro-gratuito': 'Free Registration — Heart-Led Summit & Awards',
  '/aliado/dashboard': 'Partner Dashboard — Heart-Led Summit & Awards',
  '/edicion-2022': 'Edition 2022 — Latin American Leaders Awards',
  '/edicion-2023': 'Edition 2023 — Latin American Leaders Awards',
  '/edicion-2024': 'Edition 2024 — Latin American Leaders Awards',
  '/edicion-2025': 'Edition 2025 — Latin American Leaders Awards',
  '/admin': 'Admin — Heart-Led Summit & Awards',
};

export default function GATracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    // Skip first mount — the inline gtag('config') in <head> already fired page_view
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const title = PAGE_TITLES[pathname] ?? document.title;
    window.gtag?.('event', 'page_view', {
      page_path: pathname + window.location.search,
      page_location: window.location.href,
      page_title: title,
    });
  }, [pathname]);

  return null;
}
