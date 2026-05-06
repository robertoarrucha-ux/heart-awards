'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { motion } from 'motion/react';
import {
  Users,
  DollarSign,
  MapPin,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Ticket,
  Search,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import AdminHeader from '@/components/admin-header';
import { syncVotesAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface Registration {
  id: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  ticketType: string;
  edition: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [pageViews, setPageViews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const adminEmails = ['arrucha@theglobal.school', 'roberto@pro-latam.org'];

  useEffect(() => {
    if (isAdmin) {
      const statsRef = doc(db, 'admin_stats', 'page_views');
      const unsubscribe = onSnapshot(statsRef, (doc) => {
        if (doc.exists()) {
          setPageViews(doc.data().total || 0);
        }
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

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
      const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Registration[];
        setRegistrations(data);
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleSyncVotes = async () => {
    if (
      !confirm(
        '¿Estás seguro de que quieres sincronizar los votos desde los logs? Esto recalculará el total de cada nominado basándose en los registros individuales.'
      )
    )
      return;

    setIsSyncing(true);
    try {
      const result = await syncVotesAction();
      if (result.success) {
        toast({
          title: 'Sincronización Exitosa',
          description: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error en Sincronización',
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error in handleSyncVotes:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error inesperado al sincronizar.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const stats = {
    totalRevenue: registrations.reduce((acc, reg) => acc + reg.amount, 0),
    totalRegistrations: registrations.length,
    viennaCount: registrations.filter((r) => r.edition === 'vienna').length,
    madridCount: registrations.filter((r) => r.edition === 'madrid').length,
  };

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.ticketType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <ShieldCheck className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Acceso Restringido</h1>
          <p className="text-gray-400">Este panel es exclusivo para administradores de Latam Awards.</p>
          {!user ? (
            <Button onClick={handleLogin} className="w-full py-6 text-lg font-bold rounded-xl">
              Iniciar Sesión como Admin
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-red-400 text-sm">Tu cuenta ({user.email}) no tiene permisos de administrador.</p>
              <Button variant="outline" onClick={handleLogout} className="w-full border-white/10 text-white">
                Cerrar Sesión
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdminHeader title="Dashboard & Registros" icon={LayoutDashboard} />

        {/* Stats + accesos clave */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Ingresos Totales</CardTitle>
              <DollarSign className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +12% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Registros</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
              <p className="text-xs text-gray-500 mt-1">Asistentes confirmados</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Visitas Generales</CardTitle>
              <Search className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pageViews.toLocaleString()}</div>
              <Button
                variant="link"
                className="text-xs text-primary p-0 h-auto mt-1"
                onClick={() =>
                  window.open(
                    'https://analytics.google.com/analytics/web/?authuser=3#/a375278391p513271747/reports/intelligenthome?params=_u..nav%3Dmaui',
                    '_blank'
                  )
                }
              >
                Ver más en Google Analytics <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Sede Viena</CardTitle>
              <MapPin className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.viennaCount}</div>
              <p className="text-xs text-gray-500 mt-1">Registros para Viena</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Sede Madrid</CardTitle>
              <MapPin className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.madridCount}</div>
              <p className="text-xs text-gray-500 mt-1">Registros para Madrid</p>
            </CardContent>
          </Card>

          {/* Gestión de Aliados */}
          <Card
            className="bg-white/5 border-white/10 text-white cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => (window.location.href = '/admin/partners')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Gestión de Aliados</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ver Panel</div>
              <p className="text-xs text-primary mt-1">Aprobar y gestionar socios</p>
            </CardContent>
          </Card>

          {/* Acceso rápido a Nominaciones */}
          <Card
            className="bg-white/5 border-white/10 text-white cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => (window.location.href = '/admin/requests')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Nominaciones</CardTitle>
              <Ticket className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ver solicitudes</div>
              <p className="text-xs text-primary mt-1">Aprobar o rechazar nominaciones</p>
            </CardContent>
          </Card>

          {/* Acceso rápido a Pagos */}
          <Card
            className="bg-white/5 border-white/10 text-white cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => (window.location.href = '/admin/payments')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pagos</CardTitle>
              <DollarSign className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ver pagos</div>
              <p className="text-xs text-primary mt-1">Historial y estado de pagos</p>
            </CardContent>
          </Card>
        </div>

        {/* Recuperación de votos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Recuperación de Votos</CardTitle>
              <TrendingUp className={`w-4 h-4 text-primary ${isSyncing ? 'animate-spin' : ''}`} />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400">
                Sincroniza el conteo de votos de los nominados con los registros individuales (logs) para recuperar
                votos perdidos por errores técnicos.
              </p>
              <Button
                onClick={handleSyncVotes}
                disabled={isSyncing}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
              >
                {isSyncing ? 'Sincronizando...' : 'Ejecutar Sincronización de Votos'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de asistentes */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold flex items-center">
              <Ticket className="w-5 h-5 mr-2 text-primary" />
              Listado de Asistentes
            </h2>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nombre, email..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Asistente</th>
                  <th className="px-6 py-4 font-medium">Ticket</th>
                  <th className="px-6 py-4 font-medium">Sede</th>
                  <th className="px-6 py-4 font-medium">Monto</th>
                  <th className="px-6 py-4 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{reg.name}</div>
                      <div className="text-sm text-gray-500">{reg.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase">
                        {reg.ticketType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                        {reg.edition === 'vienna' ? 'Viena' : 'Madrid'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">€{reg.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleDateString() : 'Reciente'}
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                      No se encontraron registros que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
