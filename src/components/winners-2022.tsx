
'use client';

import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { winners2022 } from '@/lib/constants/winners';

export default function Winners2022() {
  const { language } = useLanguage();
  const isEs = language === 'es';

  return (
    <section id="ganadores-2022" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-4">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-widest uppercase text-foreground/80">Foundations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isEs ? 'Ganadores Edición 2022' : '2022 Edition Winners'}
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-muted-foreground font-light">
            {isEs 
              ? 'Los líderes que establecieron los cimientos de excelencia en la primera edición de los Latin American Leaders Awards.' 
              : 'The leaders who laid the foundations of excellence in the first edition of the Latin American Leaders Awards.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners2022.map((winner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card className="glass border-white/5 h-full hover:border-primary/20 transition-all group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <winner.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/50 bg-white/5 px-2 py-1 rounded">
                      {winner.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors leading-tight">{winner.name}</h4>
                  <div className="flex items-center gap-2 text-xs font-medium text-primary mb-3 uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    {winner.location}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {winner.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
