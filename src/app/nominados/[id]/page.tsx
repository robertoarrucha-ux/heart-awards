
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import EventInvitation from '@/components/event-invitation';
import NomineePageClient from '@/components/nominee-page-client';
import { getNomineeByIdAction, getNomineeRankAction, getHighestVoteCountAction } from '@/app/actions';
import { Loader2 } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const nominee = await getNomineeByIdAction(id);

  if (!nominee) {
    return {
      title: 'Nominee not found | Heart-Led Summit & Awards',
    };
  }

  const title = `${nominee.name} - Heart-Led Summit & Awards 2026 Nominee`;
  const description = `${nominee.name} is nominated in the ${nominee.category} category representing ${nominee.country}. Learn about their journey and support them with your vote.`;
  const siteUrl = 'https://heart.awards-global.org';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/nominados/${id}`,
      siteName: 'Heart-Led Summit & Awards',
      images: [
        {
          url: nominee.imageUrl,
          width: 800,
          height: 800,
          alt: nominee.name,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [nominee.imageUrl],
    },
  };
}

export default async function NomineePage({ params }: Props) {
  const { id } = await params;
  
  // Fetch nominee data
  const nominee = await getNomineeByIdAction(id);
  
  if (!nominee) {
    notFound();
  }

  // Optimized fetching for rank and highest vote count
  const [rank, highestVoteCount] = await Promise.all([
    getNomineeRankAction(nominee.votes),
    getHighestVoteCountAction()
  ]);

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": nominee.name,
    "description": nominee.bio,
    "image": nominee.imageUrl,
    "jobTitle": nominee.positionAndProject,
    "worksFor": {
      "@type": "Organization",
      "name": nominee.organizationName
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": nominee.country
    },
    "award": `Heart-Led Summit & Awards 2026 Nominee - ${nominee.category}`
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading nominee profile...</p>
          </div>
        }>
          <NomineePageClient 
            nominee={nominee} 
            rank={rank} 
            highestVoteCount={highestVoteCount} 
          />
        </Suspense>
      </main>
      <EventInvitation />
      <Footer />
    </div>
  );
}
