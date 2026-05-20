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
import { Loader2 } from 'lucide-react';

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
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Stringify metadata con useMemo para evitar PaymentIntents duplicados en re-renders
  const metadataString = useMemo(() => JSON.stringify(metadata), [metadata.edition, metadata.ticketType, metadata.coupon]);

  const fetchPaymentIntent = async (code?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
          couponCode: code,
          partnerId: localStorage.getItem('affiliate_ref') || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      setClientSecret(data.clientSecret);
      if (data.discountedAmount) {
        setDiscountedPrice(data.discountedAmount);
      } else {
        setDiscountedPrice(null);
      }
      
      if (code) {
        setAppliedCoupon(code);
      }
    } catch (err: any) {
      console.error('Error fetching client secret:', err);
      setError(err.message || 'Error inesperado al iniciar el pago.');
      // Si el cupón falló, reiniciamos el intento sin cupón si todavía no teníamos uno exitoso
      if (code && !appliedCoupon) {
        setCouponInput('');
      }
    } finally {
      setLoading(false);
      setValidatingCoupon(false);
    }
  };

  useEffect(() => {
    if (isOpen && amount > 0) {
      // Use initial coupon if available in metadata or localStorage
      const initialCoupon = metadata.coupon || localStorage.getItem('applied_coupon');
      fetchPaymentIntent(initialCoupon || undefined);
    } else {
      setClientSecret(null);
      setAppliedCoupon(null);
      setDiscountedPrice(null);
      setCouponInput('');
    }
  }, [isOpen, amount, metadataString]);

  const handleApplyCoupon = async (e: FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    setValidatingCoupon(true);
    await fetchPaymentIntent(couponInput.trim());
  };

  const handleSuccess = () => {
    window.location.href = '/tickets/success';
  };

  const displayAmount = discountedPrice !== null ? discountedPrice : amount;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-sans">
            Completar Pago
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Estás adquiriendo: <span className="text-white font-medium">{ticketName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {/* Coupon Section */}
          {!clientSecret && loading ? null : (
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-400">Resumen:</span>
                <div className="text-right">
                  {discountedPrice !== null && (
                    <span className="text-sm line-through text-gray-500 mr-2">
                      {currency === 'mxn' ? 'MX$' : '€'}{(amount / 100).toFixed(2)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-[#d4af37]">
                    {currency === 'mxn' ? 'MX$' : '€'}{(displayAmount / 100).toFixed(2)}
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
                      fetchPaymentIntent();
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
                onClick={() => fetchPaymentIntent(appliedCoupon || undefined)}
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
                  variables: {
                    colorPrimary: '#d4af37',
                  }
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
