
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Shield, AlertTriangle, Users, Mail, BarChart3, History, Ticket, ExternalLink, LogOut, type LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

type AdminHeaderProps = {
  title: string;
  icon: LucideIcon;
};

const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/requests", label: "Solicitudes", icon: Mail },
    { href: "/admin/attendees", label: "Asistentes", icon: Users },
    { href: "/admin/payments", label: "Pagos", icon: Ticket },
    { href: "/admin/test-credentials", label: "Test Credenciales", icon: Shield },
    { href: "/admin/audit", label: "Audit Trail", icon: History },
    { href: "/admin/adjust-votes", label: "Ajuste Manual", icon: AlertTriangle, destructive: true },
];

export default function AdminHeader({ title, icon: Icon }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="space-y-4 mb-8">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Icon /> {title}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 hover:bg-white/10" onClick={() => window.open('https://analytics.google.com/analytics/web/?authuser=3#/a375278391p513271747/reports/intelligenthome?params=_u..nav%3Dmaui', '_blank')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" size="sm" className="border-white/10 bg-white/5 hover:bg-white/10" onClick={() => window.open('https://dashboard.stripe.com', '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Stripe
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {navLinks.map(link => (
          <Button
            key={link.href}
            asChild
            variant={pathname === link.href ? "default" : (link.destructive ? "destructive" : "outline")}
            className={cn(
                link.destructive && pathname !== link.href && "text-destructive-foreground bg-destructive/80 hover:bg-destructive"
            )}
          >
            <Link href={link.href}>
              <link.icon className="mr-2 h-4 w-4" />
              {link.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
