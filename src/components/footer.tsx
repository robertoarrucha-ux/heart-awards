
'use client';

import Link from 'next/link';
import { Instagram, Youtube, MessageCircle, X as TwitterIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-20 border-t border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
              <div>
                  <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Venue</h3>
                  <div className="space-y-4 text-muted-foreground text-sm font-light">
                      <p>Vienna, Austria</p>
                      <p>December 3–5, 2026</p>
                  </div>
              </div>
              
              <div className="flex flex-col items-center">
                  <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest transition-colors hover:text-primary cursor-default">Community</h3>
                  <div className="flex gap-6">
                      <a href="https://x.com/prolatamglobal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all hover:scale-110">
                          <TwitterIcon className="w-4 h-4" />
                      </a>
                      <a href="https://www.instagram.com/prolatamglobal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all hover:scale-110">
                          <Instagram className="w-4 h-4" />
                      </a>
                      <a href="https://chat.whatsapp.com/JY1ulDE92qGI0aNbUiyqFn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all hover:scale-110">
                          <MessageCircle className="w-4 h-4" />
                      </a>
                      <a href="https://www.youtube.com/channel/UCf_DVuoY_x8qJQjZnBvVGKQ?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all hover:scale-110">
                          <Youtube className="w-4 h-4" />
                      </a>
                  </div>
              </div>

              <div className="text-center md:text-right">
                  <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Legal</h3>
                  <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-xs font-bold text-foreground/40 uppercase tracking-tighter">
                      <a href="https://pro-latam.org/privacy-use-impressum/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Privacy</a>
                      <a href="https://pro-latam.org/privacy-use-impressum/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Terms</a>
                      <a href="https://pro-latam.org/privacy-use-impressum/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Impressum</a>
                      <Link href="/terminos-convocatoria" className="hover:text-primary transition-colors">Rules</Link>
                  </div>
              </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 text-center">
              <p className="text-muted-foreground text-xs font-light tracking-wide italic">
                  © 2026 The Mompreneurs Society & Pro Latam. {t.footer.rights}
              </p>
          </div>
      </div>
    </footer>
  );
}
