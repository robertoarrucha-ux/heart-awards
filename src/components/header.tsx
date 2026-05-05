
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserPlus, Vote, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Update scrolled state
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.8)']
  );

  const headerPadding = useTransform(
    scrollY,
    [0, 50],
    ['1rem', '0.5rem']
  );

  return (
    <motion.header 
      style={{ 
        backgroundColor: headerBg,
        paddingTop: headerPadding,
        paddingBottom: headerPadding,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-shadow duration-300 ${isScrolled ? 'backdrop-blur-md border-b border-white/5 shadow-2xl shadow-black/50' : ''}`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="transition-transform hover:scale-105">
            <Image
            src="https://theglobal.school/wp-content/uploads/2025/08/Logo-Latin-American-Leaders-Awards.webp"
            alt="Logo de Latin American Leaders Awards"
            width={160}
            height={46}
            className="object-contain w-32 sm:w-36 brightness-110"
            priority
            />
        </Link>
        
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/#sedes" className="text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">{t.nav.venues}</Link>
          <Link href="/tickets" className="text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">{t.nav.tickets}</Link>
          <Link href="/vota" className="text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">{t.nav.voting}</Link>
          <Link href="/aliado/dashboard" className="text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">{t.nav.partners}</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors outline-none">
              {t.nav.pastEditions}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass border-white/10">
              <DropdownMenuItem asChild>
                <Link href="/edicion-2025" className="w-full cursor-pointer">{t.nav.edition2025}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/edicion-2024" className="w-full cursor-pointer">{t.nav.edition2024}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/edicion-2023" className="w-full cursor-pointer">{t.nav.edition2023}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/edicion-2022" className="w-full cursor-pointer">{t.nav.edition2022}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 px-0 hover:bg-white/5">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Cambiar idioma</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/10">
              <DropdownMenuItem onClick={() => setLanguage('es')} className={language === 'es' ? 'bg-primary/20 text-primary' : ''}>
                Español
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-primary/20 text-primary' : ''}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild variant="ghost" size="sm" className="hidden sm:flex font-bold text-xs uppercase tracking-wider text-foreground/70 hover:text-primary hover:bg-white/5">
            <Link href="/vota">
                <Vote className="mr-2 h-3.5 w-3.5" />
                {t.nav.vote}
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-105 px-4">
            <Link href="/nominate">
                <UserPlus className="mr-2 h-3.5 w-3.5" />
                {t.nav.nominate}
            </Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
