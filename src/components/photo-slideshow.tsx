
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

import { getAssetUrl } from '@/lib/assets';

const SLIDE_IMAGES = [
  {
    url: getAssetUrl('Latin-American-Leaders-Awards-Viena.webp'),
    alt: 'Gala de Premiación en Viena',
  },
  {
    url: getAssetUrl('Latin-American-Leaders-Awards-Mauricio-Vila.webp'),
    alt: 'Mauricio Vila en Latin American Leaders Awards',
  },
  {
    url: getAssetUrl('Gonzalo-Munoz-Abogabir-Latin-American-Leaders-Awards.webp'),
    alt: 'Gonzalo Muñoz Abogabir en Latin American Leaders Awards',
  },
  {
    url: getAssetUrl('Latin American Leaders Awards 1.webp'),
    alt: 'Cumbre de Liderazgo Latinoamericano',
  },
  {
    url: getAssetUrl('Latin-American-Leaders-Awards-Viena 2.webp'),
    alt: 'Momentos de la gala en Viena',
  },
  {
    url: getAssetUrl('Latin-American-Leaders-Awards-Viena 3.webp'),
    alt: 'Reconocimientos en Viena',
  },
  {
    url: getAssetUrl('Latin American Leaders Awards 2.webp'),
    alt: 'Premiación Latin American Leaders Awards',
  },
  {
    url: getAssetUrl('Latin American Leaders Awards 3.webp'),
    alt: 'Networking entre líderes',
  },
  {
    url: getAssetUrl('Latin American Leaders Awards 29.webp'),
    alt: 'Líderes reunidos en la cumbre',
  },
  {
    url: getAssetUrl('Latin-American-Leaders-Awards-Viena 4.webp'),
    alt: 'Panel de discusión en Viena',
  },
  {
    url: getAssetUrl('Latin-American-Leaders-Awards-Viena 5.webp'),
    alt: 'Gala de premiación',
  },
  {
    url: getAssetUrl('Latin-American-Leaders-Awards-Viena 6.webp'),
    alt: 'Líderes premiados',
  },
];

export default function PhotoSlideshow() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 }, 
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} />
            <span>Mejores Momentos</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold">Alianzas, Negocios y Amigos que cambiarán tu vida</h2>
      </div>

      <div className="w-full">
        <div className="relative w-full group">
          {/* Main Carousel */}
          <div className="overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] bg-black" ref={emblaRef}>
            <div className="flex">
              {SLIDE_IMAGES.map((slide, index) => (
                <div className="flex-[0_0_100%] min-w-0 relative h-[60vh] md:h-[85vh] overflow-hidden" key={index}>
                  {/* Ken Burns Effect Image */}
                  <motion.div
                    animate={selectedIndex === index ? { scale: 1.08, x: 10, y: 5 } : { scale: 1, x: 0, y: 0 }}
                    transition={{ duration: 15, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={slide.url}
                      alt={slide.alt}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      priority={index === 0}
                      sizes="100vw"
                    />
                  </motion.div>

                  {/* Subtle Gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-8 top-1/2 -translate-y-1/2 glass hover:bg-white/10 text-white rounded-full h-16 w-16 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:flex"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-10 w-10" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-8 top-1/2 -translate-y-1/2 glass hover:bg-white/10 text-white rounded-full h-16 w-16 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:flex"
            onClick={scrollNext}
          >
            <ChevronRight className="h-10 w-10" />
          </Button>

          {/* Dot Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-10">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-1 transition-all duration-700 rounded-full",
                  selectedIndex === index ? "w-12 bg-primary" : "w-3 bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Ir a diapositiva ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-xs text-foreground/30 uppercase tracking-[0.3em] font-bold">
            Viena & Madrid 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
}
