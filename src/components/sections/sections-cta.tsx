
'use client';

import { Handshake, Ticket, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'motion/react';

export default function SectionsCTA() {
  const { t } = useLanguage();

  const ctas = [
    { icon: Handshake, title: t.ctas.alliances.title, desc: t.ctas.alliances.desc, link: "https://es.theglobal.school/alianzas-latam-awards/", label: t.ctas.alliances.label },
    { icon: Ticket, title: t.ctas.tickets.title, desc: t.ctas.tickets.desc, link: "/tickets", label: t.ctas.tickets.label },
    { icon: Users, title: t.ctas.winners.title, desc: t.ctas.winners.desc, link: "/edicion-2025", label: t.ctas.winners.label }
  ];

  return (
    <section className="py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ctas.map((cta, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass border-white/5 p-8 h-full flex flex-col hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <cta.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{cta.title}</h3>
                <p className="text-muted-foreground mb-8 flex-grow">{cta.desc}</p>
                <Button asChild variant={i === 1 ? "default" : "outline"} className={i === 1 ? "bg-primary hover:bg-primary/90" : "glass border-white/10"}>
                  <Link href={cta.link} target={cta.link.startsWith('http') ? "_blank" : undefined}>{cta.label}</Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
