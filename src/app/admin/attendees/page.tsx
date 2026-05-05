
'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import AdminHeader from '@/components/admin-header';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Check, 
  X, 
  Mail, 
  Globe, 
  MessageCircle, 
  Calendar,
  ExternalLink,
  Search,
  Filter,
  Download
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
  comments?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export default function AdminAttendeesPage() {
  const [registrations, setRegistrations] = useState<FreeRegistration[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const { toast } = useToast();

  const adminEmails = ['arrucha@theglobal.school', 'roberto@pro-latam.org'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && adminEmails.includes(user.email || '')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'free_registrations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const regs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FreeRegistration[];
      setRegistrations(regs);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'free_registrations', id), { status });
      toast({
        title: `Registro ${status === 'approved' ? 'aprobado' : 'rechazado'}`,
        description: "El estado se ha actualizado correctamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado.",
      });
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      `${reg.firstName} ${reg.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
      <AdminHeader title="Gestión de Asistentes" icon={Users} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Gestión de Asistentes (Acceso Gratis)
            </h1>
            <p className="text-muted-foreground mt-1">Revisa y aprueba solicitudes de acceso gratuito.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              Total: {registrations.length}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              Pendientes: {registrations.filter(r => r.status === 'pending').length}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <Card className="lg:col-span-3 bg-card/50 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div className="flex items-center gap-4 w-full">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar por nombre o email..." 
                    className="pl-10 bg-background/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select 
                    className="bg-background/50 border border-input rounded-md px-3 py-2 text-sm"
                    value={filterStatus}
                    onChange={(e: any) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="pending">Pendientes</option>
                    <option value="approved">Aprobados</option>
                    <option value="rejected">Rechazados</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRegistrations.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">No se encontraron registros.</p>
                  </div>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <div 
                      key={reg.id} 
                      className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold">
                              {reg.firstName} {reg.lastName}
                            </h3>
                            <Badge 
                              className={`
                                ${reg.status === 'approved' ? 'bg-green-500/10 text-green-500' : ''}
                                ${reg.status === 'rejected' ? 'bg-red-500/10 text-red-500' : ''}
                                ${reg.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                              `}
                            >
                              {reg.status.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reg.createdAt?.toDate?.() || reg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-4 h-4" /> {reg.email}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Globe className="w-4 h-4" /> {reg.country}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MessageCircle className="w-4 h-4" /> {reg.whatsapp}
                            </div>
                            <div className="flex items-center gap-2 text-primary font-medium">
                              <Users className="w-4 h-4" /> {reg.participationStatus}
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-4">
                             <a 
                               href={reg.websiteOrLinkedin} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-xs flex items-center gap-1 hover:text-primary transition-colors bg-white/5 px-2 py-1 rounded"
                             >
                                <ExternalLink className="w-3 h-3" /> Website/LinkedIn
                             </a>
                             {reg.comments && (
                               <div className="w-full text-xs text-muted-foreground italic bg-black/20 p-3 rounded-lg mt-2">
                                 " {reg.comments} "
                               </div>
                             )}
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2 justify-center shrink-0">
                          {reg.status !== 'approved' && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white gap-2"
                              onClick={() => handleStatusUpdate(reg.id, 'approved')}
                            >
                              <Check className="w-4 h-4" /> Aprobar
                            </Button>
                          )}
                          {reg.status !== 'rejected' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-red-500/30 text-red-500 hover:bg-red-500/10 gap-2"
                              onClick={() => handleStatusUpdate(reg.id, 'rejected')}
                            >
                              <X className="w-4 h-4" /> Rechazar
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => window.location.href = `mailto:${reg.email}`}
                            className="gap-2"
                          >
                            <Mail className="w-4 h-4" /> Notificar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-card/50 border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-white/5">
                  <span className="text-muted-foreground">Pendientes</span>
                  <span className="font-bold text-yellow-500">{registrations.filter(r => r.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-white/5">
                  <span className="text-muted-foreground">Aprobados</span>
                  <span className="font-bold text-green-500">{registrations.filter(r => r.status === 'approved').length}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-white/5">
                  <span className="text-muted-foreground">Rechazados</span>
                  <span className="font-bold text-red-500">{registrations.filter(r => r.status === 'rejected').length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
               <CardHeader>
                 <CardTitle className="text-lg flex items-center gap-2">
                   <Calendar className="w-5 h-5 text-primary" />
                   Acción Rápida
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-xs text-muted-foreground mb-4">
                   Recuerda que los asistentes aprobados deben ser notificados manualmente o mediante automatizaciones posteriores.
                 </p>
                 <Button className="w-full gap-2 text-xs" variant="outline">
                   <Download className="w-4 h-4" /> Exportar a CSV
                 </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
