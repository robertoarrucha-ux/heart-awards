
import { Metadata } from 'next';
import NominationForm from '@/components/nomination-form';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventInvitation from '@/components/event-invitation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { heartLedCategories2026 } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Nominate a Leader | Heart-Led Summit & Awards 2026',
  description: 'Nominate an outstanding leader who integrates compassion, purpose, and excellence across sectors and geographies. Inaugural edition, Vienna, December 3–5, 2026.',
  openGraph: {
    title: 'Nominate a Leader | Heart-Led Summit & Awards 2026',
    description: 'Nominate an outstanding leader who integrates compassion, purpose, and excellence. Inaugural edition, Vienna, December 3–5, 2026.',
    type: 'website',
  }
};

export default function NominatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-4">
               <Calendar className="w-4 h-4" />
               Open Call — Inaugural Edition 2026
             </div>
             <h1 className="text-4xl font-bold text-center text-primary mb-2">Nominate a Heart-Led Leader</h1>
             <p className="text-lg text-muted-foreground">Vienna, December 3–5, 2026 — recognizing leaders who integrate compassion into decisions across sectors and geographies.</p>
          </div>

          <Card className="bg-card/50 border-primary/10">
            <CardHeader>
                <CardTitle className="text-2xl text-primary">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <Accordion type="single" collapsible className="w-full">

                  <AccordionItem value="faq-1-1">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">What is the Heart-Led Summit & Awards?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p>The Heart-Led Summit & Awards is an annual recognition ceremony held in Vienna that changes the conversation on leadership. We recognize outstanding leaders who integrate compassion, purpose, and collective results across sectors and geographies.</p>
                        <p>Organizations that lead with compassion are not idealists — they are outperformers. Yet this leadership style remains poorly recognized, poorly measured, and poorly celebrated. We are here to change that.</p>
                        <p className="font-medium text-foreground">Organized by The Mompreneurs Society & Pro Latam, with a cross-sector jury composed of academics, visionaries, and industry experts.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-2-1">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">What are the award categories?</AccordionTrigger>
                    <AccordionContent>
                       <ul className="space-y-2 list-none">
                         {heartLedCategories2026.map(cat => <li key={cat}><Badge variant="secondary">{cat}</Badge></li>)}
                       </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-2-2">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">Who can be nominated?</AccordionTrigger>
                    <AccordionContent>
                      <p>We welcome nominations of individuals and organizations who demonstrate compassionate leadership with measurable results — across any sector: business, public institutions, civil society, education, or social innovation. Nominees can be from any country.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-2-3">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">Is there a cost to nominate?</AccordionTrigger>
                    <AccordionContent>
                      <p>No. The nomination process is completely free. All official nominees receive a complimentary invitation to the Awards Ceremony. For those wishing to attend the full 3-day Summit experience, event tickets are available separately.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-2-4">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">How are winners selected?</AccordionTrigger>
                    <AccordionContent>
                      <p>All award recipients are selected through an independent and objective evaluation process, led by a senior jury composed of academics with expertise in leadership and social impact, visionaries shaping the future of leadership, and industry experts with proven experience in business transformation and ESG.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-2-5">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">What do awardees receive?</AccordionTrigger>
                    <AccordionContent>
                       <p>Awardees receive an official trophy and certificate, recognition across all event channels and media, lifetime membership in the Heart-Led Leaders network, and a featured profile on the Heart-Led Summit & Awards platform.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-3-1">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">What are the event dates?</AccordionTrigger>
                    <AccordionContent>
                      <p>The inaugural Heart-Led Summit & Awards takes place December 3, 4 & 5, 2026 in Vienna, Austria. Day 1 is a private welcome reception. Day 2 is the Summit and Awards Ceremony. Day 3 is a strategic networking brunch.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-4-1">
                    <AccordionTrigger className="font-bold text-lg text-foreground hover:no-underline">How can my organization become a partner?</AccordionTrigger>
                    <AccordionContent>
                      <p>We offer three partnership tiers: Founding Partner (€20,000), Strategic Partner (€10,000–15,000), and Supporting Partner (€3,000–5,000 or in-kind). Each tier includes co-branding, event presence, and ESG-relevant visibility. Contact us through the Partners section to receive a tailored proposal.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </CardContent>
          </Card>

          <NominationForm />

        </div>
      </main>
      <EventInvitation />
      <Footer />
    </div>
  );
}
