'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, getDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { updatePartnerStatusAction } from '@/app/actions';
import {
  Users,
  CheckCircle2,
  Search,
  Mail,
  Building2,
  Trash2,
  Ban,
  ExternalLink,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import Footer from '@/components/footer';
import AdminHeader from '@/components/admin-header';
import AdminGuard from '@/components/admin-guard';
import { useToast } from '@/hooks/use-toast';

interface Partner {
  id: string;
  name: string;
  email: string;
  organization: string;
  website?: string;
  referralCode: string;
  status: 'active' | 'suspended' | 'pending' | 'rejected';
  clickCount: number;
  createdAt: any;
}

function AdminPartnersContent() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'partners'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPartners(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Partner[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Approve or reject pending applications — uses server action to send email
  const handleDecision = async (partner: Partner, decision: 'active' | 'rejected') => {
    const key = `${partner.id}-${decision}`;
    setActionLoading(key);
    try {
      const result = await updatePartnerStatusAction(partner.id, decision, {
        name: partner.name,
        email: partner.email,
        organization: partner.organization,
      });
      if (result.success) {
        toast({ title: decision === 'active' ? '✅ Partner approved' : '❌ Application rejected', description: result.message });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not update status.' });
    } finally {
      setActionLoading(null);
    }
  };

  // Suspend / reactivate active partners — no email, direct Firestore write
  const handleToggleSuspend = async (partnerId: string, newStatus: 'active' | 'suspended') => {
    try {
      await updateDoc(doc(db, 'partners', partnerId), { status: newStatus });
      toast({ title: 'Status updated', description: `Partner marked as ${newStatus}.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update status.' });
    }
  };

  const handleDeletePartner = async (partnerId: string) => {
    if (!confirm('Are you sure you want to delete this partner? Their click tracking will be lost.')) return;
    try {
      await deleteDoc(doc(db, 'partners', partnerId));
      toast({ title: 'Partner deleted' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error deleting' });
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

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdminHeader title="Partner Management" icon={Users} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <Card className="bg-white/5 border-white/10 text-white">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Total Applications</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold">{partners.filter(p => p.status === 'pending').length}</div>
               <p className="text-xs text-yellow-500 mt-2">Pending approval</p>
             </CardContent>
           </Card>

           <Card className="bg-white/5 border-white/10 text-white">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Active Partners</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold">{partners.filter(p => p.status === 'active').length}</div>
               <p className="text-xs text-green-500 mt-2">Generating traffic</p>
             </CardContent>
           </Card>

           <Card className="bg-white/5 border-white/10 text-white">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-400">Total Partner Traffic</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-4xl font-bold">
                 {partners.reduce((acc, p) => acc + (p.clickCount || 0), 0)}
               </div>
               <p className="text-xs text-blue-500 mt-2">Unique clicks</p>
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
                  placeholder="Name, email or company..."
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
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <p className="text-xs text-gray-500">Showing {filteredPartners.length} records</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">Partner</th>
                  <th className="px-8 py-5">Organization / Website</th>
                  <th className="px-8 py-5">Referral / Code</th>
                  <th className="px-8 py-5">Clicks</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Actions</th>
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
                      {p.website && (
                        <a href={p.website} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                          <ExternalLink className="w-3 h-3" /> {p.website.replace(/^https?:\/\//, '')}
                        </a>
                      )}
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
                        p.status === 'active'    ? 'bg-green-500/10 text-green-400' :
                        p.status === 'pending'   ? 'bg-yellow-500/10 text-yellow-400 animate-pulse' :
                        p.status === 'rejected'  ? 'bg-red-500/10 text-red-400' :
                        /* suspended */             'bg-orange-500/10 text-orange-400'
                      }`}>
                        {p.status === 'active' ? 'Active' : p.status === 'pending' ? 'Pending' : p.status === 'rejected' ? 'Rejected' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 flex-wrap">

                        {/* Pending: Approve + Reject buttons with email notification */}
                        {p.status === 'pending' && (<>
                          <Button
                            onClick={() => handleDecision(p, 'active')}
                            disabled={actionLoading !== null}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white h-8 gap-1"
                          >
                            {actionLoading === `${p.id}-active`
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <CheckCircle2 className="w-3.5 h-3.5" />}
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleDecision(p, 'rejected')}
                            disabled={actionLoading !== null}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:bg-red-500/10 h-8 gap-1 border border-red-500/20"
                          >
                            {actionLoading === `${p.id}-rejected`
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <XCircle className="w-3.5 h-3.5" />}
                            Reject
                          </Button>
                        </>)}

                        {/* Active: Suspend button */}
                        {p.status === 'active' && (
                          <Button
                            onClick={() => handleToggleSuspend(p.id, 'suspended')}
                            size="sm" variant="ghost" className="text-yellow-500 hover:bg-yellow-500/10 h-8"
                          >
                            <Ban className="w-4 h-4 mr-1" /> Suspend
                          </Button>
                        )}

                        {/* Suspended: Reactivate button */}
                        {p.status === 'suspended' && (
                          <Button
                            onClick={() => handleToggleSuspend(p.id, 'active')}
                            size="sm" variant="ghost" className="text-green-500 hover:bg-green-500/10 h-8"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Reactivate
                          </Button>
                        )}

                        {/* Delete always visible */}
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

export default function AdminPartnersPage() {
  return (
    <AdminGuard>
      <AdminPartnersContent />
    </AdminGuard>
  );
}
