'use client';

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CheckoutForm } from './checkout-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';

const countries = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba",
  "Ecuador", "El Salvador", "España", "Guatemala", "Honduras", "México",
  "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico", "República Dominicana",
  "Uruguay", "Venezuela", "Austria", "Alemania", "Suiza", "Otro"
];

interface BuyerInfo {
  name: string;
  country: string;
  whatsapp: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceId: string;
  amount: number;
  ticketName: string;
  currency?: string;
  metadata: {
    edition: string;
    ticketType: string;
    [key: string]: string;
  };
}

let stripePromise: any = null;
const getStripePromise = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
    if (!key) {
      console.warn('Stripe Publishable Key is missing from environment variables');
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export function PaymentModal({
  isOpen,
  onClose,
  priceId,
  amount,
  ticketName,
  currency = 'eur',
  metadata
}: PaymentModalProps) {
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({ name: '', country: '', whatsapp: '' });

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Stringify metadata to avoid duplicate PaymentIntents on re-renders
  const metadataString = useMemo(() => JSON.stringify(metadata), [metadata.edition, metadata.ticketType, metadata.coupon]);

  // Reset everything when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('info');
      setBuyerInfo({ name: '', country: '', whatsapp: '' });
      setClientSecret(null);
      setAppliedCoupon(null);
      setDiscountedPrice(null);
      setCouponInput('');
      setError(null);
    }
  }, [isOpen]);

  const fetchPaymentIntent = async (buyer: BuyerInfo, code?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          metadata: {
            ...metadata,
            name: buyer.name,
            country: buyer.country,
            whatsapp: buyer.whatsapp,
          },
          couponCode: code,
          partnerId: localStorage.getItem('affiliate_ref') || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }

      setClientSecret(data.clientSecret);
      setDiscountedPrice(data.discountedAmount ?? null);

      if (code) setAppliedCoupon(code);
    } catch (err: any) {
      console.error('Error fetching client secret:', err);
      setError(err.message || 'Error inesperado al iniciar el pago.');
      if (code && !appliedCoupon) setCouponInput('');
    } finally {
      setLoading(false);
      setValidatingCoupon(false);
    }
  };

  // ── STEP 1: Buyer info form ──────────────────────────────────────────────
  const handleInfoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const buyer: BuyerInfo = {
      name: (form.elements.namedItem('buyerName') as HTMLInputElement).value.trim(),
      country: (form.elements.namedItem('buyerCountry') as HTMLSelectElement).value,
      whatsapp: (form.elements.namedItem('buyerWhatsapp') as HTMLInputElement).value.trim(),
    };
    setBuyerInfo(buyer);
    setStep('payment');
    const initialCoupon = metadata.coupon || localStorage.getItem('applied_coupon');
    await fetchPaymentIntent(buyer, initialCoupon || undefined);
  };

  // ── STEP 2: Coupon re-validation ─────────────────────────────────────────
  const handleApplyCoupon = async (e: FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setValidatingCoupon(true);
    await fetchPaymentIntent(buyerInfo, couponInput.trim());
  };

  const handleSuccess = () => {
    window.location.href = '/tickets/success';
  };

  const displayAmount = discountedPrice !== null ? discountedPrice : amount;
  const currSymbol = currency === 'mxn' ? 'MX$' : '€';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-sans">
            {step === 'info' ? 'Tus Datos' : 'Completar Pago'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === 'info'
              ? 'Necesitamos algunos datos antes de procesar tu pago.'
              : <>Estás adquiriendo: <span className="text-white font-medium">{ticketName}</span></>
            }
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {/* ── STEP 1: Info form ── */}
          {step === 'info' && (
            <form onSubmit={handleInfoSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Nombre completo <span className="text-red-500">*</span></Label>
                <Input
                  id="buyerName"
                  name="buyerName"
                  placeholder="Tu nombre y apellido"
                  required
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerCountry">País <span className="text-red-500">*</span></Label>
                <select
                  id="buyerCountry"
                  name="buyerCountry"
                  required
                  defaultValue=""
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                >
                  <option value="" disabled>Selecciona tu país</option>
                  {countries.map(c => (
                    <option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerWhatsapp">WhatsApp <span className="text-red-500">*</span></Label>
                <Input
                  id="buyerWhatsapp"
                  name="buyerWhatsapp"
                  placeholder="+1234567890"
                  required
                  className="bg-white/5 border-white/10 focus:border-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-5 rounded-xl gap-2"
              >
                Continuar al Pago <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* ── STEP 2: Coupon + Stripe ── */}
          {step === 'payment' && (
            <>
              {/* Buyer info summary */}
              <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 flex flex-wrap gap-x-6 gap-y-1">
                <span>👤 {buyerInfo.name}</span>
                <span>🌍 {buyerInfo.country}</span>
                <span>📱 {buyerInfo.whatsapp}</span>
                <button
                  type="button"
                  onClick={() => { setStep('info'); setClientSecret(null); }}
                  className="text-primary underline ml-auto hover:text-primary/70"
                >
                  Editar
                </button>
              </div>

              {/* Coupon + price summary */}
              {!(loading && !clientSecret) && (
                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-400">Resumen:</span>
                    <div className="text-right">
                      {discountedPrice !== null && (
                        <span className="text-sm line-through text-gray-500 mr-2">
                          {currSymbol}{(amount / 100).toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-[#d4af37]">
                        {currSymbol}{(displayAmount / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Código de cupón"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] placeholder:text-gray-600"
                        disabled={validatingCoupon || loading}
                      />
                      <button
                        type="submit"
                        disabled={validatingCoupon || loading || !couponInput.trim()}
                        className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between text-sm bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg px-3 py-2">
                      <span className="text-[#d4af37] font-medium">Cupón aplicado: {appliedCoupon}</span>
                      <button
                        onClick={() => {
                          setAppliedCoupon(null);
                          setDiscountedPrice(null);
                          setCouponInput('');
                          fetchPaymentIntent(buyerInfo);
                        }}
                        className="text-gray-400 hover:text-white text-xs underline"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {loading && !clientSecret ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
                  <p className="text-gray-400">Preparando pasarela segura...</p>
                </div>
              ) : error ? (
                <div className="p-4 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  <p className="font-semibold mb-1">Hubo un problema</p>
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={() => fetchPaymentIntent(buyerInfo, appliedCoupon || undefined)}
                    className="mt-4 text-sm underline hover:text-white"
                  >
                    Volver a intentar
                  </button>
                </div>
              ) : clientSecret ? (
                <Elements
                  key={clientSecret}
                  stripe={getStripePromise()}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'night',
                      variables: { colorPrimary: '#d4af37' }
                    }
                  }}
                >
                  <CheckoutForm
                    amount={displayAmount}
                    currency={currency}
                    onSuccess={handleSuccess}
                    onCancel={onClose}
                  />
                </Elements>
              ) : null}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
