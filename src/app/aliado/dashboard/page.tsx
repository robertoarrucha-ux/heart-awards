'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
  collection,
  query,
  where,
  limit,
  onSnapshot,
  getDoc,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
  deleteDoc,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  DollarSign,
  Ticket,
  Link as LinkIcon,
  Copy,
  Plus,
  Trash2,
  LogOut,
  ShieldCheck,
  TrendingUp,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Target,
  Award,
  Globe,
  Handshake,
  MapPin,
  Star,
  Clock,
  MessageCircle,
  ArrowRight,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

interface Partner {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  organization: string;
  website?: string;
  status: 'active' | 'suspended' | 'pending' | 'rejected';
  clickCount?: number;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  partnerId: string;
  status: 'active' | 'inactive';
}

interface Registration {
  id: string;
  name: string;
  email: string;
  amount: number;
  ticketType: string;
  couponCode?: string;
  discountPercent?: number; // Added to help calculation
  createdAt: any;
}

export default function AliadoDashboard() {
  const [user, setUser] = useState<any>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [allPartners, setAllPartners] = useState<Partner[]>([]);
  const [origin, setOrigin] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [website, setWebsite] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // Check admin status
        const adminEmails = ['arrucha@theglobal.school', 'roberto@pro-latam.org'];
        if (user.email && adminEmails.includes(user.email)) {
          setIsAdminUser(true);
        } else {
          setIsAdminUser(false);
        }

        try {
          const partnerDoc = await getDoc(doc(db, 'partners', user.uid));
          if (partnerDoc.exists()) {
            setPartner({ id: partnerDoc.id, ...partnerDoc.data() } as Partner);
          }
        } catch (err) {
          console.error('Error fetching partner profile:', err);
        }
      } else {
        setUser(null);
        setPartner(null);
        setIsAdminUser(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdminUser) {
      const q = query(collection(db, 'partners'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snap) => {
        setAllPartners(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Partner[]);
      }, (err) => {
        console.error('Admin partners sync error:', err);
      });
      return () => unsub();
    }
  }, [isAdminUser]);

  useEffect(() => {
    if (partner) {
      // Listen for coupons
      const qCoupons = query(collection(db, 'coupons'), where('partnerId', '==', partner.id));
      const unsubCoupons = onSnapshot(qCoupons, (snap) => {
        setCoupons(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Coupon[]);
      }, (err) => {
        console.error('Coupons sync error:', err);
        try {
          handleFirestoreError(err, OperationType.LIST, 'coupons');
        } catch (e) {
          // Error already handled or silent
        }
      });

      // Listen for registrations attributed to this partner
      const qRegs = query(
        collection(db, 'registrations'), 
        where('partnerId', '==', partner.id)
      );
      const unsubRegs = onSnapshot(qRegs, (snap) => {
        const regs = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Registration[];
        // Sort in-memory to avoid index requirement
        regs.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        setRegistrations(regs);
      }, (err) => {
        console.error('Registrations sync error:', err);
        try {
          handleFirestoreError(err, OperationType.LIST, 'registrations');
        } catch (e) {
          // Error already handled or silent
        }
      });

      return () => {
        unsubCoupons();
        unsubRegs();
      };
    }
  }, [partner]);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        toast({ 
          variant: 'destructive', 
          title: 'Error de inicio de sesión', 
          description: error.message 
        });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleApply = async () => {
    if (!user) return;
    if (!orgName || orgName.length < 2) {
      toast({ variant: 'destructive', title: 'Empresa requerida', description: 'Por favor ingresa el nombre de tu organización.' });
      return;
    }

    setApplying(true);
    try {
      const partnerData = {
        name: user.displayName || 'Aliado',
        email: user.email || '',
        organization: orgName.trim(),
        website: website.trim(),
        status: 'pending',
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: serverTimestamp(),
        clickCount: 0
      };

      const partnerRef = doc(db, 'partners', user.uid);
      await setDoc(partnerRef, partnerData);

      setPartner({ id: user.uid, ...partnerData } as any);

      toast({ title: '¡Solicitud enviada!', description: 'Revisaremos tu postulación y te notificaremos en 2-3 días hábiles.' });
    } catch (error: any) {
      console.error('Detailed Application Error:', error);
      handleFirestoreError(error, OperationType.WRITE, `partners/${user.uid}`);
    } finally {
      setApplying(false);
    }
  };

  const handleCreateCoupon = async () => {
    if (!partner) return;
    if (!newCouponCode || newCouponCode.length < 3) {
      toast({ variant: 'destructive', title: 'Código inválido', description: 'El código debe tener al menos 3 caracteres.' });
      return;
    }
    if (newCouponDiscount > 30) {
      toast({ variant: 'destructive', title: 'Tope excedido', description: 'El descuento máximo permitido es 30%.' });
      return;
    }

    const normalizedCode = newCouponCode.toUpperCase().replace(/\s/g, '');

    try {
      // Check for duplicate code across ALL partners before creating
      const duplicateCheck = await getDocs(
        query(collection(db, 'coupons'), where('code', '==', normalizedCode), limit(1))
      );
      if (!duplicateCheck.empty) {
        toast({
          variant: 'destructive',
          title: 'Código no disponible',
          description: `El código "${normalizedCode}" ya está en uso. Elige otro.`,
        });
        return;
      }

      await addDoc(collection(db, 'coupons'), {
        code: normalizedCode,
        discount: newCouponDiscount,
        partnerId: partner.id,
        status: 'active',
        createdAt: serverTimestamp(),
        usageCount: 0
      });
      setIsCreatingCoupon(false);
      setNewCouponCode('');
      toast({ title: 'Cupón creado', description: 'El cupón ya está disponible para su uso.' });
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo crear el cupón.' });
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cupón?')) return;
    try {
      await deleteDoc(doc(db, 'coupons', id));
      toast({ title: 'Cupón eliminado' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error al eliminar' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado al portapapeles' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ── Shared landing page content (renders for !user and !partner states) ──
  const benefits = [
    {
      icon: <MapPin className="w-7 h-7" />,
      title: 'Lugares Especiales en el Evento',
      desc: 'Tus invitados tendrán espacios VIP reservados en las sedes de Madrid y Viena. Visibilidad de marca frente a 200–300 líderes de gobierno y empresa.',
    },
    {
      icon: <Tag className="w-7 h-7" />,
      title: 'Cupones de Descuento Exclusivos',
      desc: 'Crea códigos personalizados de hasta 30% de descuento para tu comunidad. Cada venta generada a través de tu enlace te genera una comisión directa.',
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: 'Espacio de Presentación',
      desc: 'Oportunidad de presentar tu organización o proyecto ante una audiencia selecta de líderes latinoamericanos y europeos. Networking de alto nivel.',
    },
    {
      icon: <Handshake className="w-7 h-7" />,
      title: 'Red de Alianzas Estratégicas',
      desc: 'Acceso a la red Pro-Latam de más de 20 aliados activos. Reuniones de alianzas exclusivas durante el evento para conectar con socios clave.',
    },
  ];

  const steps = [
    { n: '01', title: 'Postulación', desc: 'Completa el formulario con tu información y página web.' },
    { n: '02', title: 'Revisión', desc: 'Nuestro equipo analiza cada candidatura en 2–3 días hábiles.' },
    { n: '03', title: 'Activación', desc: 'Recibirás acceso a tu panel, cupones y enlace de referido.' },
    { n: '04', title: 'Gestión', desc: 'Comparte, genera ventas y monitorea tus resultados en tiempo real.' },
  ];

  const AliadoLandingPage = ({ cta }: { cta: ReactNode }) => (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white">
      <Header />
      <main className="flex-grow">

        {/* HERO */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 uppercase tracking-widest">
              <Star className="w-4 h-4" /> Programa de Aliados
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="text-5xl md:text-7xl font-black mb-6 max-w-4xl mx-auto leading-tight">
              Impulsa líderes.<br /><span className="text-primary">Crece con nosotros.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              The partner program of <strong className="text-white">Heart-Led Summit & Awards</strong> is designed for organizations and leaders who want to be active participants in heart-led leadership across Europe and Latin America.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <a href="#postular" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-bold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105">
                Quiero ser Aliado <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Beneficios del Programa</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Seleccionamos a nuestros aliados cuidadosamente para garantizar una red de alto valor para todos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                  {b.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className="py-20 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Clock className="w-3.5 h-3.5" /> Por Postulación
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Proceso de Selección</h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                El programa es <strong className="text-white">por postulación</strong>. Revisamos cada solicitud para asegurar que los aliados aporten valor a nuestra comunidad.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {steps.map((s, i) => (
                <div key={i} className="relative flex flex-col items-center text-center p-6">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-white/10" />
                  )}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg mb-4 relative z-10">
                    {s.n}
                  </div>
                  <h4 className="font-bold mb-1">{s.title}</h4>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / FORM */}
        <section id="postular" className="py-24 container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {cta}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );

  if (!user) {
    return (
      <AliadoLandingPage cta={
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 text-center space-y-6">
          <div className="p-4 bg-primary/10 rounded-full border border-primary/20 w-fit mx-auto">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">¿Listo para postularte?</h3>
            <p className="text-gray-400 text-sm">Inicia sesión con Google para completar tu postulación. Es rápido y sin costo.</p>
          </div>
          <Button onClick={handleLogin} disabled={isLoggingIn}
            className="w-full py-6 text-lg font-bold rounded-xl bg-primary text-black hover:scale-[1.02] transition-transform">
            {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión con Google para Postularse'}
          </Button>
          <p className="text-xs text-gray-600">Tu solicitud será revisada por nuestro equipo antes de ser activada.</p>
        </motion.div>
      } />
    );
  }

  if (!partner) {
    return (
      <AliadoLandingPage cta={
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-1">Completa tu Postulación</h3>
            <p className="text-gray-400 text-sm">Hola, <strong className="text-white">{user.displayName}</strong>. Cuéntanos sobre tu organización.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre</label>
                <input type="text" disabled value={user.displayName || ''}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-gray-400 cursor-not-allowed text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <input type="text" disabled value={user.email || ''}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-gray-400 cursor-not-allowed text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Empresa / Organización <span className="text-red-400">*</span></label>
              <input type="text" placeholder="Nombre de tu empresa u organización"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Página Web</label>
              <input type="url" placeholder="https://tu-sitio.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleApply} disabled={applying}
            className="w-full py-5 text-base font-bold rounded-xl bg-primary text-black hover:scale-[1.02] transition-transform">
            {applying ? 'Enviando postulación...' : 'Enviar Postulación'}
          </Button>
          <p className="text-xs text-gray-600 text-center">
            Tu solicitud será revisada en 2–3 días hábiles. Te notificaremos por email.
          </p>
          <Button variant="ghost" onClick={handleLogout} className="w-full text-gray-600 hover:text-white text-xs">
            Cerrar Sesión
          </Button>
        </motion.div>
      } />
    );
  }

  if (partner.status === 'pending') {
    return (
      <AliadoLandingPage cta={
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-10 rounded-3xl bg-yellow-500/5 border border-yellow-500/20 text-center space-y-6">
          <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20 w-fit mx-auto">
            <Clock className="w-12 h-12 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2 text-yellow-300">Solicitud en Revisión</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hola <strong className="text-white">{user.displayName}</strong>, recibimos tu postulación como aliado de <strong className="text-white">{partner.organization}</strong>.<br /><br />
              Nuestro equipo la está revisando. Te notificaremos por correo en <strong className="text-white">2–3 días hábiles</strong>.
            </p>
          </div>
          <a href="https://api.whatsapp.com/send?phone=4367761735010&text=Hola,%20acabo%20de%20postularme%20como%20aliado%20de%20Pro-Latam%20Awards"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:scale-105 transition-transform text-sm">
            <MessageCircle className="w-4 h-4" /> Contactar por WhatsApp
          </a>
          <Button variant="ghost" onClick={handleLogout} className="w-full text-gray-600 hover:text-white text-xs">
            Cerrar Sesión
          </Button>
        </motion.div>
      } />
    );
  }

  if (partner.status === 'rejected') {
    return (
      <AliadoLandingPage cta={
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-10 rounded-3xl bg-red-500/5 border border-red-500/20 text-center space-y-6">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 w-fit mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2 text-red-300">Solicitud No Aprobada</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hola <strong className="text-white">{user.displayName}</strong>, hemos revisado tu postulación y en esta ocasión no hemos podido incorporarte al programa de aliados.<br /><br />
              Revisaremos futuras postulaciones. Mientras tanto, te invitamos a asistir al evento como participante.
            </p>
          </div>
          <a href="https://heart.awards-global.org/tickets" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-bold hover:scale-105 transition-transform text-sm">
            🎟️ Ver Entradas Disponibles
          </a>
          <Button variant="ghost" onClick={handleLogout} className="w-full text-gray-600 hover:text-white text-xs">
            Cerrar Sesión
          </Button>
        </motion.div>
      } />
    );
  }

  if (partner.status === 'suspended') {
    return (
      <AliadoLandingPage cta={
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="p-8 md:p-10 rounded-3xl bg-orange-500/5 border border-orange-500/20 text-center space-y-6">
          <div className="p-4 bg-orange-500/10 rounded-full border border-orange-500/20 w-fit mx-auto">
            <AlertCircle className="w-12 h-12 text-orange-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2 text-orange-300">Cuenta Suspendida</h3>
            <p className="text-gray-400 text-sm">
              Tu acceso al panel de aliados ha sido temporalmente suspendido. Contacta con nuestro equipo si crees que es un error.
            </p>
          </div>
          <a href="https://wa.me/4367761735010" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:scale-105 transition-transform text-sm">
            <MessageCircle className="w-4 h-4" /> Contactar por WhatsApp
          </a>
          <Button variant="ghost" onClick={handleLogout} className="w-full text-gray-600 hover:text-white text-xs">
            Cerrar Sesión
          </Button>
        </motion.div>
      } />
    );
  }

  const referralUrl = `${origin}/tickets?ref=${partner.referralCode}`;
  const totalSales = registrations.length;
  const totalRevenue = registrations.reduce((acc, reg) => acc + reg.amount, 0);

  // Helper to calculate earnings for a registration
  const calculateEarnings = (reg: Registration) => {
    // Try to get discount from the registration itself or find it in current coupons
    let disc = reg.discountPercent;
    
    if (disc === undefined && reg.couponCode) {
      const coupon = coupons.find(c => c.code === reg.couponCode);
      disc = coupon ? coupon.discount : 0;
    } else if (disc === undefined) {
      disc = 0;
    }

    const discountFactor = (1 - disc / 100);
    const basePrice = (discountFactor > 0.001) ? reg.amount / discountFactor : reg.amount;
    const earningPercent = Math.max(0, 30 - disc);
    return basePrice * (earningPercent / 100);
  };

  const totalEarnings = registrations.reduce((acc, reg) => acc + calculateEarnings(reg), 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
           <div className="relative z-10">
             <div className="flex items-center gap-3 text-primary text-sm font-bold uppercase tracking-widest mb-2">
                <LayoutDashboard className="w-4 h-4" /> {isAdminUser ? 'Panel de Administración' : 'Panel de Control'}
             </div>
             <h1 className="text-4xl font-black font-outfit uppercase">
               Bienvenido, <span className="text-primary">{partner.name}</span>
             </h1>
             <p className="text-gray-400 mt-2 font-medium">({partner.organization})</p>
           </div>
           <div className="flex items-center gap-4 relative z-10">
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Estado: Activo</span>
              </div>
              <Button onClick={handleLogout} variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">
                <LogOut className="w-4 h-4 mr-2" /> Salir
              </Button>
           </div>
        </div>

        {/* Admin Section: All Partners */}
        {isAdminUser && (
          <section className="mb-12">
            <Card className="bg-white/5 border-white/10 text-white rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-white/10">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  Listado Maestro de Aliados (Admin)
                </CardTitle>
                <p className="text-gray-500 text-sm">Visualización global de todos los aliados registrados.</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-bold">
                        <th className="px-8 py-4">Aliado / Organización</th>
                        <th className="px-8 py-4">Correo</th>
                        <th className="px-8 py-4">Referral Code</th>
                        <th className="px-8 py-4">Clicks</th>
                        <th className="px-8 py-4">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {allPartners.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-8 py-4">
                            <div className="font-bold">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.organization}</div>
                          </td>
                          <td className="px-8 py-4 text-sm text-gray-400">{p.email}</td>
                          <td className="px-8 py-4 font-mono text-primary text-sm">{p.referralCode}</td>
                          <td className="px-8 py-4 font-bold">{p.clickCount || 0}</td>
                          <td className="px-8 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${
                              p.status === 'active' ? 'bg-green-500/10 text-green-400' : 
                              p.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                              'bg-red-500/10 text-red-400'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Affiliate Link Section */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 text-white p-2 rounded-[2rem]">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="bg-primary/10 p-6 rounded-3xl border border-primary/20">
                  <Target className="w-12 h-12 text-primary" />
                </div>
                <div className="flex-grow space-y-2">
                  <h3 className="text-2xl font-bold">Tu Enlace de Afiliado</h3>
                  <p className="text-gray-400 text-sm">Cualquier compra realizada a través de este enlace será atribuida a tu cuenta.</p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <div className="flex-grow w-full bg-black/40 border border-white/10 p-4 rounded-xl text-primary font-mono text-sm break-all">
                      {referralUrl}
                    </div>
                    <Button 
                      onClick={() => copyToClipboard(referralUrl)}
                      className="bg-primary text-black font-bold h-full py-4 px-8 rounded-xl shrink-0"
                    >
                      <Copy className="w-4 h-4 mr-2" /> Copiar Enlace
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats & Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10 text-white rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Ventas Generadas</CardTitle>
                <Ticket className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">{totalSales}</div>
                <p className="text-xs text-green-400 mt-2 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Entradas vendidas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Tráfico (Clicks)</CardTitle>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">{partner.clickCount || 0}</div>
                <p className="text-xs text-gray-400 mt-2">Visitas únicas por enlace</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Ganancias</CardTitle>
                <DollarSign className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">€{totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-green-400 mt-2 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> Tu margen neto (30% - desc)
                </p>
              </CardContent>
            </Card>

            {/* Coupons Management */}
            <Card className="bg-white/5 border-white/10 text-white rounded-3xl md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
                <CardTitle className="text-lg font-bold">Tus Cupones de Descuento</CardTitle>
                <Button 
                  onClick={() => setIsCreatingCoupon(true)}
                  className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 rounded-xl"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" /> Nuevo Cupón
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {coupons.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 italic text-sm">
                      No has creado ningún cupón todavía.
                    </div>
                  ) : (
                    coupons.map((coupon) => (
                      <div key={coupon.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group transition-all hover:border-primary/30">
                        <div className="flex items-center gap-6">
                          <div className="bg-primary/10 px-4 py-2 rounded-xl text-primary font-black tracking-widest text-lg">
                            {coupon.code}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                               <span className="text-xl font-bold">{coupon.discount}% DESC</span>
                               <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${coupon.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                 {coupon.status}
                               </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Válido para agendas General y VIP</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button 
                             onClick={() => copyToClipboard(coupon.code)}
                             variant="ghost" size="icon" className="text-gray-400 hover:text-white"
                           >
                             <Copy className="w-4 h-4" />
                           </Button>
                           <Button 
                             onClick={() => handleDeleteCoupon(coupon.id)}
                             variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10"
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Info & Tips */}
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20 text-white rounded-3xl p-4">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" /> Reglas del Cupón
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                  <p>Máximo de 30% de descuento permitido.</p>
                </div>
                <div className="flex gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                  <p>Solo aplicable a entradas de Agenda General y VIP.</p>
                </div>
                <div className="flex gap-3 text-sm text-gray-400">
                  <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                  <p>Las entradas para Nominados (acceso 1 día) no permiten cupones adicionales.</p>
                </div>
              </CardContent>
            </Card>

            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-blue-500/20">
               <TrendingUp className="w-10 h-10 text-blue-400 mb-4" />
               <h4 className="text-xl font-bold mb-2">Consejo de Aliado</h4>
               <p className="text-sm text-gray-400 leading-relaxed">
                 Los enlaces de referido funcionan mejor cuando se comparten junto a una recomendación personal en LinkedIn o grupos de WhatsApp corporativos.
               </p>
            </div>
          </div>
        </div>

        {/* Recent Sales Table */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/10">
            <h2 className="text-2xl font-bold flex items-center">
              <Users className="w-6 h-6 mr-3 text-primary" />
              Ventas Atribuidas
            </h2>
            <p className="text-gray-500 text-sm mt-1">Personas que usaron tu código o enlace para comprar.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">Cliente</th>
                  <th className="px-8 py-5">Agenda</th>
                  <th className="px-8 py-5">Cupón</th>
                  <th className="px-8 py-5">Pagado</th>
                  <th className="px-8 py-5 text-primary">Ganancia Aliado</th>
                  <th className="px-8 py-5">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {registrations.map((reg) => {
                  const earnings = calculateEarnings(reg);
                  return (
                    <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold">{reg.name}</div>
                        <div className="text-xs text-gray-500">{reg.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-black uppercase rounded-lg">
                          {reg.ticketType}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {reg.couponCode ? (
                          <span className="text-primary font-mono text-xs">{reg.couponCode}</span>
                        ) : (
                          <span className="text-gray-600 text-xs italic">Affiliate Link</span>
                        )}
                      </td>
                      <td className="px-8 py-6 font-mono text-sm font-bold">
                        €{reg.amount.toLocaleString()}
                      </td>
                      <td className="px-8 py-6 font-mono text-sm font-bold text-primary">
                        €{earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-8 py-6 text-xs text-gray-500">
                        {reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleDateString() : 'Reciente'}
                      </td>
                    </tr>
                  );
                })}
                {registrations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-gray-500 italic">
                      Todavía no se han registrado ventas bajo tu perfil.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Coupon Modal */}
      <AnimatePresence>
        {isCreatingCoupon && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#111] border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-6">Crear Nuevo Cupón</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Código Personalizado</label>
                  <input 
                    type="text" 
                    placeholder="Ej: ALIANZA20"
                    maxLength={15}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-lg font-black tracking-widest text-primary uppercase focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                  />
                  <p className="text-[10px] text-gray-500 mt-2 italic">Sin espacios, solo letras y números.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Descuento (%) - Máx 30%
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="5" 
                      max="30" 
                      step="5"
                      className="flex-grow accent-primary"
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(parseInt(e.target.value))}
                    />
                    <span className="text-2xl font-black w-12 text-center text-primary">{newCouponDiscount}%</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsCreatingCoupon(false)}
                    className="flex-1 py-6 rounded-xl border border-white/10 text-gray-400"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateCoupon}
                    className="flex-1 py-6 rounded-xl bg-primary text-black font-black"
                  >
                    Crear Cupón
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
