
'use client';

import { Heart, Building } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'motion/react';

export default function AboutWho() {
  const { t } = useLanguage();

  return (
    <section className="py-32 bg-white/[0.02]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">{t.about.title}</h2>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              {t.about.description}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass p-10 rounded-3xl border-white/5"
          >
            <h2 className="text-3xl font-bold mb-8">{t.who.title}</h2>
            <ul className="space-y-8">
              <li className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">{t.who.vienna_title}</h4>
                  <p className="text-muted-foreground">{t.who.vienna_desc}</p>
                </div>
              </li>
              <li className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">{t.who.madrid_title}</h4>
                  <p className="text-muted-foreground">{t.who.madrid_desc}</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
