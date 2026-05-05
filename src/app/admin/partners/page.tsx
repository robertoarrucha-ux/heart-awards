'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, getDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ShieldCheck,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ExternalLink,
  Mail,
  Building2,
  MoreVertical,
  Trash2,
  Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import AdminHeader from '@/components/admin-header';
import { useToast } from '@/hooks/use-toast';

interface Partner {
  id: string;
  name: string;
  email: string;
  organization: string;
  referralCode: string;
  status: 'active' | 'suspended' | 'pending';
  clickCount: number;
  createdAt: any;
}

export default function AdminPartnersPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const adminEmails = ['arrucha@theglobal.school', 'roberto@pro-latam.org'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        if (user.email && adminEmails.includes(user.email)) {
          setIsAdmin(true);
        } else {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, 'partners'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPartners(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Partner[]);
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  const handleUpdateStatus = async (partnerId: string, newStatus: 'active' | 'suspended' | 'pending') => {
    try {
      await updateDoc(doc(db, 'partners', partnerId), { status: newStatus });
      
      // If approved, also sync user role
      if (newStatus === 'active') {
        const userRef = doc(db, 'users', partnerId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          await updateDoc(userRef, { role: 'partner' });
        } else {
           // Create user record if missing
           const partnerSnap = await getDoc(doc(db, 'partners', partnerId));
           const pData = partnerSnap.data();
           await setDoc(userRef, {
             email: pData?.email,
             role: 'partner'
           });
        }
      }

      toast({ title: 'Estado actualizado', description: `Socio marcado como ${newStatus}.` });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el estado.' });
    }
  };

  const handleDeletePartner = async (partnerId: string) => {
    if (!confirm('¿Estás seguro de eliminar a este socio? Se perderá su seguimiento de clicks.')) return;
    try {
      await deleteDoc(doc(db, 'partners', partnerId));
      toast({ title: 'Socio eliminado' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error al eliminar' });
    }
  };

  const filteredPartners = partners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-white text-2xl font-bold">Sin Autorización</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdminHeader title="Gestión de Aliados" icon={Users} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <Card className="bg-white/5 border-white/10 text-white">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Total Solicitudes</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold">{partners.filter(p => p.status === 'pending').length}</div>
               <p className="text-xs text-yellow-500 mt-2">Pendientes de aprobación</p>
             </CardContent>
           </Card>
           
           <Card className="bg-white/5 border-white/10 text-white">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Aliados Activos</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold">{partners.filter(p => p.status === 'active').length}</div>
               <p className="text-xs text-green-500 mt-2">Generando tráfico</p>
             </CardContent>
           </Card>

           <Card className="bg-white/5 border-white/10 text-white">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Tráfico Total Aliados</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold">
                 {partners.reduce((acc, p) => acc + (p.clickCount || 0), 0)}
               </div>
               <p className="text-xs text-blue-500 mt-2">Clicks únicos</p>
             </CardContent>
           </Card>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Nombre, email o empresa..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los Estados</option>
                <option value="pending">Pendientes</option>
                <option value="active">Activos</option>
                <option value="suspended">Suspendidos</option>
              </select>
            </div>
            <p className="text-xs text-gray-500">Mostrando {filteredPartners.length} registros</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">Socio</th>
                  <th className="px-8 py-5">Organización</th>
                  <th className="px-8 py-5">Referido / Código</th>
                  <th className="px-8 py-5">Clicks</th>
                  <th className="px-8 py-5">Estado</th>
                  <th className="px-8 py-5">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPartners.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {p.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        {p.organization}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="font-mono text-xs bg-black/40 px-2 py-1 rounded text-primary">
                         {p.referralCode}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-black">{p.clickCount || 0}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'active' ? 'bg-green-500/10 text-green-400' : 
                        p.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 animate-pulse' : 
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {p.status === 'pending' && (
                          <Button 
                            onClick={() => handleUpdateStatus(p.id, 'active')}
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white h-8"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Aprobar
                          </Button>
                        )}
                        {p.status === 'active' && (
                          <Button 
                            onClick={() => handleUpdateStatus(p.id, 'suspended')}
                            size="sm" variant="ghost" className="text-yellow-500 hover:bg-yellow-500/10 h-8"
                          >
                            <Ban className="w-4 h-4 mr-1" /> Suspender
                          </Button>
                        )}
                        {p.status === 'suspended' && (
                          <Button 
                            onClick={() => handleUpdateStatus(p.id, 'active')}
                            size="sm" variant="ghost" className="text-green-500 hover:bg-green-500/10 h-8"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Reactivar
                          </Button>
                        )}
                        <Button 
                          onClick={() => handleDeletePartner(p.id)}
                          size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/10 h-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
