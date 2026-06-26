'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Calendar, Mail } from 'lucide-react';
import { motion } from 'motion/react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get('payment_intent');

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-xl text-muted-foreground">
          Thank you for your purchase. Your ticket to the Heart-Led Summit & Awards has been confirmed.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <Mail className="w-6 h-6 text-[#d4af37] mb-4" />
          <h3 className="font-bold mb-2">Ticket Delivered</h3>
          <p className="text-sm text-gray-400">
            We have sent an email with your registration details and payment confirmation.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <Calendar className="w-6 h-6 text-[#d4af37] mb-4" />
          <h3 className="font-bold mb-2">Next Steps</h3>
          <p className="text-sm text-gray-400">
            You will soon receive our exclusive logistics guide with hotel and transport recommendations.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="bg-[#d4af37] hover:bg-[#b08d2c] text-black font-bold px-8">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-white/10 hover:bg-white/5">
          <Link href="/tickets" className="flex items-center gap-2">
            Ver más opciones <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {paymentIntent && (
        <p className="mt-12 text-[10px] text-gray-600 font-mono">
          Ref: {paymentIntent}
        </p>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
