'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  amount: number;
  currency?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CheckoutForm({ amount, currency = 'eur', onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/tickets/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
      setIsProcessing(false);
    } else {
      // For payments requiring redirection
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-3 rounded bg-red-500/20 text-red-400 text-sm border border-red-500/30">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-white/10 hover:bg-white/5"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="flex-1 bg-[#d4af37] hover:bg-[#b08d2c] text-black font-semibold"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            `Pagar ${currency === 'mxn' ? 'MX$' : '€'}${(amount / 100).toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  );
}
