
'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'motion/react';

export default function Impact() {
  const { t } = useLanguage();

  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          {t.impact.title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-20"
        >
          {t.impact.subtitle}
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
          {[
            { label: t.impact.impressions, value: "70", suffix: "%" },
            { label: t.impact.attendees, value: "4", suffix: "×" },
            { label: t.impact.countries, value: "21", suffix: "%" },
            { label: t.impact.awarded, value: "87", suffix: "%" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-5xl md:text-7xl font-bold text-gold mb-2 flex items-baseline justify-center">
                {stat.value}
                <span className="text-3xl md:text-5xl text-primary ml-1 opacity-80">+</span>
              </p>
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
