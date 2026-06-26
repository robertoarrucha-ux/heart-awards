'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import {
  Users,
  DollarSign,
  MapPin,
  ExternalLink,
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
import AdminGuard from '@/components/admin-guard';
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

function AdminDashboardContent() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [pageViews, setPageViews] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const statsRef = doc(db, 'admin_stats', 'page_views');
    const unsubscribe = onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        setPageViews(doc.data().total || 0);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Registration[];
      setRegistrations(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSyncVotes = async () => {
    if (
      !confirm(
        'Are you sure you want to sync votes from the logs? This will recalculate the total for each nominee based on individual records.'
      )
    )
      return;

    setIsSyncing(true);
    try {
      const result = await syncVotesAction();
      if (result.success) {
        toast({
          title: 'Sync Successful',
          description: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Sync Error',
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error in handleSyncVotes:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while syncing.',
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

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdminHeader title="Dashboard & Registrations" icon={LayoutDashboard} />

        {/* Stats + accesos clave */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +12% vs previous month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Registrations</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
              <p className="text-xs text-gray-500 mt-1">Confirmed attendees</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">General Visits</CardTitle>
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
                View more in Google Analytics <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Vienna Venue</CardTitle>
              <MapPin className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.viennaCount}</div>
              <p className="text-xs text-gray-500 mt-1">Registrations for Vienna</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Madrid Venue</CardTitle>
              <MapPin className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.madridCount}</div>
              <p className="text-xs text-gray-500 mt-1">Registrations for Madrid</p>
            </CardContent>
          </Card>

          {/* Gestión de Aliados */}
          <Card
            className="bg-white/5 border-white/10 text-white cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => (window.location.href = '/admin/partners')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Partner Management</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View Panel</div>
              <p className="text-xs text-primary mt-1">Approve and manage partners</p>
            </CardContent>
          </Card>

          {/* Acceso rápido a Nominaciones */}
          <Card
            className="bg-white/5 border-white/10 text-white cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => (window.location.href = '/admin/requests')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Nominations</CardTitle>
              <Ticket className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View requests</div>
              <p className="text-xs text-primary mt-1">Approve or reject nominations</p>
            </CardContent>
          </Card>

          {/* Acceso rápido a Pagos */}
          <Card
            className="bg-white/5 border-white/10 text-white cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => (window.location.href = '/admin/payments')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Payments</CardTitle>
              <DollarSign className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">View payments</div>
              <p className="text-xs text-primary mt-1">Payment history and status</p>
            </CardContent>
          </Card>
        </div>

        {/* Recuperación de votos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Vote Recovery</CardTitle>
              <TrendingUp className={`w-4 h-4 text-primary ${isSyncing ? 'animate-spin' : ''}`} />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400">
                Syncs nominee vote counts with individual records (logs) to recover votes lost due to technical errors.
              </p>
              <Button
                onClick={handleSyncVotes}
                disabled={isSyncing}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
              >
                {isSyncing ? 'Syncing...' : 'Run Vote Sync'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de asistentes */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold flex items-center">
              <Ticket className="w-5 h-5 mr-2 text-primary" />
              Attendee List
            </h2>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, email..."
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
                  <th className="px-6 py-4 font-medium">Attendee</th>
                  <th className="px-6 py-4 font-medium">Ticket</th>
                  <th className="px-6 py-4 font-medium">Venue</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
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
                        {reg.edition === 'vienna' ? 'Vienna' : 'Madrid'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">€{reg.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleDateString('en-US') : 'Recent'}
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                      No records found matching your search.
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

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
