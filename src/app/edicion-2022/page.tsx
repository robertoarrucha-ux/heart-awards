
import Header from '@/components/header';
import Winners2022 from '@/components/winners-2022';
import EventInvitation from '@/components/event-invitation';
import Footer from '@/components/footer';

export default function Edition2022Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <Winners2022 />
      </main>
      <EventInvitation />
      <Footer />
    </div>
  );
}
