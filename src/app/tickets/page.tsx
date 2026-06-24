
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'motion/react';
import { 
  Ticket, 
  Plane, 
  Hotel, 
  Star, 
  Check, 
  MessageCircle, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Loader2,
  Users,
  Handshake,
  Award,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { trackReferralAction } from '@/app/actions';
import { PaymentModal } from '@/components/payment-modal';
import YouTubeBackground from '@/components/youtube-background';

export default function TicketsPage() {
  const { t, language } = useLanguage();
  const tp = t.tickets_page;
  const [selectedEdition, setSelectedEdition] = useState<'vienna' | 'madrid'>('vienna');
  const [selectedCurrency, setSelectedCurrency] = useState<'eur' | 'mxn'>('eur');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<{
    priceId: string;
    amount: number;
    name: string;
  } | null>(null);

  const EXCHANGE_RATE_MXN = 21;

  // Referral tracking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      // Save for payment attribution in sessionStorage
      sessionStorage.setItem('referralCode', refCode);
      
      // Track click in Firestore (increment clickCount)
      const track = async () => {
        try {
          await trackReferralAction(refCode);
        } catch (e) {
          console.error('Referral tracking error:', e);
        }
      };
      track();
    }
  }, []);

  // Dynamic Pricing Logic
  const getDiscountInfo = () => {
    const month = currentDate.getMonth(); // 0-11
    const year = currentDate.getFullYear();
    
    // Logic based on user's coupons:
    // April (3) & May (4): ABRILMAYO (30%)
    // June (5): JUNIO (25%)
    // July (6): JULIO (20%)
    // August (7): AGOSTO (15%)
    // September (8): SEPTIEMBRE (10%)
    
    if (year > 2026) return { percentage: 0, label: "", coupon: "" };
    if (year === 2026 && month > 8) return { percentage: 0, label: "", coupon: "" };

    if (month <= 4) return { 
      percentage: 30, 
      label: language === 'es' ? "Oferta de Lanzamiento: 30% OFF" : "Launch Offer: 30% OFF",
      coupon: "ABRILMAYO"
    };
    
    if (month === 5) return { 
      percentage: 25, 
      label: language === 'es' ? "Descuento de Junio: 25% OFF" : "June Discount: 25% OFF",
      coupon: "JUNIO"
    };
    
    if (month === 6) return { 
      percentage: 20, 
      label: language === 'es' ? "Descuento de Julio: 20% OFF" : "July Discount: 20% OFF",
      coupon: "JULIO"
    };
    
    if (month === 7) return { 
      percentage: 15, 
      label: language === 'es' ? "Descuento de Agosto: 15% OFF" : "August Discount: 15% OFF",
      coupon: "AGOSTO"
    };
    
    if (month === 8) return { 
      percentage: 10, 
      label: language === 'es' ? "Descuento de Septiembre: 10% OFF" : "September Discount: 10% OFF",
      coupon: "SEPTIEMBRE"
    };

    return { percentage: 0, label: "", coupon: "" };
  };

  const discount = getDiscountInfo();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = endOfMonth.getTime() - now.getTime();
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculatePrice = (originalPriceStr: string) => {
    const euroPrice = parseInt(originalPriceStr.replace('€', '').replace(',', ''));
    if (isNaN(euroPrice)) return { original: originalPriceStr, discounted: originalPriceStr, hasDiscount: false, val: 0, baseVal: 0 };
    
    const rate = selectedCurrency === 'mxn' ? EXCHANGE_RATE_MXN : 1;
    const symbol = selectedCurrency === 'mxn' ? 'MX$' : '€';
    
    const basePrice = euroPrice * rate;
    const originalLabel = `${symbol}${basePrice.toLocaleString()}`;
    
    if (discount.percentage <= 0) {
      return { original: originalLabel, discounted: originalLabel, hasDiscount: false, val: basePrice, baseVal: basePrice };
    }
    
    const discountedPrice = Math.round(basePrice * (1 - discount.percentage / 100));
    return { 
      original: originalLabel, 
      discounted: `${symbol}${discountedPrice.toLocaleString()}`,
      hasDiscount: true,
      val: discountedPrice,
      baseVal: basePrice
    };
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setStatusMessage({
        type: 'success',
        text: language === 'es' 
          ? '¡Pago exitoso! Recibirás un correo de confirmación pronto.' 
          : 'Payment successful! You will receive a confirmation email soon.'
      });
    }
    if (query.get('canceled')) {
      setStatusMessage({
        type: 'error',
        text: language === 'es' 
          ? 'El pago fue cancelado. Si tienes problemas, contáctanos.' 
          : 'Payment was canceled. If you have issues, please contact us.'
      });
    }
  }, [language]);

  const handleCheckout = async (priceId: string, ticketType: string, originalPriceStr: string) => {
    if (!priceId || priceId.includes('placeholder')) {
      window.open(`https://api.whatsapp.com/send?phone=4367761735010&text=Hola,%20estoy%20interesado%20en%20el%20ticket%20${ticketType}%20para%20${selectedEdition}.`, '_blank');
      return;
    }

    const priceInfo = calculatePrice(originalPriceStr);
    
    // Safety check for pricing
    if (!priceInfo.baseVal || priceInfo.baseVal <= 0) {
       console.error('Invalid price calculation result:', priceInfo);
       alert('Error en el cálculo del precio. Por favor recarga la página o contacta a soporte.');
       return;
    }

    const amountInCents = (priceInfo.baseVal as number) * 100;
    
    setSelectedTicket({
      priceId,
      amount: amountInCents,
      name: ticketType
    });
    setIsPaymentModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main className="flex-grow">
        {/* HERO */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <YouTubeBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6"
            >
              <MapPin className="w-4 h-4" />
              {selectedEdition === 'vienna' ? tp.vienna_label : tp.madrid_label}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-8 max-w-4xl mx-auto"
            >
              {tp.hero.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto"
            >
              {tp.hero.subtitle}
            </motion.p>
          </div>
        </section>

        {/* STEPS NAVIGATION */}
        <section className="py-20 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            
            {/* FOMO COUNTDOWN & STATUS */}
            <div className="max-w-4xl mx-auto mb-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-primary/20 via-black to-primary/5 border border-primary/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-[0_0_50px_rgba(var(--primary-rgb),0.15)]"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                
                <h3 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-6">
                  {language === 'es' ? 'Oportunidad de Tiempo Limitado' : 'Limited Time Opportunity'}
                </h3>
                
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8">
                  {[
                    { label: language === 'es' ? 'Días' : 'Days', value: timeLeft.days },
                    { label: language === 'es' ? 'Hrs' : 'Hrs', value: timeLeft.hours },
                    { label: language === 'es' ? 'Min' : 'Min', value: timeLeft.minutes },
                    { label: language === 'es' ? 'Seg' : 'Sec', value: timeLeft.seconds },
                  ].map((unit, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-3xl md:text-5xl font-black tracking-tighter text-white">{unit.value.toString().padStart(2, '0')}</span>
                      <span className="text-[10px] uppercase text-gray-500 font-bold mt-1">{unit.label}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xl md:text-2xl font-medium text-white mb-2">
                  {language === 'es' 
                    ? `¡Ahorra un ${discount.percentage}% en tu entrada este mes!` 
                    : `Save ${discount.percentage}% on your ticket this month!`}
                </p>
                <p className="text-gray-400 text-sm max-w-lg mx-auto">
                  {language === 'es'
                    ? "El descuento disminuye un 5% el primer día de cada mes. Asegura el precio más bajo hoy mismo."
                    : "The discount decreases by 5% on the first day of each month. Secure the lowest price today."}
                </p>
              </motion.div>

              {statusMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-8 p-6 rounded-2xl text-center font-bold text-lg shadow-2xl ${
                    statusMessage.type === 'success' 
                      ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                      : 'bg-red-600/20 text-red-400 border border-red-600/30'
                  }`}
                >
                  {statusMessage.text}
                </motion.div>
              )}
            </div>

            {/* EVENT HIGHLIGHTS - PREMIUM & FUN */}
            <div className="mb-32">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {language === 'es' ? '¿Qué vas a lograr?' : 'What will you achieve?'}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {language === 'es' 
                    ? 'Una experiencia de primer nivel diseñada para el impacto y la conexión.' 
                    : 'A top-tier experience designed for impact and connection.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: <Users className="w-8 h-8" />, title: "300-400 Líderes", desc: "De Gobierno y Empresa de Europa y América Latina." },
                  { icon: <Handshake className="w-8 h-8" />, title: "Alianzas Estratégicas", desc: "2 Reuniones de alianzas exclusivas por sede." },
                  { icon: <Award className="w-8 h-8" />, title: "20 Charlas", desc: "Inspiración pura de los líderes más influyentes." },
                  { icon: <Heart className="w-8 h-8" />, title: "La Gran Fiesta", desc: "La fiesta hispanoamericana más grande de Europa Central." },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* IMPACT NUMBERS */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-32 py-16 border-y border-white/10">
              {[
                { label: "Países Representados", value: "12" },
                { label: "Líderes Presenciales", value: "300–400" },
                { label: "Asistentes en Línea", value: "1,000" },
                { label: "Aliados Oficiales", value: "20" },
                { label: "Alcance & Impacto", value: "1M+" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-6xl font-black text-primary mb-2 tracking-tighter">{stat.value}</div>
                  <div className="text-xs uppercase tracking-widest font-bold text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* PARTICIPANT PROFILE */}
            <div className="mb-32 bg-gradient-to-r from-primary/10 to-transparent p-8 md:p-16 rounded-[3rem] border border-primary/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    {language === 'es' ? 'Perfil del Participante' : 'Participant Profile'}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {[
                      "Gerentes / Directores",
                      "Emprendedores",
                      "Oficiales de Gobierno",
                      "Cuerpo Diplomático",
                    ].map((profile, i) => (
                      <div key={i} className="flex items-center gap-3 text-white font-medium">
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        {profile}
                      </div>
                    ))}
                  </div>

                  <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Provenientes de</p>
                    <div className="space-y-3">
                      {[
                        { pct: "30%", label: "Empresas y Gobiernos de América Latina" },
                        { pct: "30%", label: "Latinoamericanos en Europa" },
                        { pct: "40%", label: "Europeos invirtiendo o buscando invertir en América Latina" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <span className="text-2xl font-black text-primary w-14 shrink-0">{item.pct}</span>
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-3xl font-black text-primary">42</span>
                    <span className="text-sm text-muted-foreground">años de edad promedio</span>
                  </div>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src="https://firebasestorage.googleapis.com/v0/b/apex-vote.firebasestorage.app/o/public%2FPhoto%20Slider%2FLatin%20American%20Leaders%20Awards%2029.webp?alt=media&token=bf9790c6-2b81-42e7-b3a9-b74c30cb0727"
                    alt="Latin American Leaders Awards"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-sm italic text-gray-300">
                      "La mejor plataforma de alianzas entre Europa y América Latina."
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">{tp.steps.title}</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* STEP 1: TICKETS */}
              <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:col-span-4">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">1</div>
                    <div>
                      <h3 className="text-3xl font-bold">{tp.steps.step1.title}</h3>
                      <p className="text-muted-foreground">{tp.steps.step1.desc}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-1.5 rounded-2xl md:ml-auto border border-white/10">
                    <div className="flex bg-black/40 rounded-xl p-1">
                      <button 
                        onClick={() => setSelectedCurrency('eur')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCurrency === 'eur' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        EUR (€)
                      </button>
                      <button 
                        onClick={() => setSelectedCurrency('mxn')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCurrency === 'mxn' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        MXN ($)
                      </button>
                    </div>

                    <div className="flex">
                      <button 
                        onClick={() => setSelectedEdition('vienna')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedEdition === 'vienna' ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <MapPin className={`w-4 h-4 ${selectedEdition === 'vienna' ? 'text-primary-foreground' : 'text-primary'}`} />
                        {tp.vienna_label}
                      </button>
                      <button 
                        onClick={() => setSelectedEdition('madrid')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedEdition === 'madrid' ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <MapPin className={`w-4 h-4 ${selectedEdition === 'madrid' ? 'text-primary-foreground' : 'text-primary'}`} />
                        {tp.madrid_label}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-12 p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                   <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      {selectedEdition === 'vienna' ? t.venues_section.vienna.title : t.venues_section.madrid.title}
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        ({selectedEdition === 'vienna' ? t.venues_section.vienna.date : t.venues_section.madrid.date})
                      </span>
                   </h4>
                   <div className="flex flex-wrap gap-2">
                      {(selectedEdition === 'vienna' ? t.venues_section.vienna.focus : t.venues_section.madrid.focus).map((item, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-white/5 text-xs text-muted-foreground border border-white/5">
                          {item}
                        </span>
                      ))}
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {Object.entries(tp.steps.step1.options).map(([key, option], i) => {
                    const isVip = key.startsWith('vip');
                    const isFree = key === 'free';
                    
                    return (
                      <Card 
                        key={key} 
                        className={`glass flex flex-col h-full transition-all relative overflow-hidden group
                          ${isFree ? 'border-primary/50 bg-primary/5' : 'border-white/5'}
                          ${isVip ? 'border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.1)]' : ''}
                          hover:border-primary/30 hover:shadow-xl hover:-translate-y-1
                        `}
                      >
                        <div className="absolute top-3 left-3 z-20">
                           <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedEdition === 'vienna' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                              <MapPin className="w-3 h-3" />
                              {selectedEdition === 'vienna' ? 'Viena' : 'Madrid'}
                           </div>
                        </div>

                        {isVip && (
                          <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest z-20">
                            Premium
                          </div>
                        )}
                        
                        <CardHeader className="relative z-10 pt-10 pb-4">
                          <CardTitle className={`text-2xl font-bold ${isVip ? 'text-amber-500' : ''}`}>
                            {option.name}
                          </CardTitle>
                          <div className="flex flex-col mt-2">
                            {calculatePrice(option.price).hasDiscount && !isFree ? (
                              <>
                                <span className="text-sm text-muted-foreground line-through opacity-70">
                                  {calculatePrice(option.price).original}
                                </span>
                                <div className="flex items-baseline gap-2">
                                  <span className={`text-4xl font-black tracking-tighter ${isVip ? 'text-amber-400' : 'text-primary'}`}>
                                    {calculatePrice(option.price).discounted}
                                  </span>
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                    -{discount.percentage}%
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className={`text-4xl font-bold ${isVip ? 'text-amber-400' : 'text-primary'}`}>
                                {isFree ? option.price : calculatePrice(option.price).discounted}
                              </div>
                            )}
                          </div>
                          {discount.label && !isFree && (
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-3 animate-pulse">
                              {discount.label}
                            </p>
                          )}
                        </CardHeader>
                        
                        <CardContent className="flex-grow relative z-10">
                          <ul className="space-y-3">
                            {option.features.map((feature, idx) => {
                              let displayFeature = feature;
                              if (selectedEdition === 'vienna') {
                                displayFeature = displayFeature
                                  .replace('Acceso Días del Evento', '4 y 5 Diciembre')
                                  .replace('Access Event Days', 'Dec 4 & 5')
                                  .replace('Acceso Todos los Días', '3, 4 y 5 Diciembre')
                                  .replace('Access All Days', 'Dec 3, 4 & 5');
                              } else {
                                displayFeature = displayFeature
                                  .replace('Acceso Días del Evento', '20 y 21 de Noviembre')
                                  .replace('Access Event Days', 'Nov 20 & 21')
                                  .replace('Acceso Todos los Días', '19, 20 y 21 de Noviembre')
                                  .replace('Access All Days', 'Nov 19, 20 & 21');
                              }

                              return (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                  <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isVip ? 'text-amber-500' : 'text-primary'}`} />
                                  {isFree ? (
                                    <Link 
                                      href="/registro-gratuito" 
                                      className="hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4"
                                    >
                                      {displayFeature}
                                    </Link>
                                  ) : (
                                    <span>{displayFeature}</span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </CardContent>
                        
                        <CardFooter className="relative z-10">
                          <Button 
                            onClick={() => isFree ? null : handleCheckout(option.stripePriceId || '', option.name, option.price)}
                            disabled={checkoutLoading === option.name}
                            asChild={isFree}
                            className={`w-full rounded-xl font-bold transition-all
                              ${isFree ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                              ${isVip ? 'bg-amber-500 hover:bg-amber-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-primary hover:bg-primary/90'}
                            `}
                          >
                            {isFree ? (
                              <Link href="/registro-gratuito">
                                {language === 'es' ? 'SOLICITAR ACCESO GRATIS' : 'APPLY FOR FREE ACCESS'}
                              </Link>
                            ) : (
                              <>
                                {checkoutLoading === option.name ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                {tp.buy_now}
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>

              {/* STEP 2: FLIGHTS */}
              <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:col-span-2">
                <div className="glass border-white/5 p-10 rounded-3xl h-full">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">2</div>
                    <h3 className="text-2xl font-bold">{tp.steps.step2.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-8">{tp.steps.step2.desc}</p>
                  <ul className="space-y-4">
                    {tp.steps.step2.tips.map((tip, i) => {
                      const displayTip = selectedEdition === 'vienna'
                        ? tip.replace(' o Madrid (MAD)', '').replace(' or Madrid (MAD)', '')
                        : tip.replace('Viena (VIE) o ', '').replace('Vienna (VIE) or ', '');
                      
                      return (
                        <li key={i} className="flex items-start gap-4">
                          <Plane className="w-6 h-6 text-primary shrink-0" />
                          <span className="text-muted-foreground">{displayTip}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>

              {/* STEP 3: LOGISTICS */}
              <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:col-span-2">
                <div className="glass border-white/5 p-10 rounded-3xl h-full">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">3</div>
                    <h3 className="text-2xl font-bold">{tp.steps.step3.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-8">{tp.steps.step3.desc}</p>
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <Star className="w-8 h-8 text-primary mb-4" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {language === 'es' 
                        ? "Te enviaremos una guía detallada con opciones de alojamiento, transporte local y recomendaciones culturales para que tu estancia sea perfecta."
                        : "We will send you a detailed guide with accommodation options, local transport, and cultural recommendations to make your stay perfect."}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* STEP 4: WELCOME */}
              <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:col-span-4">
                <div className="glass border-white/5 p-10 rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">4</div>
                      <h3 className="text-3xl font-bold">{tp.steps.step4.title}</h3>
                    </div>
                    <div className="flex flex-col gap-12">
                      <div>
                        <p className="text-xl text-muted-foreground mb-8">
                          {tp.steps.step4.desc}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {(selectedEdition === 'vienna' ? tp.steps.step4.full_agenda_vienna : tp.steps.step4.full_agenda_madrid).map((day, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
                              <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {day.day}
                              </h4>
                              <ul className="space-y-3">
                                {day.events.map((event, j) => (
                                  <li key={j} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                                    <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                                    {event}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-12 items-center pt-12 border-t border-white/5">
                        <div className="space-y-6">
                          <h4 className="text-2xl font-bold flex items-center gap-2">
                            <Star className="w-6 h-6 text-primary" />
                            {language === 'es' ? 'Puntos Destacados' : 'Agenda Highlights'}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(selectedEdition === 'vienna' ? tp.steps.step4.agenda_highlights : tp.steps.step4.agenda_highlights_madrid).map((item, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-primary" />
                                <span className="font-medium text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                           <iframe
                              className="absolute inset-0 w-full h-full"
                              src="https://www.youtube.com/embed/ETR7kNOItsI"
                              title="Welcome Video"
                              allowFullScreen
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="py-32">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass border-white/5 p-16 rounded-[3rem] max-w-4xl mx-auto"
            >
              <MessageCircle className="w-16 h-16 text-primary mx-auto mb-8" />
              <h2 className="text-4xl font-bold mb-6">{tp.contact.title}</h2>
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-8 text-xl rounded-full">
                <Link href={`https://api.whatsapp.com/send?phone=4367761735010&text=Voy%20a%20los%20Latam%20Awards%20en%20${selectedEdition === 'vienna' ? 'Viena' : 'Madrid'},%20necesito%20informacion%20sobre`} target="_blank">
                  {tp.contact.whatsapp}
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      {selectedTicket && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          priceId={selectedTicket.priceId}
          amount={selectedTicket.amount}
          ticketName={selectedTicket.name}
          currency={selectedCurrency}
          metadata={{
            edition: selectedEdition,
            ticketType: selectedTicket.name,
            coupon: discount.coupon
          }}
        />
      )}
    </div>
  );
}
