
'use client';

import { Check, ChevronRight, Heart, Building } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'motion/react';

export default function Venues() {
  const { t } = useLanguage();

  return (
    <section id="sedes" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">{t.venues_section.title}</h2>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground font-light">
            {t.venues_section.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="group relative overflow-hidden glass border-white/5 h-full flex flex-col p-8 md:p-12 hover:border-primary/30 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Heart className="w-32 h-32 text-primary" />
              </div>
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-4xl font-bold mb-2">{t.venues_section.vienna.title}</h3>
                <p className="text-primary font-medium tracking-wide uppercase text-sm">{t.venues_section.vienna.date}</p>
              </div>
              <CardContent className="p-0 flex-grow">
                <ul className="space-y-3 mb-8">
                  {t.venues_section.vienna.focus.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-lg leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-0 flex flex-col gap-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 py-6 text-lg rounded-xl">
                  <Link href="/nominate">{t.nav.nominate}</Link>
                </Button>
                <Button asChild variant="ghost" className="text-primary hover:bg-primary/10">
                  <Link href="/vota" className="flex items-center">{t.nav.vote} <ChevronRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="group relative overflow-hidden glass border-white/5 h-full flex flex-col p-8 md:p-12 hover:border-primary/30 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Building className="w-32 h-32 text-primary" />
              </div>
              <div className="mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Building className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-4xl font-bold mb-2">{t.venues_section.madrid.title}</h3>
                <p className="text-primary font-medium tracking-wide uppercase text-sm">{t.venues_section.madrid.date}</p>
              </div>
              <CardContent className="p-0 flex-grow">
                <ul className="space-y-3 mb-8">
                  {t.venues_section.madrid.focus.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-lg leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-0 flex flex-col gap-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 py-6 text-lg rounded-xl">
                  <Link href="/nominate">{t.nav.nominate}</Link>
                </Button>
                <Button asChild variant="ghost" className="text-primary hover:bg-primary/10">
                  <Link href="/vota" className="flex items-center">{t.nav.vote} <ChevronRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
