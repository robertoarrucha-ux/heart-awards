
import Header from '@/components/header';
import Winners2023 from '@/components/winners-2023';
import EventInvitation from '@/components/event-invitation';
import Footer from '@/components/footer';

export default function Edition2023Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Winners2023 />
      </main>
      <EventInvitation />
      <Footer />
    </div>
  );
}
