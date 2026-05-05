
'use client';

import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

import { motion } from 'motion/react';

export default function EventInvitation() {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass p-12 md:p-20 rounded-[3rem] border-white/5 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            {t.event_invitation.title}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            {t.event_invitation.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-12 mb-16">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t.event_invitation.date_label}</p>
                    <p className="text-lg font-bold">{t.event_invitation.date_value}</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t.event_invitation.location_label}</p>
                    <p className="text-lg font-bold">{t.event_invitation.location_value}</p>
                  </div>
              </div>
          </div>

          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-105 px-12 py-8 text-xl rounded-full">
            <Link href="/tickets">
              <Ticket className="w-6 h-6 mr-3" />
              {t.event_invitation.cta}
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
