
'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User, browserPopupRedirectResolver } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAILS = ['arrucha@theglobal.school', 'roberto@pro-latam.org'];

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      toast({
        title: "Sesión iniciada",
        description: "Has iniciado sesión correctamente.",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      let message = "No se pudo iniciar sesión con Google.";
      
      if (error.code === 'auth/popup-closed-by-user') {
        message = "La ventana de inicio de sesión se cerró antes de completar el proceso.";
      } else if (error.code === 'auth/unauthorized-domain') {
        message = "This domain (heart.awards-global.org) is not authorized in the Firebase console. Please add it in the Authorized Domains section of Firebase Auth.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "El inicio de sesión con Google no está habilitado en Firebase.";
      }
      
      setError(message);
      toast({
        variant: "destructive",
        title: "Error de Autenticación",
        description: message,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const isAuthorized = user?.email && ADMIN_EMAILS.includes(user.email);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <Shield className="w-16 h-16 text-primary mb-6" />
        <h1 className="text-3xl font-bold mb-4">Acceso Restringido</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Esta área es exclusiva para administradores. Por favor, inicia sesión para continuar.
        </p>
        
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive text-sm max-w-md">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-left">{error}</p>
          </div>
        )}

        <Button onClick={handleLogin} size="lg" className="gap-2">
          <LogIn className="w-5 h-5" /> Iniciar Sesión con Google
        </Button>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <Shield className="w-16 h-16 text-destructive mb-6" />
        <h1 className="text-3xl font-bold mb-4">No Autorizado</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Tu cuenta ({user.email}) no tiene permisos de administrador.
        </p>
        <div className="flex gap-4">
            <Button onClick={handleLogout} variant="outline" className="gap-2">
                <LogOut className="w-5 h-5" /> Cerrar Sesión
            </Button>
            <Button onClick={() => router.push('/')} className="gap-2">
                Volver al Inicio
            </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest">
            <Shield size={14} /> Modo Administrador: {user.email}
        </div>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
            <LogOut size={14} /> Salir
        </button>
      </div>
      {children}
    </>
  );
}
