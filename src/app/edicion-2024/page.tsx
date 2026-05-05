
import Header from '@/components/header';
import Winners2024 from '@/components/winners-2024';
import EventInvitation from '@/components/event-invitation';
import Footer from '@/components/footer';

export default function Edition2024Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Winners2024 />
      </main>
      <EventInvitation />
      <Footer />
    </div>
  );
}
