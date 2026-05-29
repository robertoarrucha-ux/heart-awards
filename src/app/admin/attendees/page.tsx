
'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { updateFreeRegistrationStatusAction } from '@/app/actions';
import AdminHeader from '@/components/admin-header';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Users, Check, X, Mail, Globe, MessageCircle,
  ExternalLink, Search, Filter, CreditCard, Tag
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FreeRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  websiteOrLinkedin: string;
  participationStatus: string;
  whatsapp: string;
  venues?: string;
  comments?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

interface PaidRegistration {
  id: string;
  name: string;
  email: string;
  country?: string;
  whatsapp?: string;
  amount: number;
  currency: string;
  ticketType: string;
  edition: string;
  couponCode?: string;
  discountPercent?: number;
  partnerId?: string;
  stripeId: string;
  status: string;
  createdAt: any;
}

export default function AdminAttendeesPage() {
  const [freeRegs, setFreeRegs] = useState<FreeRegistration[]>([]);
  const [paidRegs, setPaidRegs] = useState<PaidRegistration[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [freeSearch, setFreeSearch] = useState('');
  const [paidSearch, setPaidSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const { toast } = useToast();

  const adminEmails = ['arrucha@theglobal.school', 'roberto@pro-latam.org'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!(user && adminEmails.includes(user.email || '')));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Free registrations
  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'free_registrations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFreeRegs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FreeRegistration[]);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  // Paid registrations
  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPaidRegs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PaidRegistration[]);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const result = await updateFreeRegistrationStatusAction(id, status);
      if (result.success) {
        toast({ title: `Registro ${status === 'approved' ? 'aprobado' : 'rechazado'}`, description: result.message });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "No se pudo actualizar el estado." });
    }
  };

  const filteredFree = freeRegs.filter(reg => {
    const matchesSearch = `${reg.firstName} ${reg.lastName} ${reg.email}`.toLowerCase().includes(freeSearch.toLowerCase());
    const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredPaid = paidRegs.filter(reg =>
    `${reg.name} ${reg.email}`.toLowerCase().includes(paidSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-muted-foreground">Inicia sesión con una cuenta de administrador.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <AdminHeader title="Gestión de Asistentes" icon={Users} />
          <div className="flex gap-3">
            <Badge variant="outline" className="px-3 py-1">Gratuitos: {freeRegs.length}</Badge>
            <Badge variant="outline" className="px-3 py-1 bg-green-500/10 text-green-400 border-green-500/20">Pagados: {paidRegs.length}</Badge>
          </div>
        </div>

        <Tabs defaultValue="free">
          <TabsList className="mb-6">
            <TabsTrigger value="free" className="gap-2">
              <Users className="w-4 h-4" /> Registros Gratuitos
              <Badge className="ml-1 bg-yellow-500/20 text-yellow-400 border-0">{freeRegs.filter(r => r.status === 'pending').length} pendientes</Badge>
            </TabsTrigger>
            <TabsTrigger value="paid" className="gap-2">
              <CreditCard className="w-4 h-4" /> Compras de Tickets
              <Badge className="ml-1 bg-green-500/20 text-green-400 border-0">{paidRegs.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* ── REGISTROS GRATUITOS ── */}
          <TabsContent value="free">
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar por nombre o email..." className="pl-10 bg-background/50" value={freeSearch} onChange={e => setFreeSearch(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select className="bg-background/50 border border-input rounded-md px-3 py-2 text-sm" value={filterStatus} onChange={(e: any) => setFilterStatus(e.target.value)}>
                  <option value="all">Todos</option>
                  <option value="pending">Pendientes</option>
                  <option value="approved">Aprobados</option>
                  <option value="rejected">Rechazados</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredFree.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">No se encontraron registros.</p>
                </div>
              ) : filteredFree.map(reg => (
                <div key={reg.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold">{reg.firstName} {reg.lastName}</h3>
                        <Badge className={`${reg.status === 'approved' ? 'bg-green-500/10 text-green-500' : reg.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {reg.status.toUpperCase()}
                        </Badge>
                        {reg.participationStatus && (
                          <Badge variant="outline" className="text-xs">{reg.participationStatus}</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(reg.createdAt?.toDate?.() || reg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4" /> {reg.email}</div>
                        <div className="flex items-center gap-2 text-muted-foreground"><Globe className="w-4 h-4" /> {reg.country}</div>
                        <div className="flex items-center gap-2 text-muted-foreground"><MessageCircle className="w-4 h-4" /> {reg.whatsapp}</div>
                        {reg.venues && <div className="flex items-center gap-2 text-primary text-xs font-medium">📍 {reg.venues}</div>}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {reg.websiteOrLinkedin && (
                          <a href={reg.websiteOrLinkedin} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 hover:text-primary bg-white/5 px-2 py-1 rounded">
                            <ExternalLink className="w-3 h-3" /> Website/LinkedIn
                          </a>
                        )}
                        {reg.comments && (
                          <p className="w-full text-xs text-muted-foreground italic bg-black/20 p-3 rounded-lg">"{reg.comments}"</p>
                        )}
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2 justify-center shrink-0">
                      {reg.status !== 'approved' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => handleStatusUpdate(reg.id, 'approved')}>
                          <Check className="w-4 h-4" /> Aprobar
                        </Button>
                      )}
                      {reg.status !== 'rejected' && (
                        <Button size="sm" variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10 gap-2" onClick={() => handleStatusUpdate(reg.id, 'rejected')}>
                          <X className="w-4 h-4" /> Rechazar
                        </Button>
                      )}
                      <Button size="sm" variant="secondary" onClick={() => window.location.href = `mailto:${reg.email}`} className="gap-2">
                        <Mail className="w-4 h-4" /> Email
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── COMPRAS DE TICKETS ── */}
          <TabsContent value="paid">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nombre o email..." className="pl-10 bg-background/50" value={paidSearch} onChange={e => setPaidSearch(e.target.value)} />
            </div>

            <div className="space-y-4">
              {filteredPaid.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">No hay compras de tickets registradas.</p>
                </div>
              ) : filteredPaid.map(reg => (
                <div key={reg.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold">{reg.name || 'Sin nombre'}</h3>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">PAGADO</Badge>
                        <Badge variant="outline" className="text-xs capitalize">{reg.ticketType}</Badge>
                        <Badge variant="outline" className="text-xs">{reg.edition}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(reg.createdAt?.toDate?.() || reg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4" /> {reg.email}</div>
                        {reg.country && (
                          <div className="flex items-center gap-2 text-muted-foreground"><Globe className="w-4 h-4" /> {reg.country}</div>
                        )}
                        {reg.whatsapp && (
                          <div className="flex items-center gap-2 text-muted-foreground"><MessageCircle className="w-4 h-4" /> {reg.whatsapp}</div>
                        )}
                        <div className="flex items-center gap-2 font-semibold text-green-400">
                          💳 {reg.amount?.toFixed(2)} {reg.currency?.toUpperCase()}
                          {reg.discountPercent ? <span className="text-xs text-yellow-400 font-normal">(-{reg.discountPercent}%)</span> : null}
                        </div>
                        {reg.couponCode && (
                          <div className="flex items-center gap-2 text-muted-foreground"><Tag className="w-4 h-4" /> Cupón: {reg.couponCode}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2 justify-center shrink-0">
                      <Button size="sm" variant="secondary" onClick={() => window.location.href = `mailto:${reg.email}`} className="gap-2">
                        <Mail className="w-4 h-4" /> Email
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
