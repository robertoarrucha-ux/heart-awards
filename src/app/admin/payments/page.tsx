
'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin-header';
import AdminGuard from '@/components/admin-guard';
import { 
  CreditCard, 
  Plus, 
  Tag, 
  RefreshCcw, 
  ExternalLink, 
  Link as LinkIcon, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getStripeProductsAction, 
  getStripeCouponsAction, 
  createStripeProductAction, 
  createStripeCouponAction,
  createStripePaymentLinkAction
} from './stripe-actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function AdminPaymentsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const { toast } = useToast();

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    amount: 0,
    currency: 'eur'
  });

  const [couponForm, setCouponForm] = useState({
    id: '',
    name: '',
    percent_off: 0,
    duration: 'once' as 'once' | 'repeating' | 'forever'
  });

  const fetchData = async () => {
    setIsLoading(true);
    const [productsRes, couponsRes] = await Promise.all([
      getStripeProductsAction(),
      getStripeCouponsAction()
    ]);

    if (productsRes.success) setProducts(productsRes.products || []);
    if (couponsRes.success) setCoupons(couponsRes.coupons || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingProduct(true);
    const result = await createStripeProductAction(productForm);
    setIsCreatingProduct(false);

    if (result.success) {
      toast({ title: 'Éxito', description: 'Producto creado correctamente en Stripe.' });
      setProductForm({ name: '', description: '', amount: 0, currency: 'eur' });
      fetchData();
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingCoupon(true);
    const result = await createStripeCouponAction(couponForm);
    setIsCreatingCoupon(false);

    if (result.success) {
      toast({ title: 'Éxito', description: 'Cupón creado correctamente en Stripe.' });
      setCouponForm({ id: '', name: '', percent_off: 0, duration: 'once' });
      fetchData();
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  const handleCreatePaymentLink = async (priceId: string) => {
    const result = await createStripePaymentLinkAction(priceId);
    if (result.success && result.url) {
      window.open(result.url, '_blank');
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  return (
    <AdminGuard>
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-grow container mx-auto px-4 py-8">
          <AdminHeader title="Gestión de Pagos & Stripe" icon={CreditCard} />

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="bg-white/5 border border-white/10 p-1">
              <TabsTrigger value="products" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Productos & Precios
              </TabsTrigger>
              <TabsTrigger value="coupons" className="gap-2">
                <Tag className="w-4 h-4" />
                Cupones & Descuentos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">Productos Activos</h2>
                    <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
                      <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : products.length === 0 ? (
                    <Card className="bg-white/5 border-dashed border-white/10">
                      <CardContent className="py-12 text-center">
                        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No se encontraron productos activos en Stripe.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map((product) => {
                        const price = product.default_price;
                        return (
                          <Card key={product.id} className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                <Badge variant="outline">{product.active ? 'Activo' : 'Inactivo'}</Badge>
                              </div>
                              <CardDescription className="line-clamp-1">{product.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-4">
                              <div className="text-2xl font-black text-primary">
                                {price ? `${(price.unit_amount / 100).toLocaleString()} ${price.currency.toUpperCase()}` : 'Sin precio'}
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1 font-mono">{product.id}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">Price ID: {price?.id}</p>
                            </CardContent>
                            <CardFooter className="pt-0 flex flex-col gap-2">
                              <div className="flex w-full gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1 gap-2 text-[10px]"
                                  onClick={() => {
                                    navigator.clipboard.writeText(price?.id || '');
                                    toast({ title: 'Copiado', description: 'Price ID copiado al portapapeles.' });
                                  }}
                                  disabled={!price}
                                >
                                  Copiar Price ID
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1 gap-2 text-[10px]"
                                  onClick={() => handleCreatePaymentLink(price?.id)}
                                  disabled={!price}
                                >
                                  <LinkIcon className="w-3 h-3" />
                                  Abrir Pago
                                </Button>
                              </div>
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full gap-2 text-[10px]"
                                onClick={async () => {
                                  const res = await createStripePaymentLinkAction(price?.id);
                                  if (res.success && res.url) {
                                    navigator.clipboard.writeText(res.url);
                                    toast({ title: 'Copiado', description: 'Link de pago copiado al portapapeles.' });
                                  }
                                }}
                                disabled={!price}
                              >
                                <ExternalLink className="w-3 h-3" />
                                Copiar Link de Pago (Stripe)
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Create Product Form */}
                <Card className="bg-white/5 border-white/10 h-fit sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Nuevo Producto
                    </CardTitle>
                    <CardDescription>Crea un producto y precio directamente en Stripe.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateProduct} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="prod-name">Nombre</Label>
                        <Input 
                          id="prod-name" 
                          placeholder="Ej: Ticket VIP Viena" 
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          required
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prod-desc">Descripción</Label>
                        <Input 
                          id="prod-desc" 
                          placeholder="Descripción del ticket..." 
                          value={productForm.description}
                          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="prod-amount">Precio</Label>
                          <Input 
                            id="prod-amount" 
                            type="number" 
                            value={productForm.amount}
                            onChange={(e) => setProductForm({...productForm, amount: parseFloat(e.target.value)})}
                            required
                            className="bg-black/20 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="prod-currency">Moneda</Label>
                          <select 
                            id="prod-currency"
                            className="w-full h-10 px-3 rounded-md bg-black/20 border border-white/10 text-sm focus:outline-none"
                            value={productForm.currency}
                            onChange={(e) => setProductForm({...productForm, currency: e.target.value})}
                          >
                            <option value="eur">EUR</option>
                            <option value="usd">USD</option>
                          </select>
                        </div>
                      </div>
                      <Button type="submit" className="w-full mt-4" disabled={isCreatingProduct}>
                        {isCreatingProduct ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                        Crear en Stripe
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="coupons" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coupon List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">Cupones Disponibles</h2>
                    <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
                      <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : coupons.length === 0 ? (
                    <Card className="bg-white/5 border-dashed border-white/10">
                      <CardContent className="py-12 text-center">
                        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No se encontraron cupones en Stripe.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {coupons.map((coupon) => (
                        <Card key={coupon.id} className="bg-white/5 border-white/10">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg font-mono">{coupon.id}</CardTitle>
                              <Badge variant="secondary">{coupon.duration}</Badge>
                            </div>
                            <CardDescription>{coupon.name || 'Sin nombre descriptivo'}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-black text-amber-500">
                              {coupon.percent_off ? `${coupon.percent_off}% OFF` : `${(coupon.amount_off / 100).toLocaleString()} ${coupon.currency.toUpperCase()} OFF`}
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <p className="text-xs text-muted-foreground italic">
                                {coupon.times_redeemed} veces usados
                              </p>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-[10px] gap-1"
                                onClick={() => {
                                  navigator.clipboard.writeText(coupon.id);
                                  toast({ title: 'Copiado', description: 'Código de cupón copiado.' });
                                }}
                              >
                                Copiar Código
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Create Coupon Form */}
                <Card className="bg-white/5 border-white/10 h-fit sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Nuevo Cupón
                    </CardTitle>
                    <CardDescription>Crea un código de descuento para los tickets.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateCoupon} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cp-id">Código (ID)</Label>
                        <Input 
                          id="cp-id" 
                          placeholder="Ej: SUMMER2026" 
                          value={couponForm.id}
                          onChange={(e) => setCouponForm({...couponForm, id: e.target.value.toUpperCase()})}
                          required
                          className="bg-black/20 border-white/10 font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cp-name">Nombre Interno</Label>
                        <Input 
                          id="cp-name" 
                          placeholder="Ej: Descuento Verano" 
                          value={couponForm.name}
                          onChange={(e) => setCouponForm({...couponForm, name: e.target.value})}
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cp-percent">Descuento (%)</Label>
                        <Input 
                          id="cp-percent" 
                          type="number" 
                          value={couponForm.percent_off}
                          onChange={(e) => setCouponForm({...couponForm, percent_off: parseInt(e.target.value)})}
                          required
                          className="bg-black/20 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cp-duration">Duración</Label>
                        <select 
                          id="cp-duration"
                          className="w-full h-10 px-3 rounded-md bg-black/20 border border-white/10 text-sm focus:outline-none"
                          value={couponForm.duration}
                          onChange={(e) => setCouponForm({...couponForm, duration: e.target.value as any})}
                        >
                          <option value="once">Un solo uso (Once)</option>
                          <option value="forever">Para siempre (Forever)</option>
                          <option value="repeating">Repetible (Repeating)</option>
                        </select>
                      </div>
                      <Button type="submit" className="w-full mt-4" disabled={isCreatingCoupon}>
                        {isCreatingCoupon ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Tag className="w-4 h-4 mr-2" />}
                        Crear Cupón
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminGuard>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
