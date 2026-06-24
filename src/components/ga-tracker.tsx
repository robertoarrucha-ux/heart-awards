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
  '/': 'Home — Latin American Leaders Awards',
  '/tickets': 'Entradas — Latin American Leaders Awards',
  '/nominate': 'Nominación — Latin American Leaders Awards',
  '/vota': 'Vota — Latin American Leaders Awards',
  '/registro-gratuito': 'Registro Gratuito — Latin American Leaders Awards',
  '/aliado/dashboard': 'Dashboard Aliado — Latin American Leaders Awards',
  '/edicion-2022': 'Edición 2022 — Latin American Leaders Awards',
  '/edicion-2023': 'Edición 2023 — Latin American Leaders Awards',
  '/edicion-2024': 'Edición 2024 — Latin American Leaders Awards',
  '/edicion-2025': 'Edición 2025 — Latin American Leaders Awards',
  '/admin': 'Admin — Latin American Leaders Awards',
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
