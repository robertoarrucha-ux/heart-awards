
'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import EventInvitation from '@/components/event-invitation';
import PhotoSlideshow from '@/components/photo-slideshow';
import Hero from '@/components/sections/hero';
import Venues from '@/components/sections/venues';
import AboutWho from '@/components/sections/about-who';
import Impact from '@/components/sections/impact';
import MediaPartners from '@/components/sections/media-partners';
import SectionsCTA from '@/components/sections/sections-cta';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Venues />
        <PhotoSlideshow />
        <AboutWho />
        <Impact />
        <EventInvitation />
        <MediaPartners />
        <SectionsCTA />
      </main>
      <Footer />
    </div>
  );
}
