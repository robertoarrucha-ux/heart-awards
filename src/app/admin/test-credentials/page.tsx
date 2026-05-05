
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, LayoutDashboard, Mail, CreditCard, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { sendTestEmailAction } from '@/app/actions';
import { getStripeProductsAction } from '@/app/admin/payments/stripe-actions';
import Header from '@/components/header';
import Footer from '@/components/footer';
import AdminHeader from '@/components/admin-header';
import AdminGuard from '@/components/admin-guard';

export default function TestCredentialsPage() {
    const [email, setEmail] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailResult, setEmailResult] = useState<{ success: boolean; message: string } | null>(null);

    const [stripeLoading, setStripeLoading] = useState(false);
    const [stripeResult, setStripeResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleTestEmail = async () => {
        if (!email) return;
        setEmailLoading(true);
        setEmailResult(null);
        try {
            const result = await sendTestEmailAction(email);
            setEmailResult(result);
        } catch (error: any) {
            setEmailResult({ success: false, message: error.message || 'Error desconocido al enviar correo' });
        } finally {
            setEmailLoading(false);
        }
    };

    const handleTestStripe = async () => {
        setStripeLoading(true);
        setStripeResult(null);
        try {
            const result = await getStripeProductsAction();
            if (result.success) {
                setStripeResult({ success: true, message: 'Conexión con Stripe establecida correctamente. Productos recuperados con éxito.' });
            } else {
                setStripeResult({ success: false, message: result.message || 'Error al conectar con Stripe' });
            }
        } catch (error: any) {
            setStripeResult({ success: false, message: error.message || 'Error desconocido al conectar con Stripe' });
        } finally {
            setStripeLoading(false);
        }
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#050505] text-white">
                <Header />
                
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <AdminHeader title="Test de Credenciales" icon={Shield} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-white/5 border-white/10 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="w-5 h-5" />
                                    Acumbamail (SMTP)
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Prueba la configuración de SMTP enviando un correo de prueba.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="test-email">Correo destino</Label>
                                    <Input
                                        id="test-email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>

                                {emailResult && (
                                    <div className={`p-3 rounded-lg flex items-start gap-3 ${emailResult.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {emailResult.success ? (
                                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        )}
                                        <p className="text-sm">{emailResult.message}</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleTestEmail} 
                                    disabled={emailLoading || !email}
                                    className="w-full"
                                >
                                    {emailLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Enviar Correo de Prueba
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="bg-white/5 border-white/10 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Stripe (API)
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Verifica la conexión con Stripe listando los productos activos.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-400">
                                    Esto validará que tu <code>STRIPE_SECRET_KEY</code> sea correcta y tenga permisos para leer productos.
                                </p>

                                {stripeResult && (
                                    <div className={`p-3 rounded-lg flex items-start gap-3 ${stripeResult.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {stripeResult.success ? (
                                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        )}
                                        <p className="text-sm">{stripeResult.message}</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    onClick={handleTestStripe} 
                                    disabled={stripeLoading}
                                    className="w-full"
                                >
                                    {stripeLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Probar Conexión Stripe
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>

                <Footer />
            </div>
        </AdminGuard>
    );
}
