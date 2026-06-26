
'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { FreeRegistrationForm } from '@/components/free-registration-form';
import { motion } from 'motion/react';
import { Calendar, ShieldCheck, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FreeRegistrationPage() {
  const { language } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <Header />
      <main className="flex-grow py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
               <Star className="w-4 h-4" />
               Exclusive Access
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Free Access Registration</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Exclusive form for European Companies & Investors, Award Winners, Nominees, Media, Partners, and Professional Network.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
                <FreeRegistrationForm />
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <Calendar className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">Important Dates</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You can register and receive votes until 1 day before the awards ceremony.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 font-bold">
                 <ShieldCheck className="w-8 h-8 text-green-500 mb-4" />
                 <h3 className="font-bold mb-2">Validation Process</h3>
                 <p className="text-sm font-normal text-muted-foreground leading-relaxed">
                    Your request will be reviewed by our team. Once approved, you will receive your access credentials via email.
                 </p>
              </div>

              <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium italic">
                  "We connect heart-led talent with the European ecosystem of innovation and business."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
