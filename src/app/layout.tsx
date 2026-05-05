
import React from 'react';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';
import { Inter, Outfit, Cormorant_Garamond } from 'next/font/google';
import ErrorBoundary from '@/components/error-boundary';
import { LanguageProvider } from '@/context/LanguageContext';
import AnalyticsTracker from '@/components/analytics-tracker';
import AffiliateTracker from '@/components/affiliate-tracker';
import { Suspense } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const siteUrl = 'https://awards.pro-latam.org';
const faviconUrl = 'https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/favicon.ico?alt=media&token=68df8661-eda9-45b1-82ae-ebd30be0e5cd';

import { getAssetUrl } from '@/lib/assets';

export const metadata: Metadata = {
  title: 'Latin American Leaders Awards 2026',
  description: 'En 2026, los Latin American Leaders Awards se celebrarán en Viena y Madrid para reconocer a líderes que impulsan el desarrollo social, económico e institucional de América Latina con impacto global.',
  keywords: ['Latin American Leaders Awards', 'Premios Pro-Latam', 'líderes de América Latina', 'nominación líderes', 'Pro-Latam', 'Viena', 'Madrid', 'liderazgo social', 'liderazgo empresarial'],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Latin American Leaders Awards 2026: Viena y Madrid',
    description: 'Participa en los Latin American Leaders Awards, con dos sedes en 2026 para reconocer el liderazgo que transforma América Latina desde lo social, público y económico.',
    images: [
      {
        url: getAssetUrl('Latin-American-Leaders-Awards-Viena 2.webp'),
        width: 1200,
        height: 630,
        alt: 'Latin American Leaders Awards 2026',
      },
    ],
    siteName: 'Latin American Leaders Awards',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latin American Leaders Awards 2026: Viena y Madrid',
    description: 'Participa en los Latin American Leaders Awards, con dos sedes en 2026 para reconocer el liderazgo que transforma América Latina desde lo social, público y económico.',
    images: [getAssetUrl('Latin-American-Leaders-Awards-Viena 2.webp')],
    creator: '@globschool',
  },
  icons: {
    icon: faviconUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`dark scroll-smooth ${inter.variable} ${outfit.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
