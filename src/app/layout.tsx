
import React from 'react';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter, Outfit, Cormorant_Garamond } from 'next/font/google';
import ErrorBoundary from '@/components/error-boundary';
import { LanguageProvider } from '@/context/LanguageContext';
import AnalyticsTracker from '@/components/analytics-tracker';
import AffiliateTracker from '@/components/affiliate-tracker';
import GATracker from '@/components/ga-tracker';
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

const siteUrl = 'https://heart.awards-global.org';
const faviconUrl = 'https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/favicon.ico?alt=media&token=68df8661-eda9-45b1-82ae-ebd30be0e5cd';

export const metadata: Metadata = {
  title: 'Heart-Led Summit & Awards 2026 — Vienna',
  description: 'The inaugural Heart-Led Summit & Awards recognizes outstanding leaders who integrate compassion, purpose, and excellence across sectors and geographies. Vienna, December 3–5, 2026.',
  keywords: ['Heart-Led Summit', 'Heart-Led Awards', 'compassionate leadership', 'leadership awards Vienna', 'heart-led leaders', 'Vienna 2026', 'social impact', 'ESG leadership'],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Heart-Led Summit & Awards 2026 — Vienna',
    description: 'Recognizing leaders who integrate compassion into decisions across sectors and geographies. Inaugural edition, Vienna, December 3–5, 2026.',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/Latin-American-Leaders-Awards-Viena%202.webp?alt=media',
        width: 1200,
        height: 630,
        alt: 'Heart-Led Summit & Awards 2026 — Vienna',
      },
    ],
    siteName: 'Heart-Led Summit & Awards',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heart-Led Summit & Awards 2026 — Vienna',
    description: 'Recognizing leaders who integrate compassion into decisions across sectors and geographies. Inaugural edition, Vienna, December 3–5, 2026.',
    images: ['https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/Latin-American-Leaders-Awards-Viena%202.webp?alt=media'],
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
    <html lang="en" className={`dark scroll-smooth ${inter.variable} ${outfit.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        {/* Google Analytics */}
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-ZN6G6ZBZX1');` }} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZN6G6ZBZX1" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <GATracker />
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
